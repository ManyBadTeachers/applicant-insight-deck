export const HiringStatusBadge = ({ status }) => {
  const colors = {
    Hired: "bg-green-500 text-white border-green-600 shadow-green-200",
    "In Process": "bg-yellow-500 text-white border-yellow-600 shadow-yellow-200",
    "In process": "bg-yellow-500 text-white border-yellow-600 shadow-yellow-200",
    Rejected: "bg-red-500 text-white border-red-600 shadow-red-200",
  };
  
  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 border-2 shadow-lg hover:scale-105 ${
        colors[status] || "bg-gray-500 text-white border-gray-600 shadow-gray-200"
      }`}
    >
      {status}
    </span>
  );
};