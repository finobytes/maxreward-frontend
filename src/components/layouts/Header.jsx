import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router";
import { useSidebar } from "../../context/SidebarContext";
import UserDropdown from "../header/UserDropdown";
import { logo } from "../../assets/assets";
import { Menu, X, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useVerifyMeQuery } from "../../redux/features/auth/authApi";
import { useGetAllNotificationsQuery } from "../../redux/features/admin/notification/notificationApi";

const Header = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const { user, token } = useSelector((state) => state.auth);
  const role = user?.role || "member"; // admin | merchant | member

  const { data, isLoading, refetch } = useVerifyMeQuery(role, { skip: !token });
  const { data: notificationData } = useGetAllNotificationsQuery({
    page: 1,
    role,
  });

  const unreadCount = notificationData?.statistics?.total_unread || 0;

  useEffect(() => {
    if (token) refetch();
  }, [token, refetch]);

  const userInfo = data ||
    user || {
      name: "Loading...",
      email: "Loading...",
    };

  const handleNotificationClick = () => {
    if (role === "admin") {
      navigate("/admin/notification");
    } else if (role === "merchant") {
      navigate("/merchant/notification");
    } else if (role === "member") {
      navigate("/member/notification");
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-50 ">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 ">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 rounded-lg"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X /> : <Menu />}
            {/* Cross Icon */}
          </button>

          <Link to="/" className="lg:hidden w-10 h-10">
            <img className="" src={logo} alt="Logo" />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-3 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* <!-- Notification Menu Area --> */}
            <button
              className="relative flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-full h-11 w-11 hover:bg-gray-100 transition"
              onClick={handleNotificationClick}
            >
              <div className="relative">
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                <Bell size={18} />
              </div>
            </button>
          </div>
          {/* <!-- User Area --> */}
          <UserDropdown user={userInfo} role={role} />
        </div>
      </div>
    </header>
  );
};

export default Header;
