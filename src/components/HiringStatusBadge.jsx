export const HiringStatusBadge = ({ status }) => {
  const colors = {
    Hired: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "In Process": "bg-amber-100 text-amber-700 border-amber-200",
    "In process": "bg-amber-100 text-amber-700 border-amber-200", 
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };
  
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-md ${
        colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
};