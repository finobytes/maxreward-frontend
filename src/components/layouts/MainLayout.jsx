import { Outlet } from "react-router";

import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import Sidebar from "./Sidebar";
import Backdrop from "./Backdrop";
import Header from "./Header";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex  dark:bg-gray-900">
      <div>
        <Sidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <Header />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 lg:mb-6 dark:text-white">
            Dashboard Content goes here
          </h2>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default MainLayout;
