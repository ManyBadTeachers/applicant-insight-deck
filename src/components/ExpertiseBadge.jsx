export const ExpertiseBadge = ({ expertise }) => {
  const colors = {
    IT: "bg-blue-100 text-blue-800",
    Business: "bg-amber-100 text-amber-800",
    Physics: "bg-indigo-100 text-indigo-800",
    "Material Science": "bg-teal-100 text-teal-800",
    "Life Sciences": "bg-emerald-100 text-emerald-800",
    Biotechnology: "bg-pink-100 text-pink-800",
    Engineering: "bg-orange-100 text-orange-800",
    AI: "bg-purple-100 text-purple-800",
    "Machine Learning": "bg-red-100 text-red-800",
    Agrotech: "bg-lime-100 text-lime-800",
    Chemistry: "bg-cyan-100 text-cyan-800",
    Finance: "bg-yellow-100 text-yellow-800",
    Quantum: "bg-rose-100 text-rose-800",
    "Earth Sciences": "bg-fuchsia-100 text-fuchsia-800",
  };

  return (
    <span
      className={`inline-flex items-center justify-center w-24 min-h-[32px] px-2 py-1.5 rounded-full text-xs font-black uppercase tracking-wide text-center leading-tight ${
        colors[expertise] || "bg-gray-100 text-gray-800"
      }`}
    >
      {expertise}
    </span>
  );
};