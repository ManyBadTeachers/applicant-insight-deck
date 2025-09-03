import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Search, FileCheck, CheckCircle, Mail, Calendar, Users, DollarSign, Handshake, PenTool, FileEdit, Eye, ThumbsUp, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { getStepData } from "@/data/hiringSteps";

const iconMap = {
  FileText,
  Search,
  FileCheck,
  CheckCircle,
  Mail,
  Calendar,
  Users,
  DollarSign,
  Handshake,
  PenTool,
  FileEdit,
  Eye,
  ThumbsUp,
  FileSignature
};

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
          const Icon = iconMap[step.icon] || FileText;
          const status = getStepStatus(step.id);
          const stepKey = `${applicantId}-${step.id}`;
          const isExpanded = expandedSteps[stepKey];
          
          return (
            <div key={step.id} className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleStep(stepKey)}
                className={`h-12 px-4 flex flex-col items-center gap-1 text-xs font-medium transition-all hover:scale-105 ${getStatusColor(status)}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] text-center leading-tight max-w-[80px] truncate">
                  {step.title}
                </span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
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
            <Card key={step.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-card-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Step-specific content */}
                  {step.id === 1 && ( // Submit Form
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Date Completed:</span>
                        <p className="text-card-foreground">{data.dateCompleted}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Platform:</span>
                        <p className="text-card-foreground">{data.platform}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Form Type:</span>
                        <p className="text-card-foreground">{data.formType}</p>
                      </div>
                    </div>
                  )}

                  {step.id === 2 && ( // Screening Started
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Date Started:</span>
                        <p className="text-card-foreground">{data.dateStarted}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Assigned To:</span>
                        <p className="text-card-foreground">{data.assignedTo}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Priority:</span>
                        <p className="text-card-foreground">{data.priority}</p>
                      </div>
                    </div>
                  )}

                  {step.id === 3 && ( // Screening Reviewed
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Date Completed:</span>
                          <p className="text-card-foreground">{data.dateCompleted}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Reviewer:</span>
                          <p className="text-card-foreground">{data.reviewer}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Notes:</span>
                        <p className="text-card-foreground text-sm mt-1">{data.notes}</p>
                      </div>
                    </div>
                  )}

                  {(step.id >= 4 && step.id <= 14) && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {Object.entries(data).slice(0, -1).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <p className="text-card-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button variant="outline" size="sm" className="mt-3">
                    {data.action}
                  </Button>
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