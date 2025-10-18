
import { ChevronDown } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StaffDetailsTabs = ({ tabs, currentTab, setCurrentTab }) => {
  return (
    <div>
      {/* Mobile dropdown */}
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={currentTab}
          onChange={(e) => setCurrentTab(e.target.value)}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.name}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>

      {/* Desktop tabs */}
      <div className="hidden sm:block">
        <nav aria-label="Tabs" className="flex space-x-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                aria-current={currentTab === tab.key ? "page" : undefined}
                className={classNames(
                  currentTab === tab.key
                    ? "bg-brand-100 text-white"
                    : "bg-gray-100 text-gray-700 hover:text-brand-900",
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default StaffDetailsTabs;
