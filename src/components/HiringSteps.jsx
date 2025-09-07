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

  const steps = [
    { name: "Submit Form", id: 1 },
    { name: "Screening", id: 2 },
    { name: "Interview", id: 6 },
    { name: "Fee Model", id: 10 },
    { name: "Writing Assignment", id: 14 },
    { name: "Contract", id: 20 },
  ];

  // Fetch applicant step completion status from backend
  useEffect(() => {
    const fetchSteps = async () => {
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

    fetchSteps();
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
      {/* Buttons row */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => {
          let bgColor = "";
          if (isStepCompleted(step.id)) {
            bgColor = "bg-green-500 text-white";
          } else if (step.id === nextStepId) {
            bgColor = "bg-yellow-400 text-white";
          }

          return (
            <button
              key={step.id}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex-shrink-0 ${bgColor}`}
              onClick={(e) => handleStep(step.id, e)}
            >
              {step.name}
            </button>
          );
        })}
      </div>

      {/* Selected step display */}
      <div className="p-3 bg-gray-50 rounded-lg border w-full mt-2">
        {stepId === 1 && <SubmitFormDropdown applicantId={applicantId} />}
        {stepId === 2 && <ScreeingDropdown applicantId={applicantId} />}
        {stepId === 6 && <InterviewDropdown applicantId={applicantId} />}
        {stepId === 10 && <FeeModelDropdown applicantId={applicantId} />}
        {stepId === 14 && (
          <WritingAssignmentDropdown applicantId={applicantId} />
        )}
        {stepId === 20 && <ContractDropdown applicantId={applicantId} />}
      </div>
    </div>
  );
};

export default HiringSteps;
