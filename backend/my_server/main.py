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

if __name__ == '__main__':
    app.run(debug=True)
