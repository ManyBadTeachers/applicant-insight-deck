import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Video, Calendar, Users } from "lucide-react";

function InterviewDropdown({ applicantId, onStepUpdate }) {
  const [interviewSteps, setInterviewSteps] = useState([]);
  const [interviewNotes, setInterviewNotes] = useState([]);

  // Fetch interview steps and notes from API
  const fetchInterviewData = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/hiring_steps/interview/${applicantId}`
      );
      const data = await res.json();

      const steps = data.steps.map((step, index) => ({
        id: index + 1,
        title: step.step_name,
        completed: step.completed === 1,
        applicantName: step.applicant_name,
        description: `${step.applicant_name} ${
          step.completed === 1 ? "completed" : "not completed"
        } ${step.step_name}`,
      }));
      console.log("steps", steps);

      setInterviewSteps(steps);
      setInterviewNotes(data.notes);
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  useEffect(() => {
    fetchInterviewData();
  }, [applicantId]);

  const getStatusBadge = (completed) => {
    return completed ? (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 shadow-sm bg-green-50 text-green-700 border-green-200">
        ✓ Completed
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 hover:scale-105 shadow-sm bg-amber-50 text-amber-700 border-amber-200">
        ⏳ In Progress
      </span>
    );
  };

  const getIcon = (stepId) => {
    switch (stepId) {
      case 1:
        return <Mail className="w-5 h-5 text-primary" />;
      case 2:
        return <Calendar className="w-5 h-5 text-primary" />;
      case 3:
        return <Video className="w-5 h-5 text-primary" />;
      default:
        return <Users className="w-5 h-5 text-primary" />;
    }
  };

  // Handle finishing or skipping a step
  const handleStepAction = async (e, stepTitle, action) => {
    e.stopPropagation(); // prevent parent dropdown from closing
    try {
      const res = await fetch("http://127.0.0.1:5000/hiring_steps/edit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_id: applicantId,
          step_name: stepTitle,
          action: action, // "finish" or "skip"
        }),
      });
      const result = await res.json();
      console.log("API result:", result);
      fetchInterviewData(); // refresh after action
      // Update main hiring steps status
      if (onStepUpdate) {
        onStepUpdate();
      }
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">
          Interview Process
        </h3>
      </div>

      {interviewSteps.map((step) => (
        <div
          key={step.id}
          className="border border-border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon(step.id)}
              <h4 className="font-semibold text-card-foreground">
                {step.title}
              </h4>
            </div>
            {getStatusBadge(step.completed)}
          </div>

          <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border-l-4 border-primary/20">
            {step.description}
          </div>

          {/* Extra info for Interview Finished */}
          {step.id === 3 && (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Applicant Name:</span>{" "}
                {step.applicantName}
              </div>
              <div>
                <span className="font-medium">Interviewing About:</span>{" "}
                {step.interviewTopic || "N/A"}
              </div>
              <div className="space-y-1">
                <span className="font-medium">Notes:</span>
                {interviewNotes.length > 0 ? (
                  interviewNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="text-sm text-card-foreground bg-muted/20 p-2 rounded"
                    >
                      {note.content}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No notes yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {!step.completed && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="default"
                onClick={(e) => handleStepAction(e, step.title, "finish")}
              >
                Finish Step
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleStepAction(e, step.title, "skip")}
              >
                Skip Step
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default InterviewDropdown;

{
  /* github */
}
