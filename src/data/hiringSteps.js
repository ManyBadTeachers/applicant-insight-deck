// Standard hiring process steps for all applicants
export const STANDARD_HIRING_STEPS = [
  {
    id: 1,
    title: "Submit Form",
    description: "Initial application submission",
    icon: "FileText"
  },
  {
    id: 2,
    title: "Screening Started",
    description: "Initial review process begins",
    icon: "Search"
  },
  {
    id: 3,
    title: "Screening Reviewed",
    description: "Application materials assessed",
    icon: "FileCheck"
  },
  {
    id: 4,
    title: "Screening Result",
    description: "Passed initial screening phase",
    icon: "CheckCircle"
  },
  {
    id: 5,
    title: "Suggested Interview Email",
    description: "Interview invitation sent",
    icon: "Mail"
  },
  {
    id: 6,
    title: "Interview Scheduled",
    description: "Interview date and time confirmed",
    icon: "Calendar"
  },
  {
    id: 7,
    title: "Interview Passed",
    description: "Successfully completed interview",
    icon: "Users"
  },
  {
    id: 8,
    title: "Fee Model Email",
    description: "Compensation structure shared",
    icon: "DollarSign"
  },
  {
    id: 9,
    title: "Fee Model Result",
    description: "Terms and compensation agreed",
    icon: "Handshake"
  },
  {
    id: 10,
    title: "Writing Assignment Email",
    description: "Writing task instructions provided",
    icon: "PenTool"
  },
  {
    id: 11,
    title: "Writing Assignment Finished",
    description: "Candidate completed writing task",
    icon: "FileEdit"
  },
  {
    id: 12,
    title: "Writing Assignment Reviewed",
    description: "Writing sample evaluated",
    icon: "Eye"
  },
  {
    id: 13,
    title: "Writing Assignment Result",
    description: "Writing task met requirements",
    icon: "ThumbsUp"
  },
  {
    id: 14,
    title: "Contract Sent",
    description: "Final contract issued",
    icon: "FileSignature"
  }
];

// Generate dummy data for each step type
export const getStepData = (stepId, applicantId) => {
  const baseData = {
    1: { // Submit Form
      dateCompleted: "2024-01-10",
      platform: "Company Website",
      formType: "Standard Application",
      action: "View Application"
    },
    2: { // Screening Started
      dateStarted: "2024-01-11",
      assignedTo: "Sarah Johnson (HR)",
      priority: "Medium",
      action: "View Details"
    },
    3: { // Screening Reviewed
      dateCompleted: "2024-01-13",
      reviewer: "Sarah Johnson (HR)",
      notes: "Strong background, meets requirements",
      action: "View Review"
    },
    4: { // Screening Succeeded
      dateCompleted: "2024-01-14",
      score: "8.5/10",
      nextStep: "Interview Process",
      action: "View Results"
    },
    5: { // Suggested Interview Email
      dateSent: "2024-01-15",
      recipient: applicantId,
      emailTemplate: "Interview Invitation",
      action: "View Email"
    },
    6: { // Interview Scheduled
      dateScheduled: "2024-01-22 14:00",
      interviewer: "Mike Chen (Tech Lead)",
      duration: "45 minutes",
      action: "Join Interview"
    },
    7: { // Interview Passed
      dateCompleted: "2024-01-22",
      interviewer: "Mike Chen (Tech Lead)",
      score: "9/10",
      action: "View Notes"
    },
    8: { // Fee Model Email Sent
      dateSent: "2024-01-23",
      feeStructure: "Hourly Rate",
      rate: "$75/hour",
      action: "View Details"
    },
    9: { // Fee Model Accepted
      dateAccepted: "2024-01-24",
      agreedRate: "$75/hour",
      terms: "Accepted",
      action: "View Agreement"
    },
    10: { // Writing Assignment Email Sent
      dateSent: "2024-01-25",
      assignmentType: "Technical Writing Sample",
      deadline: "2024-01-30",
      action: "View Assignment"
    },
    11: { // Writing Assignment Finished
      dateSubmitted: "2024-01-29",
      wordCount: "1,250 words",
      submissionMethod: "Email",
      action: "View Submission"
    },
    12: { // Writing Assignment Reviewed
      dateReviewed: "2024-01-31",
      reviewer: "Emma Davis (Content Lead)",
      feedback: "Excellent writing quality and structure",
      action: "View Review"
    },
    13: { // Writing Assignment Succeeded
      dateCompleted: "2024-02-01",
      score: "9.5/10",
      grade: "Excellent",
      action: "View Results"
    },
    14: { // Contract Sent
      dateSent: "2024-02-02",
      contractType: "Freelance Agreement",
      status: "Pending Signature",
      action: "View Contract"
    }
  };

  return baseData[stepId] || {};
};

// Determine step status based on current step
export const getStepStatus = (stepId, currentStep) => {
  if (stepId < currentStep) return "completed";
  if (stepId === currentStep) return "current";
  return "pending";
};