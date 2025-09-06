import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Video, Calendar, Users, Clock, Star } from "lucide-react";

function InterviewDropdown() {
  const interviewSteps = [
    {
      id: 1,
      title: "Suggest Interview Email",
      status: "completed",
      date: "2024-01-20 14:00",
      recipient: "sarah.johnson@email.com",
      emailTemplate: "Technical Interview Invitation",
      sentBy: "Emma Wilson (HR Manager)",
      description: "Interview invitation sent with available time slots and technical requirements. Candidate responded promptly with preferred time selection.",
      action: "View Email"
    },
    {
      id: 2,
      title: "Interview Scheduled",
      status: "completed",
      scheduledDate: "2024-01-25 15:00 - 16:00",
      interviewer: "Michael Chen (Senior Developer)",
      type: "Technical Interview",
      platform: "Google Meet",
      description: "One-hour technical interview scheduled covering React, Node.js, and system design. Meeting link and preparation materials shared with candidate.",
      action: "Join Interview"
    },
    {
      id: 3,
      title: "Interview Finished",
      status: "current",
      completedDate: "2024-01-25 16:00",
      interviewer: "Michael Chen",
      duration: "65 minutes",
      overallScore: "9.2/10",
      notes: "Exceptional technical skills demonstrated. Strong problem-solving approach and excellent communication. Candidate showed deep understanding of React patterns and clean code principles.",
      ratings: {
        technical: 9,
        communication: 10,
        problemSolving: 9,
        culturalFit: 8
      },
      recommendation: "Strong Hire",
      action: "Review Notes"
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
      case 2: return <Calendar className="w-5 h-5 text-primary" />;
      case 3: return <Video className="w-5 h-5 text-primary" />;
      default: return <Users className="w-5 h-5 text-primary" />;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Interview Process</h3>
      </div>

      {interviewSteps.map((step) => (
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
              {step.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sent:</span>
                  <span className="font-medium text-card-foreground">{step.date}</span>
                </div>
              )}

              {step.scheduledDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Scheduled:</span>
                  <span className="font-medium text-card-foreground">{step.scheduledDate}</span>
                </div>
              )}

              {step.completedDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium text-card-foreground">{step.completedDate}</span>
                </div>
              )}

              {step.interviewer && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Interviewer:</span>
                  <span className="font-medium text-card-foreground">{step.interviewer}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {step.type && (
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">{step.type}</Badge>
                </div>
              )}

              {step.platform && (
                <div>
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.platform}</span>
                </div>
              )}

              {step.overallScore && (
                <div>
                  <span className="text-muted-foreground">Overall Score:</span>
                  <span className="font-semibold text-green-600 ml-2">{step.overallScore}</span>
                </div>
              )}

              {step.recommendation && (
                <div>
                  <span className="text-muted-foreground">Recommendation:</span>
                  <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">{step.recommendation}</Badge>
                </div>
              )}
            </div>
          </div>

          {step.ratings && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-primary/20">
              <h5 className="font-medium text-card-foreground mb-2">Interview Ratings:</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(step.ratings).map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-muted-foreground capitalize">{category.replace(/([A-Z])/g, ' $1')}:</span>
                    <div className="flex items-center gap-1">
                      {renderStars(rating)}
                      <span className="text-card-foreground font-medium ml-1">({rating}/10)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border-l-4 border-primary/20">
            {step.description}
          </p>

          {step.notes && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-green-500/20">
              <h5 className="font-medium text-card-foreground mb-1">Interview Notes:</h5>
              <p className="text-sm text-muted-foreground">{step.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant={step.status === 'current' ? 'default' : 'outline'}>
              {step.action}
            </Button>
            {step.status === 'completed' && step.id === 1 && (
              <Button size="sm" variant="ghost">
                Resend Email
              </Button>
            )}
            {step.id === 3 && (
              <>
                <Button size="sm" variant="ghost">
                  Download Report
                </Button>
                <Button size="sm" variant="ghost">
                  Schedule Follow-up
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InterviewDropdown;