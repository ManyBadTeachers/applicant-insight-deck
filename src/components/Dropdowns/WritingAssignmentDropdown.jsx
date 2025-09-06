import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenTool, Mail, FileEdit, Eye, CheckCircle, Calendar, Clock, FileText } from "lucide-react";

function WritingAssignmentDropdown() {
  const writingSteps = [
    {
      id: 1,
      title: "Writing Assignment Email Sent",
      status: "completed",
      date: "2024-01-28 11:00",
      sentBy: "Emma Wilson (HR Manager)",
      assignmentType: "Technical Documentation Sample",
      deadline: "2024-02-02 23:59",
      wordCount: "800-1200 words",
      topic: "API Integration Best Practices",
      description: "Technical writing assignment sent with detailed requirements. Assignment includes API documentation task, code examples, and best practices guide creation.",
      requirements: ["Clear technical explanations", "Code examples", "Proper formatting", "User-friendly language"],
      action: "View Assignment"
    },
    {
      id: 2,
      title: "Writing Assignment Started",
      status: "completed",
      startedDate: "2024-01-29 09:30",
      candidateResponse: "Assignment acknowledged. Will complete by deadline.",
      estimatedCompletion: "2024-02-01",
      progressNotes: "Candidate confirmed understanding of requirements and requested clarification on code example format, which was promptly provided.",
      action: "Check Progress"
    },
    {
      id: 3,
      title: "Writing Assignment Ended",
      status: "completed",
      submittedDate: "2024-02-01 18:45",
      finalWordCount: "1,150 words",
      submissionMethod: "Google Docs + GitHub Repository",
      timeSpent: "12 hours",
      candidateNotes: "Completed assignment with additional code examples and interactive elements. Added supplementary documentation for edge cases.",
      description: "Assignment submitted ahead of deadline with comprehensive documentation including practical examples and well-structured content.",
      action: "View Submission"
    },
    {
      id: 4,
      title: "Review Writing Assignment", 
      status: "completed",
      reviewDate: "2024-02-02 14:30",
      reviewer: "Sarah Mitchell (Technical Writer)",
      reviewTime: "45 minutes",
      criteriaScores: {
        clarity: 9,
        technical: 8,
        structure: 10,
        examples: 9,
        formatting: 8
      },
      overallScore: "8.8/10",
      feedback: "Excellent technical writing with clear explanations and practical examples. Strong attention to detail and user-focused approach. Minor improvements suggested for code commenting style.",
      action: "View Review"
    },
    {
      id: 5,
      title: "Writing Assignment Result",
      status: "current",
      resultDate: "2024-02-02 16:00",
      finalGrade: "Excellent",
      passStatus: "PASSED",
      overallScore: "8.8/10",
      strengths: ["Clear technical communication", "Comprehensive examples", "Professional formatting", "User-centric approach"],
      improvements: ["Code comment consistency", "Minor grammatical refinements"],
      recommendation: "Proceed to contract phase - strong technical writing skills demonstrated",
      nextStep: "Contract Preparation",
      action: "Approve & Continue"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "current":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">In Review</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getIcon = (stepId) => {
    switch (stepId) {
      case 1: return <Mail className="w-5 h-5 text-primary" />;
      case 2: return <PenTool className="w-5 h-5 text-primary" />;
      case 3: return <FileEdit className="w-5 h-5 text-primary" />;
      case 4: return <Eye className="w-5 h-5 text-primary" />;
      case 5: return <CheckCircle className="w-5 h-5 text-primary" />;
      default: return <FileText className="w-5 h-5 text-primary" />;
    }
  };

  const renderScores = (scores) => {
    return Object.entries(scores).map(([category, score]) => (
      <div key={category} className="flex justify-between items-center">
        <span className="text-muted-foreground capitalize">{category}:</span>
        <div className="flex items-center gap-2">
          <div className="w-16 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${(score / 10) * 100}%` }}
            />
          </div>
          <span className="font-medium text-card-foreground">{score}/10</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <PenTool className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Writing Assignment Process</h3>
      </div>

      {writingSteps.map((step) => (
        <div key={step.id} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getIcon(step.id)}
              <h4 className="font-semibold text-card-foreground">{step.title}</h4>
            </div>
            {getStatusBadge(step.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              {(step.date || step.startedDate || step.submittedDate || step.reviewDate || step.resultDate) && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-card-foreground">
                    {step.date || step.startedDate || step.submittedDate || step.reviewDate || step.resultDate}
                  </span>
                </div>
              )}

              {step.deadline && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium text-card-foreground">{step.deadline}</span>
                </div>
              )}

              {step.reviewer && (
                <div>
                  <span className="text-muted-foreground">Reviewer:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.reviewer}</span>
                </div>
              )}

              {step.timeSpent && (
                <div>
                  <span className="text-muted-foreground">Time Spent:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.timeSpent}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {step.wordCount && (
                <div>
                  <span className="text-muted-foreground">Word Count:</span>
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">{step.wordCount}</Badge>
                </div>
              )}

              {step.finalWordCount && (
                <div>
                  <span className="text-muted-foreground">Final Count:</span>
                  <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">{step.finalWordCount}</Badge>
                </div>
              )}

              {step.overallScore && (
                <div>
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-semibold text-green-600 ml-2">{step.overallScore}</span>
                </div>
              )}

              {step.passStatus && (
                <div>
                  <span className="text-muted-foreground">Result:</span>
                  <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">{step.passStatus}</Badge>
                </div>
              )}

              {step.finalGrade && (
                <div>
                  <span className="text-muted-foreground">Grade:</span>
                  <Badge className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">{step.finalGrade}</Badge>
                </div>
              )}
            </div>
          </div>

          {step.topic && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-blue-500/20">
              <h5 className="font-medium text-card-foreground mb-1">Assignment Topic:</h5>
              <p className="text-sm text-muted-foreground">{step.topic}</p>
            </div>
          )}

          {step.requirements && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-purple-500/20">
              <h5 className="font-medium text-card-foreground mb-2">Requirements:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {step.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.criteriaScores && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-green-500/20">
              <h5 className="font-medium text-card-foreground mb-3">Review Scores:</h5>
              <div className="space-y-2">
                {renderScores(step.criteriaScores)}
              </div>
            </div>
          )}

          {step.strengths && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-green-500/20">
              <h5 className="font-medium text-card-foreground mb-2">Strengths:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {step.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.feedback && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-blue-500/20">
              <h5 className="font-medium text-card-foreground mb-1">Reviewer Feedback:</h5>
              <p className="text-sm text-muted-foreground">{step.feedback}</p>
            </div>
          )}

          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border-l-4 border-primary/20">
            {step.description}
          </p>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant={step.status === 'current' ? 'default' : 'outline'}>
              {step.action}
            </Button>
            {step.status === 'completed' && step.id === 1 && (
              <Button size="sm" variant="ghost">
                Extend Deadline
              </Button>
            )}
            {step.id === 3 && (
              <Button size="sm" variant="ghost">
                Download Files
              </Button>
            )}
            {step.id === 4 && (
              <Button size="sm" variant="ghost">
                Request Changes
              </Button>
            )}
            {step.id === 5 && (
              <>
                <Button size="sm" variant="ghost">
                  Generate Report
                </Button>
                <Button size="sm" variant="ghost">
                  Send Feedback
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WritingAssignmentDropdown;