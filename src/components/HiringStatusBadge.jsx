export const HiringStatusBadge = ({ status }) => {
  const colors = {
    Hired: "text-emerald-600 border-l-emerald-500",
    "In Process": "text-amber-600 border-l-amber-500",
    "In process": "text-amber-600 border-l-amber-500", 
    Rejected: "text-red-600 border-l-red-500",
  };
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-bold uppercase tracking-wide border-l-4 ${
        colors[status] || "text-gray-600 border-l-gray-500"
      }`}
    >
      {status}
    </span>
  );
};