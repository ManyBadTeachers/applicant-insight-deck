import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Mail, FileEdit, Eye, CheckCircle } from "lucide-react";

function WritingAssignmentDropdown({ applicantId, onStepUpdate }) {
  const [writingSteps, setWritingSteps] = useState([]);

  // Fetch writing assignment steps from API
  const fetchWritingSteps = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/hiring_steps/writing_assignment/${applicantId}`
      );
      const data = await res.json();

      const steps = data.map((step, index) => ({
        id: index + 1,
        title: step.step_name,
        completed: step.completed === 1,
        applicantName: step.applicant_name,
      }));

      setWritingSteps(steps);
    } catch (error) {
      console.error("Error fetching writing assignment steps:", error);
    }
  };

  useEffect(() => {
    fetchWritingSteps();
  }, [applicantId]);

  const getStatusBadge = (completed) => {
    return completed ? (
      <Badge className="bg-green-50 text-green-700 border-green-200">
        ✓ Completed
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        ⏳ In Progress
      </Badge>
    );
  };

  const getIcon = (stepId) => {
    switch (stepId) {
      case 1:
        return <Mail className="w-5 h-5 text-primary" />;
      case 2:
        return <PenTool className="w-5 h-5 text-primary" />;
      case 3:
        return <FileEdit className="w-5 h-5 text-primary" />;
      case 4:
        return <Eye className="w-5 h-5 text-primary" />;
      case 5:
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <PenTool className="w-5 h-5 text-primary" />;
    }
  };

  const handleStepAction = async (e, stepTitle, action) => {
    e.stopPropagation();
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
      fetchWritingSteps(); // refresh after update
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
        <PenTool className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">
          Writing Assignment Process
        </h3>
      </div>

      {writingSteps.map((step) => (
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
            Applicant: {step.applicantName}
          </div>

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

export default WritingAssignmentDropdown;

{
  /* github */
}
