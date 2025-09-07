export const HiringStatusBadge = ({ status }) => {
  const colors = {
    Hired: "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200",
    "In Process": "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200",
    "In process": "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200",
    Rejected: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200",
  };
  
  return (
    <span
      className={`inline-flex items-center px-4 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 transform ${
        colors[status] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-200"
      }`}
    >
      {status}
    </span>
  );
};