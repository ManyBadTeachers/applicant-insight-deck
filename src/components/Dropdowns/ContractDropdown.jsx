import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileSignature, Mail, CheckCircle, Calendar, Download, User } from "lucide-react";

function ContractDropdown() {
  const contractSteps = [
    {
      id: 1,
      title: "Contract Sent",
      status: "completed",
      dateSent: "2024-02-03 10:15",
      sentBy: "Emma Wilson (HR Manager)",
      contractType: "Independent Contractor Agreement",
      documentVersion: "v2.1",
      deliveryMethod: "DocuSign + Email",
      contractTerms: {
        rate: "$90/hour",
        duration: "6 months (renewable)",
        startDate: "2024-02-10",
        paymentTerms: "Net 15 days",
        workSchedule: "40 hours/week",
        benefits: "Quarterly performance bonus"
      },
      description: "Comprehensive contract package sent including all negotiated terms, NDAs, and compliance documentation. Contract includes detailed scope of work, payment schedule, and performance expectations.",
      attachments: ["Main Contract", "NDA", "Payment Schedule", "SOW Document"],
      action: "View Contract"
    },
    {
      id: 2,
      title: "Contract Under Review",
      status: "completed",
      reviewStarted: "2024-02-03 14:30",
      reviewCompleted: "2024-02-05 16:20",
      candidateQueries: 3,
      responseTime: "< 4 hours average",
      modifications: ["Clarified IP ownership clause", "Adjusted notice period to 2 weeks", "Added remote work provisions"],
      legalReview: "Approved by Legal Department",
      description: "Candidate thoroughly reviewed contract terms and requested minor clarifications. All queries addressed promptly with legal team consultation. Contract modifications agreed upon by both parties.",
      action: "View Modifications"
    },
    {
      id: 3,
      title: "Contract Result",
      status: "current",
      signedDate: "2024-02-05 18:45",
      signatureMethod: "DocuSign Electronic Signature",
      witnessRequired: false,
      legalStatus: "Fully Executed",
      effectiveDate: "2024-02-10",
      contractID: "CTR-2024-SAR-001",
      nextMilestones: ["Onboarding Process", "Equipment Setup", "Team Introduction", "First Sprint Planning"],
      hrNotes: "Contract successfully executed. Candidate expressed enthusiasm about joining the team. Onboarding scheduled for contract start date.",
      complianceCheck: "All compliance requirements met",
      description: "Contract successfully signed and executed by all parties. Legal documentation complete and filed. Ready to proceed with onboarding and team integration process.",
      action: "Start Onboarding"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "current":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Executed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getIcon = (stepId) => {
    switch (stepId) {
      case 1: return <Mail className="w-5 h-5 text-primary" />;
      case 2: return <FileSignature className="w-5 h-5 text-primary" />;
      case 3: return <CheckCircle className="w-5 h-5 text-primary" />;
      default: return <FileSignature className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <FileSignature className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Contract Process</h3>
      </div>

      {contractSteps.map((step) => (
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
              {(step.dateSent || step.reviewStarted || step.signedDate) && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium text-card-foreground">
                    {step.dateSent || step.reviewStarted || step.signedDate}
                  </span>
                </div>
              )}

              {step.sentBy && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Sent by:</span>
                  <span className="font-medium text-card-foreground">{step.sentBy}</span>
                </div>
              )}

              {step.contractType && (
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">{step.contractType}</Badge>
                </div>
              )}

              {step.deliveryMethod && (
                <div>
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.deliveryMethod}</span>
                </div>
              )}

              {step.candidateQueries && (
                <div>
                  <span className="text-muted-foreground">Queries:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.candidateQueries} questions</span>
                </div>
              )}

              {step.legalStatus && (
                <div>
                  <span className="text-muted-foreground">Legal Status:</span>
                  <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">{step.legalStatus}</Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {step.documentVersion && (
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <Badge className="ml-2 bg-gray-50 text-gray-700 border-gray-200">{step.documentVersion}</Badge>
                </div>
              )}

              {step.responseTime && (
                <div>
                  <span className="text-muted-foreground">Response Time:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.responseTime}</span>
                </div>
              )}

              {step.signatureMethod && (
                <div>
                  <span className="text-muted-foreground">Signature:</span>
                  <Badge className="ml-2 bg-purple-50 text-purple-700 border-purple-200">{step.signatureMethod}</Badge>
                </div>
              )}

              {step.effectiveDate && (
                <div>
                  <span className="text-muted-foreground">Effective:</span>
                  <span className="font-medium text-card-foreground ml-2">{step.effectiveDate}</span>
                </div>
              )}

              {step.contractID && (
                <div>
                  <span className="text-muted-foreground">Contract ID:</span>
                  <span className="font-mono text-card-foreground ml-2">{step.contractID}</span>
                </div>
              )}
            </div>
          </div>

          {step.contractTerms && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-blue-500/20">
              <h5 className="font-medium text-card-foreground mb-2">Contract Terms:</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(step.contractTerms).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium text-card-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step.attachments && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-purple-500/20">
              <h5 className="font-medium text-card-foreground mb-2">Attachments:</h5>
              <div className="flex flex-wrap gap-2">
                {step.attachments.map((attachment, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    {attachment}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {step.modifications && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-orange-500/20">
              <h5 className="font-medium text-card-foreground mb-2">Contract Modifications:</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                {step.modifications.map((mod, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-orange-600" />
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step.nextMilestones && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-green-500/20">
              <h5 className="font-medium text-card-foreground mb-2">Next Milestones:</h5>
              <div className="grid grid-cols-2 gap-1">
                {step.nextMilestones.map((milestone, index) => (
                  <Badge key={index} className="bg-green-50 text-green-700 border-green-200 text-xs">
                    {milestone}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border-l-4 border-primary/20">
            {step.description}
          </p>

          {step.hrNotes && (
            <div className="bg-muted/30 p-3 rounded border-l-4 border-blue-500/20">
              <h5 className="font-medium text-card-foreground mb-1">HR Notes:</h5>
              <p className="text-sm text-muted-foreground">{step.hrNotes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant={step.status === 'current' ? 'default' : 'outline'}>
              {step.action}
            </Button>
            {step.status === 'completed' && step.id === 1 && (
              <>
                <Button size="sm" variant="ghost">
                  Resend Contract
                </Button>
                <Button size="sm" variant="ghost">
                  Track Status
                </Button>
              </>
            )}
            {step.id === 2 && (
              <Button size="sm" variant="ghost">
                Legal Review
              </Button>
            )}
            {step.id === 3 && (
              <>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4 mr-1" />
                  Download Contract
                </Button>
                <Button size="sm" variant="ghost">
                  Send Welcome Kit
                </Button>
                <Button size="sm" variant="ghost">
                  Schedule Onboarding
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContractDropdown;