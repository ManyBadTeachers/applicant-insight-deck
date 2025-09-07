import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Mail, Handshake, TrendingUp } from "lucide-react";

function FeeModelDropdown({ applicantId }) {
  const [feeSteps, setFeeSteps] = useState([]);

  // Fetch fee model steps from API
  const fetchFeeSteps = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/hiring_steps/fee_model/${applicantId}`
      );
      const data = await res.json();

      const steps = data.map((step, index) => ({
        id: index + 1,
        title: step.step_name,
        completed: step.completed === 1,
        applicantName: step.applicant_name,
      }));

      setFeeSteps(steps);
    } catch (error) {
      console.error("Error fetching fee model steps:", error);
    }
  };

  useEffect(() => {
    fetchFeeSteps();
  }, [applicantId]);

  const getStatusBadge = (completed) => {
    return completed ? (
      <Badge className="bg-green-50 text-green-700 border-green-200">
        Completed
      </Badge>
    ) : (
      <Badge variant="secondary">Not Completed</Badge>
    );
  };

  const getIcon = (stepId) => {
    switch (stepId) {
      case 1:
        return <Mail className="w-5 h-5 text-primary" />;
      case 2:
        return <TrendingUp className="w-5 h-5 text-primary" />;
      case 3:
        return <Handshake className="w-5 h-5 text-primary" />;
      default:
        return <DollarSign className="w-5 h-5 text-primary" />;
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
      fetchFeeSteps(); // refresh steps after action
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">
          Fee Model Process
        </h3>
      </div>

      {feeSteps.map((step) => (
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
        </div>
      ))}
    </div>
  );
}

export default FeeModelDropdown;

{
  /* github */
}
