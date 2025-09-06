import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { getStepData } from "@/data/hiringSteps";

const HorizontalHiringSteps = ({ steps, currentStep, applicantId, expandedSteps, onToggleStep }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 border-green-500 text-white";
      case "current":
        return "bg-yellow-500 border-yellow-500 text-white";
      case "pending":
        return "bg-gray-300 border-gray-300 text-gray-600";
      default:
        return "bg-gray-300 border-gray-300 text-gray-600";
    }
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Steps */}
      <div className="flex flex-wrap gap-2 justify-start">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const stepKey = `${applicantId}-${step.id}`;
          const isExpanded = expandedSteps[stepKey];
          
          return (
            <div key={step.id} className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStep(stepKey);
                }}
                className={`h-12 px-4 flex items-center justify-center text-sm font-medium transition-all hover:scale-105 rounded-none ${getStatusColor(status)}`}
              >
                <span className="text-center leading-tight">
                  {step.title}
                </span>
              </Button>
              
              {/* Step number indicator */}
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {step.id}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical Dropdowns */}
      <div className="space-y-2">
        {steps.map((step) => {
          const stepKey = `${applicantId}-${step.id}`;
          const isExpanded = expandedSteps[stepKey];
          const data = getStepData(step.id, applicantId);
          
          if (!isExpanded) return null;

          return (
            <Card key={step.id} className="border border-border bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Step-specific content */}
                  {step.id === 1 && ( // Submit Form
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-muted-foreground">Date Completed</span>
                          <p className="text-foreground font-medium">{data.dateCompleted}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-muted-foreground">Platform</span>
                          <p className="text-foreground font-medium">{data.platform}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-muted-foreground">Form Type</span>
                          <p className="text-foreground font-medium">{data.formType}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button variant="outline" size="sm">
                          {data.action}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step.id === 2 && ( // Screening Started
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-muted-foreground">Date Started</span>
                          <p className="text-foreground font-medium">{data.dateStarted}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-muted-foreground">Assigned To</span>
                          <p className="text-foreground font-medium">{data.assignedTo}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-muted-foreground">Priority</span>
                          <p className="text-foreground font-medium">{data.priority}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button variant="outline" size="sm">
                          {data.action}
                        </Button>
                      </div>
                    </div>
                  )}

                  {step.id === 3 && ( // Screening Reviewed
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 rounded-lg bg-green-100 text-green-800 font-bold text-lg">
                            PASSED
                          </div>
                        </div>
                        <Button variant="link" className="text-primary">
                          <a href="#screening-link" className="underline">View Screening Details</a>
                        </Button>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Date Completed</span>
                            <p className="text-foreground font-medium">{data.dateCompleted}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Reviewer</span>
                            <p className="text-foreground font-medium">{data.reviewer}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-muted-foreground">Review Summary</span>
                          <p className="text-foreground p-3 bg-background rounded border-l-4 border-l-green-500">
                            User passed the screening process successfully. Strong technical background, excellent communication skills, and meets all requirements. Candidate demonstrated comprehensive understanding of the role requirements and showed enthusiasm for the position.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.id === 5 && ( // Suggested Interview Email
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Date Sent</span>
                            <p className="text-foreground font-medium">{data.dateSent}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Email Template</span>
                            <p className="text-foreground font-medium">{data.emailTemplate}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-muted-foreground">Email Preview</span>
                          <div className="bg-background border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">From:</span>
                              <span>hiring@company.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">To:</span>
                              <span>candidate@email.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">Subject:</span>
                              <span>Interview Invitation - Software Developer Position</span>
                            </div>
                            <div className="border-t pt-3">
                              <p className="text-sm text-foreground">
                                Dear Candidate,<br/><br/>
                                Congratulations! We were impressed with your application and would like to invite you for an interview for the Software Developer position.<br/><br/>
                                Please let us know your availability for the coming week.<br/><br/>
                                Best regards,<br/>
                                HR Team
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step.id === 6 && ( // Interview Scheduled
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-primary font-bold">📅</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Scheduled Date & Time</span>
                              <p className="text-lg font-semibold text-foreground">{data.dateScheduled}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-primary font-bold">👤</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Interviewer</span>
                              <p className="text-lg font-semibold text-foreground">{data.interviewer}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-primary font-bold">⏱</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Duration</span>
                              <p className="text-lg font-semibold text-foreground">{data.duration}</p>
                            </div>
                          </div>
                          <div className="pt-2">
                            <Button variant="default" size="sm" className="w-full">
                              {data.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(step.id >= 4 && step.id <= 14 && ![5, 6].includes(step.id)) && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(data).slice(0, -1).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                            <p className="text-foreground font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button variant="outline" size="sm">
                          {data.action}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalHiringSteps;