import { CheckCircle, Clock, XCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  title: string;
  status: "completed" | "current" | "failed" | "pending";
  date?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

const Timeline = ({ steps }: TimelineProps) => {
  const getIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-status-passed" />;
      case "current":
        return <Clock className="w-4 h-4 text-status-progress" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-status-rejected" />;
      case "pending":
        return <Circle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case "completed":
        return "text-status-passed";
      case "current":
        return "text-status-progress font-medium";
      case "failed":
        return "text-status-rejected";
      case "pending":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(step.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <p className={cn("text-sm", getStepStyles(step.status))}>
                {step.title}
              </p>
              {step.date && (
                <span className="text-xs text-muted-foreground ml-2">
                  {step.date}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;