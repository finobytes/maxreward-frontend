import { Outlet } from "react-router";

import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import Sidebar from "./Sidebar";
import Backdrop from "./Backdrop";
import Header from "./Header";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex bg-gray-100">
      <div>
        <Sidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[240px]" : "lg:ml-[74px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <Header />
        <div className="p-4 mx-auto max-w-[1800px] md:p-4 overflow-x-auto">
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
