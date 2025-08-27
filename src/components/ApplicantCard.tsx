import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Mail, Phone, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface ApplicantCardProps {
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    primaryExpertise: string;
    otherExpertise: string[];
    status: "Pending" | "In Progress" | "Passed" | "Rejected";
    submissionDate: string;
    tags: string[];
  };
}

const ApplicantCard = ({ applicant }: ApplicantCardProps) => {
  return (
    <Card className="p-6 min-w-[400px] bg-card border-card-border shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {applicant.firstName} {applicant.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{applicant.primaryExpertise}</p>
          </div>
          <StatusBadge status={applicant.status} />
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="w-4 h-4 mr-2" />
            {applicant.email}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="w-4 h-4 mr-2" />
            {applicant.phone}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {applicant.nationality}
          </div>
        </div>

        {/* Other Expertise */}
        {applicant.otherExpertise.length > 0 && (
          <div>
            <p className="text-sm font-medium text-card-foreground mb-2">Other Areas:</p>
            <div className="flex flex-wrap gap-1">
              {applicant.otherExpertise.map((expertise, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {expertise}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {applicant.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Submitted: {applicant.submissionDate}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="w-3 h-3 mr-1" />
              CV
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApplicantCard;
