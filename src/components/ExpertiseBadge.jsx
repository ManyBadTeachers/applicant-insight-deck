export const ExpertiseBadge = ({ expertise }) => {
  const colors = {
    IT: "bg-blue-50 text-blue-700 border-blue-200",
    Business: "bg-amber-50 text-amber-700 border-amber-200",
    Physics: "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Material Science": "bg-teal-50 text-teal-700 border-teal-200",
    "Life Sciences": "bg-emerald-50 text-emerald-700 border-emerald-200",
    Biotechnology: "bg-pink-50 text-pink-700 border-pink-200",
    Engineering: "bg-orange-50 text-orange-700 border-orange-200",
    AI: "bg-purple-50 text-purple-700 border-purple-200",
    "Machine Learning": "bg-red-50 text-red-700 border-red-200",
    Agrotech: "bg-lime-50 text-lime-700 border-lime-200",
    Chemistry: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Finance: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Quantum: "bg-rose-50 text-rose-700 border-rose-200",
    "Earth Sciences": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
        colors[expertise] || "bg-muted text-muted-foreground border-border"
      }`}
    >
      {expertise}
    </span>
  );
};