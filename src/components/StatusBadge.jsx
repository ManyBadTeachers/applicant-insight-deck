export const StatusBadge = ({ status }) => {
  const colors = {
    Hired: "bg-green-100 text-green-800 border-green-200",
    "In process": "bg-yellow-100 text-yellow-800 border-yellow-200", 
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-status-pending text-status-pending-foreground",
    "In Progress": "bg-status-progress text-status-progress-foreground",
    Passed: "bg-status-passed text-status-passed-foreground",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold transition-colors border shadow-sm ${
        colors[status] || "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
};