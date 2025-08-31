export const StatusBadge = ({ status }) => {
  const colors = {
    Pending: "bg-status-pending text-status-pending-foreground",
    "In Progress": "bg-status-progress text-status-progress-foreground",
    Passed: "bg-status-passed text-status-passed-foreground",
    Rejected: "bg-status-rejected text-status-rejected-foreground",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
        colors[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
};