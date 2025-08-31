import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Clock, Mail, XCircle } from "lucide-react";

const mapTitle = (subject: string) => {
  switch (subject) {
    case "Application Status Update":
      return "Screening Failure";
    case "Interview Outcome":
      return "Interview Failure";
    case "Application Process Update":
      return "Contract Could Not Be Agreed";
    case "Test Results Notification":
      return "Writing Test Failure";
    default:
      return subject;
  }
};

interface Email {
  id: number;
  title: string;
  subject: string;
  body: string;
}

const Docs = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempBody, setTempBody] = useState("");

  const fetchEmails = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/get_rejection_emails");
      const data = await res.json();
      const mappedEmails = data.RejectionEmails.map(
        ([id, subject, body]: [number, string, string]) => ({
          id,
          title: mapTitle(subject),
          subject,
          body: body.replace(/\r\n/g, "\n"),
        })
      );
      setEmails(mappedEmails);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempBody(emails[index].body);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleSaveToBackend = async (index: number) => {
    const email = emails[index];
    try {
      const res = await fetch("http://127.0.0.1:5000/update_rejection_email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email.id, body: tempBody }),
      });
      const result = await res.json();
      if (res.ok) {
        await fetchEmails(); // Refresh after update
        setEditingIndex(null);
      } else {
        console.error("Failed to update email:", result.error);
      }
    } catch (err) {
      console.error("Error updating email:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Platform Documentation
          </h1>
          <p className="text-lg text-gray-700">
            This document outlines the full process and rules of the HR
            platform. It explains how applications are handled, the screening
            workflow, communications, and rejection email templates.
          </p>
        </div>

        {/* Application Submission */}
        <Card className="p-6 border-card-border bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            1. Application Submission
          </h2>
          <p className="text-sm text-gray-700 mb-2">
            When an applicant submits a form via the platform, a new record is
            created. All personal and professional information entered in the
            form is securely stored.
          </p>
          <p className="text-sm text-gray-700">
            The applicant immediately enters the initial screening process.
          </p>
        </Card>

        {/* Screening Process */}
        <Card className="p-6 border-card-border bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">2. Screening Process</h2>
          <p className="text-sm text-gray-700 mb-2">
            Applicants go through a multi-step screening process:
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-700 mb-2">
            <li>
              The system assigns a screening test and notes the start time.
            </li>
            <li>Administrators manually review the screening results.</li>
            <li>
              If the applicant fails the screening, an automatic rejection email
              is sent and the application process ends.
            </li>
            <li>
              If the applicant passes, a manual email is prepared suggesting an
              interview.
            </li>
          </ul>
        </Card>

        {/* Interview & Fee Proposal */}
        <Card className="p-6 border-card-border bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            3. Interview & Fee Proposal
          </h2>
          <p className="text-sm text-gray-700 mb-2">
            After a successful screening:
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-700 mb-2">
            <li>
              Administrators manually send an email suggesting an interview
              time.
            </li>
            <li>
              After the interview, a manually prepared fee/salary module is sent
              to the applicant.
            </li>
            <li>
              If the applicant accepts the offer, they can schedule a writing
              assignment test at a time of their choice.
            </li>
          </ul>
          <p className="text-sm text-gray-700">
            The system enforces the chosen test time and a 5-hour completion
            window, taking the applicant's time zone into account. The Google
            Form test is automatically closed after the allowed time.
          </p>
        </Card>

        {/* Writing Assignment */}
        <Card className="p-6 border-card-border bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">4. Writing Assignment</h2>
          <p className="text-sm text-gray-700 mb-2">
            After scheduling the writing assignment:
          </p>
          <ul className="list-disc ml-5 text-sm text-gray-700 mb-2">
            <li>The system sends the assignment at the scheduled time.</li>
            <li>Applicants have 5 hours to complete the assignment.</li>
            <li>Administrators manually review the submitted assignment.</li>
            <li>
              If the applicant passes, a contract is manually sent for signing.
            </li>
            <li>
              If the applicant signs, the process is completed successfully. If
              not, the application ends.
            </li>
          </ul>
          <p className="text-sm text-gray-700">
            Each assignment completion triggers a notification email for
            tracking purposes.
          </p>
        </Card>
        {/* Visual Overview */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Card className="p-6 border-card-border">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">
                Time-Sensitive Workflow
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              While the initial screening steps are manually reviewed, certain
              stages such as writing assignments and interview scheduling have
              deadlines that are tracked and enforced automatically, taking the
              applicant’s time zone into account.
            </p>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">
                Administrator Oversight
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              HR staff manually review all screening results, assignments, and
              interviews. They approve emails, send contract offers, and track
              the overall progress of each applicant, ensuring decisions are
              carefully controlled at each step.
            </p>
          </Card>

          <Card className="p-6 border-card-border">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center mr-3">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">
                Automated Communication
              </h3>
            </div>
            <p className="text-sm text-gray-700">
              All emails for status updates, assignment completions, interview
              suggestions, and contract offers are pre-written and automatically
              sent by the system when triggered, reducing manual workload while
              keeping applicants informed.
            </p>
          </Card>
        </div>

        {/* Rejection Emails */}
        <Card className="p-6 border-card-border bg-gray-50">
          <div className="flex items-center mb-4">
            <XCircle className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-semibold">5. Rejection Emails</h2>
          </div>
          <p className="text-sm text-gray-700 mb-4">
            Different rejection scenarios automatically generate tailored
            emails. Below are the main types of rejection messages applicants
            may receive.
          </p>

          <div className="space-y-6">
            {emails.map((email, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg shadow-sm p-4 relative"
              >
                <h3 className="font-semibold text-card-foreground mb-2">
                  {email.title}
                </h3>

                {editingIndex === index ? (
                  <>
                    <textarea
                      className="w-full border rounded-md p-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={8}
                      value={tempBody}
                      onChange={(e) => setTempBody(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleSaveToBackend(index)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">
                      <p>
                        <strong>Subject:</strong> {email.subject}
                      </p>
                      <p className="mt-2">{email.body}</p>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Docs;
