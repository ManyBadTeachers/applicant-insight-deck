import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Mail } from "lucide-react";

function SubmitFormDropdown() {
  const submissionData = {
    status: "completed",
    submittedDate: "2024-01-15 14:30",
    platform: "Company Career Portal",
    applicantName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    documentsSubmitted: ["Resume", "Cover Letter", "Portfolio"],
    applicationId: "APP-2024-001"
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Form Submission Details</h3>
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Submitted:</span>
            <span className="font-medium text-card-foreground">{submissionData.submittedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Applicant:</span>
            <span className="font-medium text-card-foreground">{submissionData.applicantName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-card-foreground">{submissionData.email}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Platform:</span>
            <span className="font-medium text-card-foreground ml-2">{submissionData.platform}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Application ID:</span>
            <span className="font-medium text-card-foreground ml-2">{submissionData.applicationId}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Documents:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {submissionData.documentsSubmitted.map((doc, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-border">
        <Button size="sm" variant="default">
          <FileText className="w-4 h-4 mr-1" />
          View Application
        </Button>
        <Button size="sm" variant="outline">
          Download Documents
        </Button>
        <Button size="sm" variant="ghost">
          Contact Applicant
        </Button>
      </div>
    </div>
  );
}

export default SubmitFormDropdown;