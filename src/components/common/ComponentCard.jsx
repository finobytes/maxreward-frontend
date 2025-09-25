const ComponentCard = ({ title, children, className = "", desc = "" }) => {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white ${className}`}>
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-600">{title}</h3>
        {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
