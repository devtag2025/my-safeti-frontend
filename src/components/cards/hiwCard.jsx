const HIWCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg shadow-lg">
      {icon}
      <h3 className="text-lg font-semibold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default HIWCard;
