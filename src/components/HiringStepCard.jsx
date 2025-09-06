import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Phone, Code, Users, Heart, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { getStepData } from "@/data/hiringSteps";

const iconMap = {
  FileText,
  Phone,
  Code,
  Users,
  Heart,
  CheckCircle,
  Award
};

const HiringStepCard = ({ step, stepData, isExpanded, onToggle, applicantId }) => {
  const Icon = iconMap[step.icon] || FileText;
  const data = getStepData(step.id, applicantId);
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "current":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "current":
        return "In Progress";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="mb-3">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${stepData.status === 'completed' ? 'bg-green-100' : stepData.status === 'current' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <Icon className={`w-4 h-4 ${stepData.status === 'completed' ? 'text-green-600' : stepData.status === 'current' ? 'text-yellow-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(stepData.status)}>
                  {getStatusText(stepData.status)}
                </Badge>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="ml-11 space-y-3 border-t pt-4">
              {/* Step-specific content */}
              {step.id === 1 && ( // Application Review
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
                    <div>
                      <span className="font-medium text-muted-foreground">Score:</span>
                      <p className="text-card-foreground">{data.score}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Notes:</span>
                    <p className="text-card-foreground text-sm mt-1">{data.notes}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    {data.action}
                  </Button>
                </div>
              )}

              {step.id === 2 && ( // Phone Screening
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Date Completed:</span>
                      <p className="text-card-foreground">{data.dateCompleted}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Interviewer:</span>
                      <p className="text-card-foreground">{data.interviewer}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Duration:</span>
                      <p className="text-card-foreground">{data.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Score:</span>
                      <p className="text-card-foreground">{data.score}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    {data.action}
                  </Button>
                </div>
              )}

              {step.id === 3 && ( // Technical Assessment
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Date Completed:</span>
                      <p className="text-card-foreground">{data.dateCompleted}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Test Type:</span>
                      <p className="text-card-foreground">{data.testType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Score:</span>
                      <p className="text-card-foreground font-semibold">{data.score}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Time Taken:</span>
                      <p className="text-card-foreground">{data.timeTaken}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    {data.action}
                  </Button>
                </div>
              )}

              {step.id === 4 && ( // Technical Interview
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Date Scheduled:</span>
                      <p className="text-card-foreground">{data.dateScheduled}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Interviewer:</span>
                      <p className="text-card-foreground">{data.interviewer}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Focus Areas:</span>
                    <p className="text-card-foreground text-sm mt-1">{data.focusAreas}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    {data.action}
                  </Button>
                </div>
              )}

              {step.id === 5 && ( // Culture Fit Interview
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Date Scheduled:</span>
                      <p className="text-card-foreground">{data.dateScheduled}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Interviewer:</span>
                      <p className="text-card-foreground">{data.interviewer}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Focus Areas:</span>
                    <p className="text-card-foreground text-sm mt-1">{data.focusAreas}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    {data.action}
                  </Button>
                </div>
              )}

              {step.id === 6 && ( // Reference Check
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Status:</span>
                      <p className="text-card-foreground">{data.status}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">References:</span>
                      <p className="text-card-foreground">{data.referencesReceived}/{data.referencesRequired}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    {data.action}
                  </Button>
                </div>
              )}

              {step.id === 7 && ( // Final Decision
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Status:</span>
                      <p className="text-card-foreground">{data.status}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Decision By:</span>
                      <p className="text-card-foreground">{data.decisionBy}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-muted-foreground">Decision Maker:</span>
                      <p className="text-card-foreground">{data.decisionMaker}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    {data.action}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default HiringStepCard;