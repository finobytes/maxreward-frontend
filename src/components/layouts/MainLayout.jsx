import { Outlet } from "react-router";

import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import Sidebar from "./Sidebar";
import Backdrop from "./Backdrop";
import Header from "./Header";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen, isMobile } = useSidebar();

  // Sidebar width determine
  const sidebarWidth = isExpanded || isHovered ? "240px" : "74px";

  const layoutStyle = isMobile
    ? { marginLeft: 0, width: "100%" }
    : {
        marginLeft: isMobileOpen ? "0px" : sidebarWidth,
        width: isMobileOpen ? "100%" : `calc(100% - ${sidebarWidth})`,
      };

  return (
    <div className="min-h-screen flex bg-gray-100 overflow-x-hidden">
      <Sidebar />
      <Backdrop />

      <div
        className="transition-all duration-300 ease-in-out flex-1"
        style={layoutStyle}
      >
        <Header />
        <div className="p-4 max-w-screen-2xl mx-auto overflow-x-hidden">
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
