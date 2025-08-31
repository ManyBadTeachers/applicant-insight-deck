export const NationalityBadge = ({ nationality }) => {
  const colors = {
    Swedish: "bg-blue-50 text-blue-700 border-blue-200",
    American: "bg-red-50 text-red-700 border-red-200", 
    Spanish: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Korean: "bg-pink-50 text-pink-700 border-pink-200",
    German: "bg-green-50 text-green-700 border-green-200",
    Indian: "bg-orange-50 text-orange-700 border-orange-200",
    Chinese: "bg-red-50 text-red-700 border-red-200",
    Japanese: "bg-pink-50 text-pink-700 border-pink-200", 
    Italian: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Canadian: "bg-red-50 text-red-700 border-red-200",
    Czech: "bg-indigo-50 text-indigo-700 border-indigo-200",
    British: "bg-blue-50 text-blue-700 border-blue-200",
    Brazilian: "bg-green-50 text-green-700 border-green-200",
    French: "bg-blue-50 text-blue-700 border-blue-200",
    Egyptian: "bg-amber-50 text-amber-700 border-amber-200",
    Pakistani: "bg-teal-50 text-teal-700 border-teal-200",
    Russian: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
        colors[nationality] || "bg-muted text-muted-foreground border-border"
      }`}
    >
      {nationality}
    </span>
  );
};