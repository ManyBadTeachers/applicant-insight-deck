// ExpertiseBadge.tsx
export const ExpertiseBadge = ({ expertise }: { expertise: string }) => {
  const colors: Record<string, string> = {
    IT: "bg-blue-100 text-blue-800",
    Business: "bg-yellow-100 text-yellow-800",
    Physics: "bg-indigo-100 text-indigo-800",
    "Material Science": "bg-teal-100 text-teal-800",
    "Life Sciences": "bg-green-100 text-green-800",
    Biotechnology: "bg-pink-100 text-pink-800",
    Engineering: "bg-orange-100 text-orange-800",
    AI: "bg-purple-100 text-purple-800",
    "Machine Learning": "bg-red-100 text-red-800",
    Agrotech: "bg-lime-100 text-lime-800",
    Chemistry: "bg-cyan-100 text-cyan-800",
    Finance: "bg-amber-100 text-amber-800",
    Quantum: "bg-rose-100 text-rose-800",
    "Earth Sciences": "bg-fuchsia-100 text-fuchsia-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full font-extrabold text-sm ${
        colors[expertise] || "bg-gray-100 text-gray-800"
      }`}
    >
      {expertise}
    </span>
  );
};
