export const ExpertiseBadge = ({ expertise }) => {
  const colors = {
    IT: "bg-blue-600 text-white shadow-lg shadow-blue-500/50",
    Business: "bg-amber-600 text-white shadow-lg shadow-amber-500/50",
    Physics: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50",
    "Material Science": "bg-teal-600 text-white shadow-lg shadow-teal-500/50",
    "Life Sciences": "bg-emerald-600 text-white shadow-lg shadow-emerald-500/50",
    Biotechnology: "bg-pink-600 text-white shadow-lg shadow-pink-500/50",
    Engineering: "bg-orange-600 text-white shadow-lg shadow-orange-500/50",
    AI: "bg-purple-600 text-white shadow-lg shadow-purple-500/50",
    "Machine Learning": "bg-red-600 text-white shadow-lg shadow-red-500/50",
    Agrotech: "bg-lime-600 text-white shadow-lg shadow-lime-500/50",
    Chemistry: "bg-cyan-600 text-white shadow-lg shadow-cyan-500/50",
    Finance: "bg-yellow-600 text-white shadow-lg shadow-yellow-500/50",
    Quantum: "bg-rose-600 text-white shadow-lg shadow-rose-500/50",
    "Earth Sciences": "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/50",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide transition-all duration-300 hover:scale-110 hover:shadow-xl ${
        colors[expertise] || "bg-gray-600 text-white shadow-lg shadow-gray-500/50"
      }`}
    >
      {expertise}
    </span>
  );
};