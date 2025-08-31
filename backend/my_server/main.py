from config import app
from flask import request, jsonify, redirect, render_template
from database import create_connection

@app.route("/get_rejection_emails", methods=["GET"])
def get_rejection_emails():
   conn = create_connection()
   cur = conn.cursor()
   sql = "SELECT * FROM RejectionEmails"
   cur.execute(sql)
   RejectionEmails = cur.fetchall()
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

        if not full_name:
            return jsonify({"error": "FullName is required"}), 400

        # Status defaults to 'Submitted Form', SubmissionDate is automatic
        conn = create_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO Applicants
            (FullName, Status, Expertise, Email, Phone, FirstName, LastName, Nationality, CV)
            VALUES (?, 'Submitted Form', ?, ?, ?, ?, ?, ?, ?)
        """, (full_name, expertise, email, phone, first_name, last_name, nationality, cv))
        conn.commit()
        conn.close()

        return jsonify({"message": f"Successfully created applicant '{full_name}'"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_applicants", methods=["GET"])
def get_users_hiring_steps():
    conn = create_connection()
    cur = conn.cursor()

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


    cur.execute(sql)
    applicants = cur.fetchall()

    conn.close()
    return jsonify({"applicants": applicants})

@app.route("/applicants_hiring_steps", methods=["GET"])
def applicants_hiring_steps():
    conn = create_connection()
    cur = conn.cursor()

    sql = """
        SELECT 
            a.ID AS applicant_id,
            a.FullName,
            a.Expertise,
            s.*
        FROM Applicants a
        JOIN application_steps s ON a.ID = s.applicant_id
    """
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

        # Process all steps
        for i, step in enumerate(steps_order):
            value = row_dict.get(step)
            if value != 1:
                continue

            last_completed_index = i

            if step in exceptions:
                # Red logic for failed steps
                applicant_data["steps"].append({"label": step, "color": "red"})
                # Also mark the next step red if it exists
                if i + 1 < len(steps_order):
                    applicant_data["steps"].append({"label": steps_order[i + 1], "color": "red"})
                has_exception = True
                break
            else:
                # Green for successful steps
                applicant_data["steps"].append({"label": step, "color": "green"})

        # If no exceptions, add the next step as yellow (if it exists and not contract_sent)
        if not has_exception:
            next_index = last_completed_index + 1
            if next_index < len(steps_order):
                next_step = steps_order[next_index]
                if next_step not in exceptions and next_step != "contract_sent":
                    applicant_data["steps"].append({"label": next_step, "color": "yellow"})

        applicants.append(applicant_data)

    return jsonify({"applicants": applicants})


if __name__ == '__main__':
   app.run(debug=True)
              