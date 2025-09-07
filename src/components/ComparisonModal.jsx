import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExpertiseBadge } from "@/components/ExpertiseBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { NationalityBadge } from "@/components/NationalityBadge";
import { X, FileText, Phone, Mail } from "lucide-react";

const ComparisonModal = ({ isOpen, onClose, applicants = [] }) => {
  if (applicants.length === 0) return null;

  const comparisonFields = [
    { key: 'fullName', label: 'Full Name', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'primaryExpertise', label: 'Expertise', type: 'expertise' },
    { key: 'nationality', label: 'Nationality', type: 'nationality' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'submissionDate', label: 'Applied', type: 'text' },
  ];

  const renderFieldValue = (applicant, field) => {
    const value = applicant[field.key];
    
    switch (field.type) {
      case 'status':
        return <StatusBadge status={value} />;
      case 'expertise':
        return <ExpertiseBadge expertise={value} />;
      case 'nationality':
        return <NationalityBadge nationality={value} />;
      default:
        return <span className="text-card-foreground">{value}</span>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Compare Applicants ({applicants.length})
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-muted-foreground min-w-32">
                  Field
                </th>
                {applicants.map((applicant, index) => (
                  <th key={applicant.id} className="text-left p-3 min-w-48">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {applicant.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-card-foreground">
                          Candidate {index + 1}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field, fieldIndex) => (
                <tr key={field.key} className={`border-b ${fieldIndex % 2 === 0 ? 'bg-muted/20' : ''}`}>
                  <td className="p-3 font-medium text-muted-foreground">
                    {field.label}
                  </td>
                  {applicants.map((applicant) => (
                    <td key={applicant.id} className="p-3">
                      {renderFieldValue(applicant, field)}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Action buttons row */}
              <tr className="border-b bg-muted/10">
                <td className="p-3 font-medium text-muted-foreground">
                  Quick Actions
                </td>
                {applicants.map((applicant) => (
                  <td key={applicant.id} className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <FileText className="w-3 h-3" />
                        CV
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Comparing {applicants.length} candidates side by side
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>Export Comparison</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;