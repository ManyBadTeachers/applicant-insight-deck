import { useState } from "react";
import SubmitFormDropdown from "./Dropdowns/SubmitFormDropdown";
import ScreeingDropdown from "./Dropdowns/ScreeningDropdown";
import InterviewDropdown from "./Dropdowns/InterviewDropdown";
import FeeModelDropdown from "./Dropdowns/FeeModelDropdown";
import WritingAssignmentDropdown from "./Dropdowns/WritingAssignmentDropdown";
import ContractDropdown from "./Dropdowns/ContractDropdown";
const HiringSteps = ({ applicantId }) => {
  const [stepId, setStepId] = useState(1);

  const steps = [
    { name: "Submit Form", id: 1 },
    { name: "Screening", id: 2 },
    { name: "Interview", id: 3 },
    { name: "Fee Model", id: 4 },
    { name: "Writing Assignment", id: 5 },
    { name: "Contract", id: 6 },
  ];

  const handleStep = (id, e) => {
    e.stopPropagation(); // prevents closing parent dropdown
    setStepId(id);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Buttons row */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <button
            key={step.id}
            className={
              "px-4 py-2 rounded-lg font-semibold transition-all flex-shrink-0"
            }
            onClick={(e) => handleStep(step.id, e)}
          >
            {step.name}
          </button>
        ))}
      </div>

      {/* Selected step display */}
      <div className="p-3 bg-gray-50 rounded-lg border w-full mt-2">
        <p>{stepId}</p>
        {stepId === 1 && <SubmitFormDropdown />}
        {stepId === 2 && <ScreeingDropdown />}
        {stepId === 3 && <InterviewDropdown />}
        {stepId === 4 && <FeeModelDropdown />}
        {stepId === 5 && <WritingAssignmentDropdown />}
        {stepId === 6 && <ContractDropdown />}
      </div>
    </div>
  );
};

export default HiringSteps;
