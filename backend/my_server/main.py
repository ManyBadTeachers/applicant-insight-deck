from config import app
from flask import request, jsonify, redirect, render_template
from database import create_connection
from datetime import datetime

from functions import send_email
import json
import json
import re


@app.route("/get_rejection_emails", methods=["GET"])
def get_rejection_emails():
    conn = create_connection()
    cur = conn.cursor()
    sql = "SELECT * FROM RejectionEmails"
    cur.execute(sql)
    RejectionEmails = cur.fetchall()
    conn.close()
    return jsonify({"RejectionEmails": RejectionEmails})


@app.route("/update_rejection_email", methods=["PUT"])
def update_rejection_email():
    data = request.get_json()
    email_id = data.get("id")
    new_body = data.get("body")

    if not email_id or new_body is None:
        return jsonify({"error": "Missing id or body"}), 400

    conn = create_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE RejectionEmails SET body = ? WHERE id = ?",
            (new_body, email_id),
        )
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

    return jsonify({"message": "Successfully updated email"})


@app.route("/create_applicant", methods=["POST"])
def create_applicant():
    try:
        data = request.get_json()

        # Required fields
        full_name = data.get("FullName")
        expertise = data.get("Expertise", "")
        email = data.get("Email", "")
        phone = data.get("Phone", "")
        first_name = data.get("FirstName", "")
        last_name = data.get("LastName", "")
        nationality = data.get("Nationality", "")
        cv = data.get("CV", "📄 CV Placeholder") 
        form_id = data.get("FormID", 1)  # default to 1 if not provided

        if not full_name:
            return jsonify({"error": "FullName is required"}), 400

        # Insert into Applicants with form_id
        conn = create_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO Applicants
            (form_id, FullName, Status, Expertise, Email, Phone, FirstName, LastName, Nationality, CV)
            VALUES (?, ?, 'Submitted Form', ?, ?, ?, ?, ?, ?, ?)
        """, (form_id, full_name, expertise, email, phone, first_name, last_name, nationality, cv))
        conn.commit()
        conn.close()

        return jsonify({"message": f"Successfully created applicant '{full_name}'"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/get_applicants", methods=["GET"])
def get_applicants():
    conn = create_connection()
    cur = conn.cursor()

    form_id = request.args.get("form_id", type=int)

    sql = """
        SELECT 
            ID AS applicant_id,
            FullName,
            Status,
            Expertise,
            Email,
            Phone,
            FirstName,
            LastName,
            Nationality,
            CV,
            SubmissionDate
        FROM Applicants
    """
    if form_id:
        sql += " WHERE form_id = ?"

    if form_id:
        cur.execute(sql, (form_id,))
    else:
        cur.execute(sql)

    applicants = cur.fetchall()
    conn.close()

    print(f"applicants {applicants}")
    return jsonify({"applicants": applicants})

@app.route("/get_applicants_in_hiring_process", methods=["GET"])
def get_applicants_in_hiring_process():
    conn = create_connection()
    cur = conn.cursor()

    form_id = request.args.get("form_id", type=int)

    sql = """
        SELECT 
            a.ID AS applicant_id,
            a.FullName,
            a.Expertise,
            a.Status,
            s.*
        FROM Applicants a
        JOIN application_steps s ON a.ID = s.applicant_id
    """
    if form_id:
        sql += " WHERE a.form_id = ?"

    if form_id:
        cur.execute(sql, (form_id,))
    else:
        cur.execute(sql)

    rows = cur.fetchall()
    col_names = [desc[0] for desc in cur.description]
    conn.close()


    applicants = []

    for row in rows:
        row_dict = dict(zip(col_names, row))
        applicant_data = {
            "id": row_dict["applicant_id"],
            "fullName": row_dict["FullName"],
            "expertise": row_dict["Expertise"],
            "Status": row_dict["Status"]
        }        

        applicants.append(applicant_data)

    return jsonify({"applicants": applicants})

@app.route("/get_all_forms", methods=["GET"])
def get_all_forms():
    conn = create_connection()
    cur = conn.cursor()

    cur.execute("SELECT form_id, name FROM hiring_stats")
    rows = cur.fetchall()
    conn.close()

    forms = [{"form_id": row[0], "name": row[1]} for row in rows]
    return jsonify({"forms": forms})


@app.route("/applicant/<int:applicant_id>/notes", methods=["GET"])
def get_notes(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    # Fetch applicant
    cur.execute("SELECT FullName FROM applicants WHERE ID = ?", (applicant_id,))
    applicant_row = cur.fetchone()
    if not applicant_row:
        conn.close()
        return jsonify({"error": "Applicant not found"}), 404

    # Fetch notes
    cur.execute(
        "SELECT id, content FROM note WHERE applicant_id = ? ORDER BY id DESC",
        (applicant_id,)
    )
    notes_rows = cur.fetchall()
    notes_list = [
        {
            "id": n[0],
            "content": n[1]
        }
        for n in notes_rows
    ]

    conn.close()
    return jsonify({
        "applicant_id": applicant_id,
        "name": applicant_row[0],
        "notes": notes_list
    })

@app.route("/note/create", methods=["POST"])
def create_note():
    data = request.get_json()
    applicant_id = data.get("applicant_id")
    content = data.get("content", "").strip()

    print(f"applicant_id {applicant_id}")
    print(f"content {content}")

    


    if not applicant_id or not content:
        return jsonify({"error": "applicant_id and content are required"}), 400

    conn = create_connection()
    cur = conn.cursor()
    timestamp = datetime.utcnow().isoformat()
    cur.execute(
        "INSERT INTO note (applicant_id, content) VALUES (?, ?)",
        (applicant_id, content)
    )
    conn.commit()
    note_id = cur.lastrowid
    conn.close()

    return jsonify({
        "id": note_id,
        "applicant_id": applicant_id,
        "content": content
    }), 201

@app.route("/note/edit/<int:note_id>", methods=["PUT", "PATCH"])
def edit_note(note_id):
    data = request.get_json()
    new_content = data.get("content", "").strip()

    if not new_content:
        return jsonify({"error": "content is required"}), 400

    conn = create_connection()
    cur = conn.cursor()
    cur.execute("UPDATE note SET content = ? WHERE id = ?", (new_content, note_id))
    conn.commit()

    if cur.rowcount == 0:
        conn.close()
        return jsonify({"error": "Note not found"}), 404

    # Fetch updated note
    cur.execute("SELECT id, content FROM note WHERE id = ?", (note_id,))
    updated_note = cur.fetchone()
    conn.close()

    return jsonify({
        "id": updated_note[0],
        "content": updated_note[1]
    }), 200

@app.route("/note/delete/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    conn = create_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM note WHERE id = ?", (note_id,))
    conn.commit()

    if cur.rowcount == 0:
        conn.close()
        return jsonify({"error": "Note not found"}), 404

    conn.close()
    return jsonify({"message": "Note deleted"}), 200


@app.route("/hiring_steps/submit-form/<int:applicant_id>", methods=["GET"])
def hiring_step_submit_form(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    sql = """
    SELECT 
    a.FullName, 
    a.Email, 
    a.SubmissionDate, 
    a.form_id,
    h.name AS step_name
    FROM applicants a
    JOIN hiring_stats h 
        ON a.form_id = h.form_id
    WHERE a.ID = ?;
    """

    cur.execute(sql, (applicant_id,))
    result = cur.fetchone()

    data = {
            "fullname": result[0],
            "email": result[1],
            "submissionsdate": result[2],
            "formName": result[4],
            "completed": True
        }

    return jsonify(data)

@app.route("/get_applicant_hiring_steps/<int:applicant_id>", methods=["GET"])
def get_applicant_hiring_steps(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    sql = """
    SELECT
        main.id AS step_id,
        main.title AS step_name,
        CASE 
            WHEN COUNT(sub.id) = SUM(CASE WHEN a.step_id IS NOT NULL THEN 1 ELSE 0 END)
            THEN 1
            ELSE 0
        END AS completed
    FROM hiring_steps main
    LEFT JOIN hiring_steps sub 
        ON sub.sub_step = 1 AND sub.title LIKE main.title || '%'
    LEFT JOIN applicant_hiring_steps a 
        ON sub.id = a.step_id AND a.applicant_id = ?
    WHERE main.sub_step = 0
    GROUP BY main.id, main.title
    ORDER BY main.id;
    """

    cur.execute(sql, (applicant_id,))
    rows = cur.fetchall()

    data = [
        {
            "step_id": row[0],
            "step_name": row[1],
            "completed": row[2]
        }
        for row in rows
    ]

    return jsonify(data)

@app.route("/hiring_steps/screening/<int:applicant_id>", methods=["GET"])
def hiring_steps_screening(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    # List of screening step names
    screening_steps = ["Screening Started", "Screening Finished", "Screening Reviewed"]

    # SQL: join with applicants to get applicant name
    sql = """
    SELECT 
        h.title AS step_name,
        CASE WHEN a.step_id IS NOT NULL THEN 1 ELSE 0 END AS completed,
        ap.FullName AS applicant_name
    FROM hiring_steps h
    LEFT JOIN applicant_hiring_steps a
        ON h.id = a.step_id AND a.applicant_id = ?
    LEFT JOIN applicants ap
        ON ap.ID = ?
    WHERE h.title IN (?, ?, ?)
    ORDER BY h.id;
    """

    cur.execute(sql, (applicant_id, applicant_id, *screening_steps))
    rows = cur.fetchall()

    # Convert to list of dicts
    data = [
        {"step_name": row[0], "completed": row[1], "applicant_name": row[2]}
        for row in rows
    ]

    return jsonify(data)

@app.route("/hiring_steps/edit/", methods=["POST"])
def hiring_steps_edit():
    data = request.get_json()
    applicant_id = data.get("applicant_id")
    step_name = data.get("step_name")
    action = data.get("action")  # "finish" or "skip"

    if not applicant_id or not step_name or action not in ["finish", "skip"]:
        return jsonify({"error": "Missing or invalid parameters"}), 400

    conn = create_connection()
    cur = conn.cursor()

    # Get the step ID from the step name
    cur.execute("SELECT id FROM hiring_steps WHERE title = ?", (step_name,))
    step_row = cur.fetchone()
    if not step_row:
        return jsonify({"error": f"Step '{step_name}' not found"}), 404
    step_id = step_row[0]

    # Check if the step already exists in the junction table
    cur.execute(
        "SELECT id FROM applicant_hiring_steps WHERE applicant_id = ? AND step_id = ?",
        (applicant_id, step_id),
    )
    row = cur.fetchone()

    if row:
        # Step already exists, we just need to update 'skipped' if action is skip
        if action == "skip":
            cur.execute(
                "UPDATE applicant_hiring_steps SET skipped = 1 WHERE id = ?",
                (row[0],)
            )
        # If action is finish and row exists, do nothing (already completed)
        message = f"Step '{step_name}' already completed for applicant {applicant_id}."
    else:
        # Insert new record
        skipped = 1 if action == "skip" else 0
        cur.execute(
            "INSERT INTO applicant_hiring_steps (applicant_id, step_id, skipped) VALUES (?, ?, ?)",
            (applicant_id, step_id, skipped),
        )
        message = f"Step '{step_name}' updated successfully for applicant {applicant_id}."

    conn.commit()
    return jsonify({"message": message})

@app.route("/hiring_steps/interview/<int:applicant_id>", methods=["GET"])
def hiring_steps_interview(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    # List of interview step names
    interview_steps = ["Suggest Interview Email", "Interview Scheduled", "Interview Finished"]

    # SQL: join with applicants to get applicant name and check completion
    sql_steps = """
    SELECT 
        h.title AS step_name,
        CASE WHEN a.step_id IS NOT NULL THEN 1 ELSE 0 END AS completed,
        ap.FullName AS applicant_name
    FROM hiring_steps h
    LEFT JOIN applicant_hiring_steps a
        ON h.id = a.step_id AND a.applicant_id = ?
    LEFT JOIN applicants ap
        ON ap.ID = ?
    WHERE h.title IN (?, ?, ?)
    ORDER BY h.id;
    """
    cur.execute(sql_steps, (applicant_id, applicant_id, *interview_steps))
    step_rows = cur.fetchall()

    steps_data = [
        {"step_name": row[0], "completed": row[1], "applicant_name": row[2]}
        for row in step_rows
    ]

    # SQL: fetch all interview notes for this applicant
    sql_notes = """
    SELECT applicant_id, content
    FROM interview_notes
    WHERE applicant_id = ?;
    """
    cur.execute(sql_notes, (applicant_id,))
    note_rows = cur.fetchall()

    notes_data = [{"applicant_id": row[0], "content": row[1]} for row in note_rows]

    # Return both steps and notes
    return jsonify({"steps": steps_data, "notes": notes_data})


@app.route("/hiring_steps/fee_model/<int:applicant_id>", methods=["GET"])
def hiring_steps_fee_model(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    # List of screening step names
    screening_steps = ["Fee Model Email", "Fee Model Negotiation", "Fee Model Accepted"]

    sql = """
    SELECT 
        h.title AS step_name,
        CASE WHEN a.step_id IS NOT NULL THEN 1 ELSE 0 END AS completed,
        ap.FullName AS applicant_name
    FROM hiring_steps h
    LEFT JOIN applicant_hiring_steps a
        ON h.id = a.step_id AND a.applicant_id = ?
    LEFT JOIN applicants ap
        ON ap.ID = ?
    WHERE h.title IN (?, ?, ?)
    ORDER BY h.id;
    """

    cur.execute(sql, (applicant_id, applicant_id, *screening_steps))
    rows = cur.fetchall()

    # Convert to list of dicts
    data = [
        {"step_name": row[0], "completed": row[1], "applicant_name": row[2]}
        for row in rows
    ]

    return jsonify(data)


@app.route("/hiring_steps/writing_assignment/<int:applicant_id>", methods=["GET"])
def hiring_steps_writing_assignment(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    # List of writing assignment step names
    writing_steps = [
        "Writing Assignment Email",
        "Writing Assignment Started",
        "Writing Assignment Ended",
        "Review Writing Assignment",
        "Writing Assignment Result"
    ]

    sql = f"""
    SELECT 
        h.title AS step_name,
        CASE WHEN a.step_id IS NOT NULL THEN 1 ELSE 0 END AS completed,
        ap.FullName AS applicant_name
    FROM hiring_steps h
    LEFT JOIN applicant_hiring_steps a
        ON h.id = a.step_id AND a.applicant_id = ?
    LEFT JOIN applicants ap
        ON ap.ID = ?
    WHERE h.title IN ({','.join(['?'] * len(writing_steps))})
    ORDER BY h.id;
    """

    cur.execute(sql, (applicant_id, applicant_id, *writing_steps))
    rows = cur.fetchall()

    steps_data = [
        {"step_name": row[0], "completed": row[1], "applicant_name": row[2]}
        for row in rows
    ]

    return jsonify(steps_data)

@app.route("/hiring_steps/contract/<int:applicant_id>", methods=["GET"])
def hiring_steps_contract(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    # List of contract step names
    contract_steps = [
        "Contract Sent",
        "Contract Under Review",
        "Contract Result"
    ]

    sql = f"""
    SELECT 
        h.title AS step_name,
        CASE WHEN a.step_id IS NOT NULL THEN 1 ELSE 0 END AS completed,
        ap.FullName AS applicant_name
    FROM hiring_steps h
    LEFT JOIN applicant_hiring_steps a
        ON h.id = a.step_id AND a.applicant_id = ?
    LEFT JOIN applicants ap
        ON ap.ID = ?
    WHERE h.title IN ({','.join(['?'] * len(contract_steps))})
    ORDER BY h.id;
    """

    cur.execute(sql, (applicant_id, applicant_id, *contract_steps))
    rows = cur.fetchall()

    steps_data = [
        {"step_name": row[0], "completed": row[1], "applicant_name": row[2]}
        for row in rows
    ]

    return jsonify(steps_data)

"""
@app.route('/webhookcallback', methods=['POST'])
def webhook():
    print(" Webhook triggered!")

    try:
        conn = create_connection()
        cur = conn.cursor()

        # Insert a new applicant with current timestamp
        sql_insert = "INSERT INTO new_applicants (SubmissionDate) VALUES (?)"
        cur.execute(sql_insert, (datetime.now().strftime("%Y-%m-%d %H:%M:%S"),))
        conn.commit()

        # Get the new applicant ID
        cur.execute("SELECT last_insert_rowid()")
        applicant_id = cur.fetchone()[0]
        print(f"✅ New applicant inserted with ApplicantID: {applicant_id}")

    except Exception as e:
        print("❌ Error:", str(e))
    finally:
        cur.close()
        conn.close()

    return jsonify({"status": "ok", "ApplicantID": applicant_id}), 200
"""

def extract_email_from_data(data):
    """
    Extracts an email from a dictionary of data using both a regex search in text fields
    and a fallback search in likely email keys.
    """
    email = None

    # 1️⃣ Try "pretty" or text fields first (human-readable summary)
    text_fields = ["pretty", "description", "summary", "notes"]  # add more if needed
    for field in text_fields:
        content = data.get(field)
        if content:
            if isinstance(content, list):
                content = " ".join(str(c) for c in content)
            match = re.search(
                r"(?:E[-]?mail|Email|email|user[_]?email|contact[_]?mail)\s*[:=]?\s*([\w\.-]+@[\w\.-]+\.\w+)",
                content,
                re.IGNORECASE
            )
            if match:
                email = match.group(1).strip()
                return email  # return immediately if found

    # 2️⃣ Fallback: search keys in cleaned_data that likely contain emails
    likely_email_keywords = [
        "email", "e-mail", "mail", "user_email", "contactmail",
        "contact_email", "personal_email", "work_email", "emailAddress",
        "email_address", "primary_email", "secondary_email", "reply_to"
    ]

    for key, value in data.items():
        key_lower = key.lower()
        for keyword in likely_email_keywords:
            if keyword in key_lower:
                email = value[0] if isinstance(value, list) else value
                email = str(email).strip()
                return email

    # Default if nothing found
    return "unknown"


from openai import OpenAI
from pydantic import BaseModel
from typing import List


my_secret_key = "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"


client = OpenAI(api_key=my_secret_key)

class QuestionAnswer(BaseModel):
    question: str
    answer: str

class ApplicantData(BaseModel):
    FullName: str | None
    Expertise: str | None
    Email: str | None
    Phone: str | None
    FirstName: str | None
    LastName: str | None
    Nationality: str | None
    form_id: str | None
    Questions: List[QuestionAnswer]

def extract_applicant_data(raw_json: dict | str) -> dict:
    """
    Sends the raw JSON to ChatGPT and requests structured parsing into:
    - Applicant data (FullName, Email, etc.)
    - List of question/answer pairs
    """

    if isinstance(raw_json, dict):
        raw_json_str = json.dumps(raw_json, ensure_ascii=False)
    else:
        raw_json_str = raw_json

    response = client.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a data parser AI. The user will send you raw JSON from a form submission. "
                    "Extract the following fields if present: FullName, Expertise, Email, Phone, "
                    "FirstName, LastName, Nationality, SubmissionDate, form_id. "
                    "Also extract all question/answer pairs you can find and return them as a list "
                    "with objects containing 'question' and 'answer'. Return null if a value cannot be found. Combine FirstName and LastName to get FullName if not found."
                ),
            },
            {
                "role": "user",
                "content": raw_json_str
            },
        ],
        response_format=ApplicantData,
    )

    parsed = response.choices[0].message.parsed
    return parsed.model_dump()


@app.route('/webhookcallback', methods=['POST'])
def webhook():
    print("Webhook triggered")
    print("Headers:", dict(request.headers))
    print("Content-Type:", request.content_type)

    data = request.get_json(silent=True)
    if not data:
        data = request.form.to_dict(flat=False)
    if not data:
        data = {"raw_body": request.data.decode("utf-8", errors="ignore")}

    print("Raw received data:", data)

    keys_to_remove = {
        "validatedNewRequiredFieldIDs", "visitedPages", "path", "uploadServerUrl",
        "eventObserver", "file_server", "buildDate", "jsExecutionTracker",
        "slug", "temp_upload", "rawRequest", "event_id", "submitSource", "timeToSubmit", "customParams", "fromTable", "appID",
        "documentID", "teamID", "parent", "isSilent", "unread", "subject",
        "customBody", "action"
    }

    cleaned_data = {k: v for k, v in data.items() if k not in keys_to_remove}
    print("Cleaned data:", cleaned_data)

    form_id = cleaned_data.get("formID")
    if isinstance(form_id, list):
        form_id = form_id[0]

    form_title = cleaned_data.get("formTitle")
    if isinstance(form_title, list):
        form_title = form_title[0]

    email = extract_email_from_data(cleaned_data)
    print("Extracted formID:", form_id, "formTitle:", form_title, "email:", email)

    gpt_output = extract_applicant_data(cleaned_data)

    print("\n" * 4)
    print(f"Received GPT Output:\n{json.dumps(gpt_output, indent=2)}")
    print("\n" * 4)

    # Add the new applicant to db
    try:
        conn = create_connection()
        cur = conn.cursor()

        full_name = gpt_output.get("FullName")
        expertise = gpt_output.get("Expertise")
        email = gpt_output.get("Email")
        phone = gpt_output.get("Phone")
        first_name = gpt_output.get("FirstName")
        last_name = gpt_output.get("LastName")
        nationality = gpt_output.get("Nationality")
        form_id = gpt_output.get("form_id")

        submission_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cv = "coming soon"

        sql = """
            INSERT INTO applicants 
            (FullName, Status, Expertise, Email, Phone, FirstName, LastName, Nationality, CV, SubmissionDate, form_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        cur.execute(sql, (
            full_name,
            "Submitted Form",
            expertise,
            email,
            phone,
            first_name,
            last_name,
            nationality,
            cv,
            submission_date,
            form_id
        ))

        conn.commit()
        conn.close()
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
    # Add new form to db if new. Otherwise update form data
    try:
        conn = create_connection()
        cur = conn.cursor()

        # Check if this form already exists
        sql = "SELECT total_applicants FROM hiring_stats WHERE form_id = ? AND name = ?"
        cur.execute(sql, (form_id, form_title))
        row = cur.fetchone()
        print(f"hiring_stats row: {row}")

        if row:
            sql = "UPDATE hiring_stats SET total_applicants = total_applicants + 1 WHERE form_id = ? AND name = ?"
            cur.execute(sql, (form_id, form_title))
        else:
            sql = "INSERT INTO hiring_stats (form_id, name, total_applicants) VALUES (?, ?, ?)"
            cur.execute(sql, (form_id, form_title, 1))

        conn.commit()
        conn.close()

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": str(e)}), 500


    # Save cleaned_data to DB
    try:
        conn = create_connection()
        cursor = conn.cursor()

        json_str = json.dumps(cleaned_data)
        sql = "INSERT INTO form_response_raw (email, json, formID, formTitle) VALUES (?, ?, ?, ?)"
        cursor.execute(sql, (email, json_str, form_id, form_title))

        conn.commit()
        conn.close()

    except Exception as e:
        print("Database error:", e)
        return jsonify({"message": str(e)}), 500
    

    return jsonify({"message": "Successfully added form data into database!"}), 200


@app.route('/new_applicants', methods=['GET'])
def get_new_applicants():
    try:
        conn = create_connection()
        cur = conn.cursor()

        # Fetch all rows
        cur.execute("SELECT ApplicantID, SubmissionDate FROM new_applicants ORDER BY SubmissionDate DESC")
        rows = cur.fetchall()

        # Convert to list of dictionaries
        applicants_list = [{"ApplicantID": row[0], "SubmissionDate": row[1]} for row in rows]

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({"status": "ok", "new_applicants": applicants_list}), 200

@app.route('/delete_new_applicant', methods=['POST'])
def delete_new_applicant():
    try:
        data = request.get_json()
        if not data or "applicant_id" not in data:
            return jsonify({"status": "error", "message": "Missing applicant_id"}), 400

        applicant_id = data["applicant_id"]

        conn = create_connection()
        cur = conn.cursor()

        # Delete the row
        cur.execute("DELETE FROM new_applicants WHERE ApplicantID = ?", (applicant_id,))
        conn.commit()

        if cur.rowcount == 0:
            return jsonify({"status": "error", "message": "ApplicantID not found"}), 404

        print(f"Applicant with ID {applicant_id} deleted.")

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({"status": "ok", "message": f"Applicant {applicant_id} deleted"}), 200

@app.route("/add_improvement_suggestions", methods=["POST"])
def add_improvement_suggestions():
    conn = create_connection()
    cur = conn.cursor()

    data = request.get_json()
    content = data.get("content", "").strip()

    if not content:
        return {"error": "Content cannot be empty"}, 400

    sql = "INSERT INTO development_suggestions (content) VALUES (?)"
    cur.execute(sql, (content,))
    conn.commit()
    conn.close()

    return {"message": "Suggestion added successfully"}, 201


@app.route("/applicant/<int:applicant_id>/details", methods=["GET"])
def get_applicant_details(applicant_id):
    conn = create_connection()
    cur = conn.cursor()

    # Fetch applicant details
    cur.execute("""
        SELECT 
            ID AS applicant_id,
            FullName,
            Status,
            Expertise,
            Email,
            Phone,
            FirstName,
            LastName,
            Nationality,
            CV,
            SubmissionDate,
            form_id
        FROM Applicants
        WHERE ID = ?
    """, (applicant_id,))
    applicant_row = cur.fetchone()
    
    if not applicant_row:
        conn.close()
        return jsonify({"error": "Applicant not found"}), 404

    # Convert applicant details to dictionary
    applicant_data = {
        "applicant_id": applicant_row[0],
        "fullName": applicant_row[1],
        "status": applicant_row[2],
        "expertise": applicant_row[3],
        "email": applicant_row[4],
        "phone": applicant_row[5],
        "firstName": applicant_row[6],
        "lastName": applicant_row[7],
        "nationality": applicant_row[8],
        "cv": applicant_row[9],
        "submissionDate": applicant_row[10],
        "form_id": applicant_row[11]
    }

    # Fetch form name from hiring_stats
    cur.execute("SELECT name FROM hiring_stats WHERE form_id = ?", (applicant_data["form_id"],))
    form_row = cur.fetchone()
    applicant_data["form_name"] = form_row[0] if form_row else None

    # Fetch notes
    cur.execute(
        "SELECT id, content FROM note WHERE applicant_id = ? ORDER BY id DESC",
        (applicant_id,)
    )
    notes_rows = cur.fetchall()
    notes_data = [{"id": row[0], "content": row[1]} for row in notes_rows]

    # Fetch hiring steps
    cur.execute("""
        SELECT
            main.id AS step_id,
            main.title AS step_name,
            CASE 
                WHEN COUNT(sub.id) = SUM(CASE WHEN a.step_id IS NOT NULL THEN 1 ELSE 0 END)
                THEN 1
                ELSE 0
            END AS completed,
            a.skipped
        FROM hiring_steps main
        LEFT JOIN hiring_steps sub 
            ON sub.sub_step = 1 AND sub.title LIKE main.title || '%'
        LEFT JOIN applicant_hiring_steps a 
            ON sub.id = a.step_id AND a.applicant_id = ?
        WHERE main.sub_step = 0
        GROUP BY main.id, main.title
        ORDER BY main.id
    """, (applicant_id,))
    steps_rows = cur.fetchall()
    steps_data = [
        {
            "step_id": row[0],
            "step_name": row[1],
            "completed": bool(row[2]),
            "skipped": bool(row[3]) if row[3] is not None else False
        }
        for row in steps_rows
    ]

    # Fetch interview notes
    cur.execute(
        "SELECT applicant_id, content FROM interview_notes WHERE applicant_id = ?",
        (applicant_id,)
    )
    interview_notes_rows = cur.fetchall()
    interview_notes_data = [{"applicant_id": row[0], "content": row[1]} for row in interview_notes_rows]

    conn.close()

    # Combine all data
    result = {
        "applicant": applicant_data,
        "notes": notes_data,
        "hiring_steps": steps_data,
        "interview_notes": interview_notes_data
    }

    return jsonify(result)


@app.route('/get_applicants_answers/<int:applicant_id>', methods=['GET'])
def get_applicants_answers(applicant_id):
    try:
        conn = create_connection()
        cur = conn.cursor()

        # Fetch applicant answers
        cur.execute("SELECT * FROM form_responses WHERE ApplicantID = ?", (applicant_id,))
        row = cur.fetchone()

        if not row:
            return jsonify({"error": "Applicant not found"}), 404

        # Get column names
        column_names = [description[0] for description in cur.description]

        # Convert row to dictionary
        result = {column_names[i]: row[i] for i in range(len(column_names))}

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()
        conn.close()

@app.route("/check_email", methods=["POST"])
def check_email():
    data = request.get_json()
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"email": False, "error": "Email is required"}), 400

    try:
        conn = create_connection()
        cur = conn.cursor()
        # Use lowercase comparison to avoid case issues
        sql = "SELECT Email FROM applicants WHERE LOWER(Email) = LOWER(?)"
        cur.execute(sql, (email,))
        result = cur.fetchone()
    except Exception as e:
        return jsonify({"email": False, "error": str(e)}), 500
    finally:
        if conn:
            conn.close()

    if result:
        return jsonify({"email": True})
    else:
        return jsonify({"email": False})
    
    
@app.route("/writing_assignment_confirmation_email", methods=["POST"])
def writing_assignment_confirmation_email():
    data = request.get_json()
    email = data.get("email", "").strip()
    start_time = data.get("startTime", "").strip()

    if not email or not start_time:
        return jsonify({"success": False, "error": "Email and startTime are required"}), 400

    subject = "Writing Assignment - Confirmation Email"
    body = f"""Hello,

    This is a confirmation for your upcoming writing assignment.

    The assignment will begin at {start_time}, at which time a Google Docs file will be shared with you. 
    You will have 8 hours from the start time to complete the assignment.

    Please make sure to manage your time accordingly.
    """

    try:
        send_email(email, subject, body)
        print(f"Sending confirmation email to {email} subject {subject} body {body}")
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

    return jsonify({"success": True, "message": f"Successfully sent email to {email}"}), 200

from googleapiclient.discovery import build
from google.oauth2 import service_account
import time

from googleapiclient.discovery import build
from google.oauth2 import service_account
import time

def writing_assignment_access(email, period):
    SERVICE_ACCOUNT_FILE = r"C:\Users\Simon\Downloads\writing-assignment-471815-1ac7e7dbe563.json"
    SCOPES = ["https://www.googleapis.com/auth/drive"]

    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    drive = build("drive", "v3", credentials=creds)

    def share_and_revoke(folder_id: str, user_email: str, minutes: int = 1):
        # Share the entire folder instead of a file
        permission = drive.permissions().create(
            fileId=folder_id,
            body={"type": "user", "role": "writer", "emailAddress": user_email},
            fields="id"
        ).execute()

        perm_id = permission["id"]
        print(f"Shared folder. Permission ID: {perm_id}. Will revoke after {minutes} minute(s).")

        # Wait and then revoke access
        time.sleep(minutes * 60)
        drive.permissions().delete(fileId=folder_id, permissionId=perm_id).execute()
        print("Folder access revoked.")

    if __name__ == "__main__":
        FOLDER_ID = "1NezdUJQliPB2dWIkKaV5O6R20aOFZxty"  # Your folder ID
        share_and_revoke(FOLDER_ID, email, minutes=period)



@app.route("/writing_assignment_access", methods=["POST"])
def writing_assignment_access_endpoint():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    duration_minutes = 1  # 8 hours

    try:
        # Call your function that grants access (make suSre it's imported)
        writing_assignment_access(email, duration_minutes)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

    return jsonify({
        "success": True,
        "message": f"Applicant with email {email} has been granted access to the file for 8 hours."
    }), 200

if __name__ == '__main__':
    app.run(debug=True)


# github