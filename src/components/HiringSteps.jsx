import { useState, useEffect } from "react";
import SubmitFormDropdown from "./Dropdowns/SubmitFormDropdown";
import ScreeingDropdown from "./Dropdowns/ScreeningDropdown";
import InterviewDropdown from "./Dropdowns/InterviewDropdown";
import FeeModelDropdown from "./Dropdowns/FeeModelDropdown";
import WritingAssignmentDropdown from "./Dropdowns/WritingAssignmentDropdown";
import ContractDropdown from "./Dropdowns/ContractDropdown";

const HiringSteps = ({ applicantId }) => {
  const [stepId, setStepId] = useState(1);
  const [stepsStatus, setStepsStatus] = useState([]);

  // Fetch applicant step completion status from backend
  const fetchStepsStatus = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/get_applicant_hiring_steps/${applicantId}`
      );
      const data = await res.json();
      setStepsStatus(data);
    } catch (error) {
      console.error("Error fetching applicant hiring steps:", error);
    }
  };

  const steps = [
    { name: "Submit Form", id: 1 },
    { name: "Screening", id: 2 },
    { name: "Interview", id: 6 },
    { name: "Fee Model", id: 10 },
    { name: "Writing Assignment", id: 14 },
    { name: "Contract", id: 20 },
  ];

  useEffect(() => {
    fetchStepsStatus();
  }, [applicantId]);

  const handleStep = (id, e) => {
    e.stopPropagation();
    setStepId(id);
  };

  const isStepCompleted = (stepId) => {
    const step = stepsStatus.find((s) => s.step_id === stepId);
    return step ? step.completed === 1 : false;
  };

  // Determine the next active step (first incomplete main step)
  const getNextStepId = () => {
    const nextStep = steps.find((s) => !isStepCompleted(s.id));
    return nextStep ? nextStep.id : null;
  };

  const nextStepId = getNextStepId();

  return (
    <div className="flex flex-col gap-2">
      {/* Progress Overview */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Hiring Progress</span>
          <span>{steps.filter(s => isStepCompleted(s.id)).length} of {steps.length} completed</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(steps.filter(s => isStepCompleted(s.id)).length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Enhanced Buttons row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step) => {
          const isCompleted = isStepCompleted(step.id);
          const isCurrent = step.id === nextStepId;
          
          return (
            <button
              key={step.id}
              className={`
                relative p-4 rounded-lg font-medium transition-all duration-200 text-left border
                ${isCompleted 
                  ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' 
                  : isCurrent 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100' 
                    : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                }
              `}
              onClick={(e) => handleStep(step.id, e)}
            >
              <div className="flex items-center gap-2">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-muted-foreground/20 text-muted-foreground'
                  }
                `}>
                  {isCompleted ? '✓' : step.id}
                </div>
                <span className="font-medium">{step.name}</span>
              </div>
              <div className="text-xs mt-1 opacity-75">
                {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected step display */}
      <div className="mt-6 bg-background rounded-lg border border-border shadow-sm">
        {stepId === 1 && <SubmitFormDropdown applicantId={applicantId} onStepUpdate={fetchStepsStatus} />}
        {stepId === 2 && <ScreeingDropdown applicantId={applicantId} onStepUpdate={fetchStepsStatus} />}
        {stepId === 6 && <InterviewDropdown applicantId={applicantId} onStepUpdate={fetchStepsStatus} />}
        {stepId === 10 && <FeeModelDropdown applicantId={applicantId} onStepUpdate={fetchStepsStatus} />}
        {stepId === 14 && (
          <WritingAssignmentDropdown applicantId={applicantId} onStepUpdate={fetchStepsStatus} />
        )}
        {stepId === 20 && <ContractDropdown applicantId={applicantId} onStepUpdate={fetchStepsStatus} />}
      </div>
    </div>
  );
};

export default HiringSteps;

{
  /* github */
}
