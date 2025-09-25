import { Link } from "react-router";

const PageBreadcrumb = ({ items = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Current Page Title */}
      <h2 className="text-xl font-semibold text-gray-600">
        {items[items.length - 1]?.label || "Page"}
      </h2>

      {/* Breadcrumb Navigation */}
      <nav>
        <ol className="flex items-center gap-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-sm">
              {item.to ? (
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700"
                >
                  {item.label}
                  {idx !== items.length - 1 && (
                    <svg
                      className="stroke-current"
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Link>
              ) : (
                <span className="text-gray-800">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
