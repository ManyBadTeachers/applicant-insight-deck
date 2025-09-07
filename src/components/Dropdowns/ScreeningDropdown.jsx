import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileCheck, Eye } from "lucide-react";

function ScreeningDropdown({ applicantId, onStepUpdate }) {
  const [screeningSteps, setScreeningSteps] = useState([]);

  // Function to fetch current steps from the API
  const fetchScreeningSteps = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/hiring_steps/screening/${applicantId}`
      );
      const data = await res.json();

      const steps = data.map((step, index) => ({
        id: index + 1,
        title: step.step_name,
        completed: step.completed === 1,
        description: `${step.applicant_name} ${
          step.completed === 1 ? "completed" : "not completed"
        } ${step.step_name}`,
      }));

      setScreeningSteps(steps);
    } catch (error) {
      console.error("Error fetching screening steps:", error);
    }
  };

  // Fetch steps on mount
  useEffect(() => {
    fetchScreeningSteps();
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
        return <Search className="w-5 h-5 text-primary" />;
      case 2:
        return <FileCheck className="w-5 h-5 text-primary" />;
      case 3:
        return <Eye className="w-5 h-5 text-primary" />;
      default:
        return <Search className="w-5 h-5 text-primary" />;
    }
  };

  // Handles button clicks
  const handleStepAction = async (e, stepName, action) => {
    e.stopPropagation(); // Prevent dropdown closing
    console.log(`Step "${stepName}" clicked: ${action}`);

    try {
      // Call edit API
      const res = await fetch(`http://127.0.0.1:5000/hiring_steps/edit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_id: applicantId,
          step_name: stepName,
          action: action, // "finish" or "skip"
        }),
      });
      const result = await res.json();
      console.log("API result:", result);

      // Fetch updated steps immediately after edit
      fetchScreeningSteps();
      // Update main hiring steps status
      if (onStepUpdate) {
        onStepUpdate();
      }
    } catch (error) {
      console.error("Error calling edit API:", error);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <FileCheck className="w-4 h-4 text-blue-600" />
          </div>
          Screening Steps
        </h3>
        <Badge variant="outline" className="bg-white/50">
          {screeningSteps.filter(s => s.completed).length} of {screeningSteps.length} completed
        </Badge>
      </div>

      {screeningSteps.map((step) => (
        <div
          key={step.id}
          className="bg-white rounded-lg p-4 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {getIcon(step.id)}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{step.title}</h4>
                <p className="text-sm text-muted-foreground">Step {step.id}</p>
              </div>
            </div>
            {getStatusBadge(step.completed)}
          </div>

          <div className="bg-muted/30 p-3 rounded-md border-l-4 border-primary/30 mb-4">
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>

          {!step.completed && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={(e) => handleStepAction(e, step.title, "finish")}
              >
                <FileCheck className="w-4 h-4 mr-1" />
                Finish Step
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
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

export default ScreeningDropdown;

{
  /* github */
}
