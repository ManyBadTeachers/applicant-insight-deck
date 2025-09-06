import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FileCheck, Eye, Calendar, User } from "lucide-react";

function ScreeningDropdown() {
  const screeningSteps = [
    {
      id: 1,
      title: "Screening Started",
      status: "completed",
      date: "2024-01-16 09:00",
      assignedTo: "Emma Wilson (HR Manager)",
      description: "Initial application review initiated. All required documents verified and basic qualification check completed.",
      action: "Mark as Started"
    },
    {
      id: 2,
      title: "Screening Finished",
      status: "completed", 
      date: "2024-01-18 16:30",
      reviewer: "Emma Wilson",
      description: "Comprehensive screening completed. Candidate meets 85% of job requirements. Strong technical background with relevant experience in required technologies.",
      score: "8.5/10",
      action: "View Details"
    },
    {
      id: 3,
      title: "Screening Reviewed",
      status: "current",
      date: "2024-01-19 10:00",
      reviewer: "Michael Chen (Team Lead)",
      description: "Second-level review in progress. Candidate shows excellent potential with strong problem-solving skills and cultural fit indicators.",
      recommendation: "Proceed to Interview",
      action: "Complete Review"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "current":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getIcon = (stepId) => {
    switch (stepId) {
      case 1: return <Search className="w-5 h-5 text-primary" />;
      case 2: return <FileCheck className="w-5 h-5 text-primary" />;
      case 3: return <Eye className="w-5 h-5 text-primary" />;
      default: return <Search className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Screening Process</h3>
      </div>

      {screeningSteps.map((step) => (
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
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-card-foreground">{step.date}</span>
              </div>
              
              {step.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span className="font-medium text-card-foreground">{step.assignedTo}</span>
                </div>
              )}

              {step.reviewer && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reviewer:</span>
                  <span className="font-medium text-card-foreground">{step.reviewer}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {step.score && (
                <div>
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-semibold text-green-600 ml-2">{step.score}</span>
                </div>
              )}
              
              {step.recommendation && (
                <div>
                  <span className="text-muted-foreground">Recommendation:</span>
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">{step.recommendation}</Badge>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border-l-4 border-primary/20">
            {step.description}
          </p>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant={step.status === 'current' ? 'default' : 'outline'}>
              {step.action}
            </Button>
            {step.status === 'completed' && (
              <Button size="sm" variant="ghost">
                View Report
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ScreeningDropdown;