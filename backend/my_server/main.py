from config import app
from flask import request, jsonify, redirect, render_template
from database import create_connection
from datetime import datetime


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
    return jsonify({"applicants": applicants})


@app.route("/applicants_hiring_steps", methods=["GET"])
def applicants_hiring_steps():
    conn = create_connection()
    cur = conn.cursor()

    form_id = request.args.get("form_id", type=int)

    sql = """
        SELECT 
            a.ID AS applicant_id,
            a.FullName,
            a.Expertise,
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

    steps_order = [
        "submit_form",
        "screening_started",
        "screening_reviewed",
        "screening_failed",
        "rejection_email_screening",
        "screening_succeeded",
        "suggested_interview_email",
        "interview_scheduled",
        "interview_failed",
        "rejection_email_interview",
        "interview_passed",
        "fee_model_email_sent",
        "fee_model_declined",
        "rejection_email_fee_model",
        "fee_model_accepted",
        "writing_assignment_email_sent",
        "writing_assignment_finished",
        "writing_assignment_reviewed",
        "writing_assignment_failed",
        "rejection_email_writing_assignment",
        "writing_assignment_succeeded",
        "rejection_email_final",
        "contract_sent",
        "contract_failed",
    ]

    exceptions = {
        "screening_failed",
        "interview_failed",
        "fee_model_declined",
        "writing_assignment_failed",
        "contract_failed",
    }

    applicants = []

    for row in rows:
        row_dict = dict(zip(col_names, row))
        applicant_data = {
            "id": row_dict["applicant_id"],
            "fullName": row_dict["FullName"],
            "expertise": row_dict["Expertise"],
            "steps": []
        }

        last_completed_index = -1
        has_exception = False

        for i, step in enumerate(steps_order):
            value = row_dict.get(step)
            if value != 1:
                continue

            last_completed_index = i

            if step in exceptions:
                applicant_data["steps"].append({"label": step, "color": "red"})
                if i + 1 < len(steps_order):
                    applicant_data["steps"].append({"label": steps_order[i + 1], "color": "red"})
                has_exception = True
                break
            else:
                applicant_data["steps"].append({"label": step, "color": "green"})

        if not has_exception:
            next_index = last_completed_index + 1
            if next_index < len(steps_order):
                next_step = steps_order[next_index]
                if next_step not in exceptions and next_step != "contract_sent":
                    applicant_data["steps"].append({"label": next_step, "color": "yellow"})

        applicants.append(applicant_data)

    return jsonify({"applicants": applicants})


@app.route("/get_hiring_statistics", methods=["GET"])
def get_hiring_statistics():
    conn = create_connection()
    cur = conn.cursor()

    form_id = request.args.get("form_id", type=int)
    if not form_id:
        return jsonify({"error": "form_id not provided"}), 400

    cur.execute(
        "SELECT form_id, name, total_applicants, reviewed_today, submitted_today, in_process, rejection_rate, hired_this_year "
        "FROM hiring_stats WHERE form_id = ?",
        (form_id,)
    )
    row = cur.fetchone()
    conn.close()

    if row:
        result = {row[1]: {
            "total_applicants": row[2],
            "reviewed_today": row[3],
            "submitted_today": row[4],
            "in_process": row[5],
            "rejection_rate": row[6],
            "hired_this_year": row[7],
        }}
    else:
        result = {}

    return jsonify(result)


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




if __name__ == '__main__':
    app.run(debug=True)


# github