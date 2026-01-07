const ComponentCard = ({ title, children, className = "", desc = "", headerAction }) => {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white ${className}`}>
      {/* Card Header */}
      {title && (
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-600">{title}</h3>
            {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={`p-4 ${title && "border-t border-gray-100"}`}>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
