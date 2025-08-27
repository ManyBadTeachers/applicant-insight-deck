import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Pending" | "In Progress" | "Passed" | "Rejected";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-status-pending text-status-pending-foreground";
      case "In Progress":
        return "bg-status-progress text-status-progress-foreground";
      case "Passed":
        return "bg-status-passed text-status-passed-foreground";
      case "Rejected":
        return "bg-status-rejected text-status-rejected-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;