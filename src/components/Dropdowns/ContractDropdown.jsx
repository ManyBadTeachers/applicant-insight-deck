import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSignature, Mail, CheckCircle } from "lucide-react";

function ContractDropdown({ applicantId, onStepUpdate }) {
  const [contractSteps, setContractSteps] = useState([]);

  // Fetch contract steps from API
  const fetchContractSteps = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/hiring_steps/contract/${applicantId}`
      );
      const data = await res.json();

      const steps = data.map((step, index) => ({
        id: index + 1,
        title: step.step_name,
        completed: step.completed === 1,
        applicantName: step.applicant_name,
      }));

      setContractSteps(steps);
    } catch (error) {
      console.error("Error fetching contract steps:", error);
    }
  };

  useEffect(() => {
    fetchContractSteps();
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
        return <FileSignature className="w-5 h-5 text-primary" />;
      case 3:
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <FileSignature className="w-5 h-5 text-primary" />;
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
      await res.json();
      fetchContractSteps(); // refresh after action
      // Update main hiring steps status
      if (onStepUpdate) {
        onStepUpdate();
      }
    } catch (error) {
      console.error("Error updating contract step:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <FileSignature className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Contract Process</h3>
      </div>

      {contractSteps.map((step) => (
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

          <p className="text-sm text-muted-foreground">
            Applicant: {step.applicantName}
          </p>

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

export default ContractDropdown;

{
  /* github */
}
