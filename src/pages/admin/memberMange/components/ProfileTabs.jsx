import {
  BanknoteArrowUp,
  ChevronDown,
  ScrollText,
  UsersRound,
} from "lucide-react";

const tabs = [
  { name: "Community", icon: UsersRound, href: "#", current: true },
  { name: "Add Payment", icon: BanknoteArrowUp, href: "#", current: false },
  { name: "Statements", icon: ScrollText, href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfileTabs = () => {
  return (
    <div>
      {/* Mobile dropdown */}
      <div className="grid grid-cols-1 sm:hidden">
        <select
          defaultValue={tabs.find((tab) => tab.current).name}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
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
              <a
                key={tab.name}
                href={tab.href}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.current
                    ? "bg-brand-100 text-white"
                    : "bg-gray-100 text-gray-700 hover:text-brand-900",
                  "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{tab.name}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ProfileTabs;
