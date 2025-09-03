// Standard hiring process steps for all applicants
export const STANDARD_HIRING_STEPS = [
  {
    id: 1,
    title: "Application Review",
    description: "Initial screening of application materials",
    icon: "FileText"
  },
  {
    id: 2,
    title: "Phone Screening",
    description: "Brief phone interview to assess basic fit",
    icon: "Phone"
  },
  {
    id: 3,
    title: "Technical Assessment",
    description: "Coding test or technical evaluation",
    icon: "Code"
  },
  {
    id: 4,
    title: "Technical Interview",
    description: "In-depth technical discussion with team",
    icon: "Users"
  },
  {
    id: 5,
    title: "Culture Fit Interview",
    description: "Assessment of cultural alignment",
    icon: "Heart"
  },
  {
    id: 6,
    title: "Reference Check",
    description: "Verification of past work experience",
    icon: "CheckCircle"
  },
  {
    id: 7,
    title: "Final Decision",
    description: "Management review and hiring decision",
    icon: "Award"
  }
];

// Generate dummy data for each step type
export const getStepData = (stepId, applicantId) => {
  const baseData = {
    1: { // Application Review
      dateCompleted: "2024-01-15",
      reviewer: "Sarah Johnson (HR)",
      notes: "Strong technical background, good communication skills",
      action: "View Application Materials",
      score: "8/10"
    },
    2: { // Phone Screening
      dateCompleted: "2024-01-18",
      interviewer: "Mike Chen (Tech Lead)",
      duration: "30 minutes",
      score: "8/10",
      action: "View Screening Notes"
    },
    3: { // Technical Assessment
      dateCompleted: "2024-01-20",
      testType: "Full-stack Development Challenge",
      score: "85/100",
      timeTaken: "3.5 hours",
      action: "View Code Submission"
    },
    4: { // Technical Interview
      dateScheduled: "2024-01-25 14:00",
      interviewer: "Alex Rodriguez (Senior Developer)",
      focusAreas: "System design, algorithms, past projects",
      action: "Join Interview / View Recording"
    },
    5: { // Culture Fit Interview
      dateScheduled: "2024-01-28 10:00",
      interviewer: "Emma Davis (Team Lead)",
      focusAreas: "Team collaboration, company values, communication style",
      action: "Schedule Interview"
    },
    6: { // Reference Check
      status: "Pending",
      referencesRequired: 2,
      referencesReceived: 0,
      action: "Request References"
    },
    7: { // Final Decision
      status: "Pending",
      decisionBy: "2024-02-01",
      decisionMaker: "John Smith (Hiring Manager)",
      action: "Await Decision"
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