export const NationalityBadge = ({ nationality }: { nationality: string }) => {
  const colors = {
    US: "bg-blue-200 text-blue-900",
    Canada: "bg-red-200 text-red-900",
    Spain: "bg-yellow-200 text-yellow-900",
    Germany: "bg-green-200 text-green-900",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full font-semibold text-sm ${
        colors[nationality] || "bg-gray-100 text-gray-800"
      }`}
    >
      {nationality}
    </span>
  );
};
