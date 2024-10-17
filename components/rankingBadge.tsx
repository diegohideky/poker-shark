// @ts-nocheck

const RankingBadge = ({ position, className }) => {
  const getBadgeColor = (position) => {
    if (position === 1) {
      return "bg-yellow";
    } else if (position === 2) {
      return "bg-gray-400";
    } else if (position === 3) {
      return "bg-orange";
    }

    return "bg-white";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-12 h-12 rounded-full ${getBadgeColor(
        position
      )} ${className}`}
    >
      <span className={`text-2xl text-[#076157]`}>{position}º</span>
    </div>
  );
};

export default RankingBadge;
