import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Mail, Handshake, Calendar, TrendingUp } from "lucide-react";

function FeeModelDropdown() {
  const feeModelSteps = [
    {
      id: 1,
      title: "Fee Model Email Sent",
      status: "completed",
      date: "2024-01-26 10:30",
      sentBy: "Emma Wilson (HR Manager)",
      emailType: "Compensation Package Proposal",
      proposedRate: "$85/hour",
      proposedType: "Hourly Contract",
      description: "Comprehensive compensation package sent including hourly rate, benefits overview, and payment terms. Email includes detailed breakdown of project expectations and deliverables.",
      action: "View Email"
    },
    {
      id: 2,
      title: "Fee Model Negotiations",
      status: "completed",
      startDate: "2024-01-26 15:00",
      endDate: "2024-01-27 14:30",
      rounds: 2,
      candidateCounter: "$95/hour + performance bonus",
      finalAgreed: "$90/hour + quarterly bonus",
      negotiationNotes: "Professional and collaborative negotiation process. Candidate demonstrated market awareness and provided strong justification for rate adjustment. Mutual agreement reached on competitive compensation with performance incentives.",
      action: "View Negotiation Log"
    },
    {
      id: 3,
      title: "Fee Model Accepted",
      status: "current",
      acceptedDate: "2024-01-27 16:45",
      finalRate: "$90/hour",
      contractType: "Independent Contractor",
      paymentTerms: "Net 15 days",
      bonusStructure: "Quarterly performance bonus up to 15%",
      startDate: "2024-02-01",
      description: "Fee model formally accepted by both parties. Contract terms finalized and ready for documentation. Payment structure and performance metrics clearly defined.",
      action: "Generate Contract"
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
      case 1: return <Mail className="w-5 h-5 text-primary" />;
      case 2: return <TrendingUp className="w-5 h-5 text-primary" />;
      case 3: return <Handshake className="w-5 h-5 text-primary" />;
      default: return <DollarSign className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Fee Model Process</h3>
      </div>

      {feeModelSteps.map((step) => (
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
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-card-foreground">{step.date}</span>
                </div>
              )}

              {step.startDate && step.endDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Period:</span>
                  <span className="font-medium text-card-foreground">{step.startDate} - {step.endDate}</span>
                </div>
              )}

              {step.acceptedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Accepted:</span>
                  <span className="font-medium text-card-foreground">{step.acceptedDate}</span>
                </div>
              )}

              {step.sentBy && (
                <div>
                  <span className="text-muted-foreground">Sent by:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.sentBy}</span>
                </div>
              )}

              {step.rounds && (
                <div>
                  <span className="text-muted-foreground">Negotiation Rounds:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.rounds}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {step.proposedRate && (
                <div>
                  <span className="text-muted-foreground">Proposed Rate:</span>
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">{step.proposedRate}</Badge>
                </div>
              )}

              {step.candidateCounter && (
                <div>
                  <span className="text-muted-foreground">Candidate Counter:</span>
                  <Badge className="ml-2 bg-orange-50 text-orange-700 border-orange-200">{step.candidateCounter}</Badge>
                </div>
              )}

              {step.finalRate && (
                <div>
                  <span className="text-muted-foreground">Final Rate:</span>
                  <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">{step.finalRate}</Badge>
                </div>
              )}

              {step.contractType && (
                <div>
                  <span className="text-muted-foreground">Contract Type:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.contractType}</span>
                </div>
              )}

              {step.paymentTerms && (
                <div>
                  <span className="text-muted-foreground">Payment Terms:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.paymentTerms}</span>
                </div>
              )}
            </div>
          </div>

          {step.bonusStructure && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-green-500/20">
              <h5 className="font-medium text-card-foreground mb-1">Bonus Structure:</h5>
              <p className="text-sm text-muted-foreground">{step.bonusStructure}</p>
            </div>
          )}

          {step.negotiationNotes && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-blue-500/20">
              <h5 className="font-medium text-card-foreground mb-1">Negotiation Notes:</h5>
              <p className="text-sm text-muted-foreground">{step.negotiationNotes}</p>
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
                Resend Proposal
              </Button>
            )}
            {step.id === 2 && (
              <Button size="sm" variant="ghost">
                View History
              </Button>
            )}
            {step.id === 3 && (
              <>
                <Button size="sm" variant="ghost">
                  Download Agreement
                </Button>
                <Button size="sm" variant="ghost">
                  Send Welcome Email
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FeeModelDropdown;