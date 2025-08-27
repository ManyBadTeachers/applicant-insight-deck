import Navigation from "@/components/Navigation";
import Timeline from "@/components/Timeline";
import StatusBadge from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Mail, Users, ChevronDown } from "lucide-react";

// Mock data for action center
const mockActions = [
  {
    id: "1",
    applicantName: "Sarah Johnson",
    role: "Software Engineer",
    status: "In Progress" as const,
    timeline: [
      { title: "Application Submitted", status: "completed" as const, date: "Jan 15" },
      { title: "Screening in Progress", status: "current" as const, date: "Jan 18" },
      { title: "Waiting for Interview Scheduling", status: "pending" as const },
      { title: "Interview Scheduled", status: "pending" as const },
      { title: "Post-interview Outcome", status: "pending" as const }
    ]
  },
  {
    id: "2",
    applicantName: "Marcus Chen", 
    role: "UX Designer",
    status: "Passed" as const,
    timeline: [
      { title: "Application Submitted", status: "completed" as const, date: "Jan 14" },
      { title: "Screening Passed", status: "completed" as const, date: "Jan 16" },
      { title: "Interview Scheduled", status: "current" as const, date: "Jan 19" },
      { title: "Awaiting Interview", status: "pending" as const },
      { title: "Post-interview Outcome", status: "pending" as const }
    ]
  },
  {
    id: "3",
    applicantName: "Elena Rodriguez",
    role: "Marketing Manager", 
    status: "Pending" as const,
    timeline: [
      { title: "Application Submitted", status: "completed" as const, date: "Jan 16" },
      { title: "Screening in Progress", status: "pending" as const },
      { title: "Waiting for Interview Scheduling", status: "pending" as const },
      { title: "Interview Scheduled", status: "pending" as const },
      { title: "Post-interview Outcome", status: "pending" as const }
    ]
  },
  {
    id: "4", 
    applicantName: "Priya Patel",
    role: "Product Manager",
    status: "In Progress" as const,
    timeline: [
      { title: "Application Submitted", status: "completed" as const, date: "Jan 17" },
      { title: "Screening Passed", status: "completed" as const, date: "Jan 18" },
      { title: "Interview Scheduled", status: "completed" as const, date: "Jan 20" },
      { title: "Awaiting Interview", status: "current" as const },
      { title: "Post-interview Outcome", status: "pending" as const }
    ]
  }
];

const ActionCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Action Center</h1>
          <p className="text-lg text-muted-foreground">
            Monitor automated actions and application progress
          </p>
        </div>

        {/* Control Bar */}
        <div className="bg-card border border-card-border rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Application Status:</span>
                <Select defaultValue="non-rejected">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non-rejected">Non-rejected (default)</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Sort:</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Bulk Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Action Items List */}
        <div className="space-y-4">
          {mockActions.map((action) => (
            <Card key={action.id} className="p-6 border-card-border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Checkbox className="mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {action.applicantName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{action.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={action.status} />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reject</Button>
                    <Button size="sm">Invite</Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {action.timeline.filter(t => t.status === 'completed').length} of {action.timeline.length} steps
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ 
                      width: `${(action.timeline.filter(t => t.status === 'completed').length / action.timeline.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Application Timeline</h4>
                  <Timeline steps={action.timeline} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Rejection Email
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bulk Actions Panel */}
        <div className="mt-8 p-4 bg-accent rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-accent-foreground">
                0 items selected
              </span>
              <div className="flex gap-2">
                <Badge variant="secondary">Select All</Badge>
                <Badge variant="secondary">Clear Selection</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Bulk Reject
              </Button>
              <Button size="sm" disabled>
                Bulk Invite
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCenter;