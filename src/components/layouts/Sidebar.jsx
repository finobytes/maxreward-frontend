import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { ChevronDownIcon } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { logo, MaxReward } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";
import {
  useLogoutMutation,
  useVerifyMeQuery,
} from "../../redux/features/auth/authApi";
import { toast } from "sonner";
import { NAV_CONFIG } from "../../config/navConfig";
import { baseApi } from "../../redux/api/baseApi";

const othersItems = [];

const Sidebar = () => {
  const [activeMainIndex, setActiveMainIndex] = useState(null);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [logoutApi, { isLoading }] = useLogoutMutation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // call backend logout endpoint
      const res = await logoutApi(user?.role).unwrap();

      dispatch(baseApi.util.resetApiState());
      // clear local Redux state & localStorage
      dispatch(logoutAction());
      toast.success(res?.message || "Logged out successfully ");
      // redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed ");
      dispatch(baseApi.util.resetApiState());
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const { data, refetch } = useVerifyMeQuery(role);

  const userType = data?.member_type;

  console.log("userType:", userType);

  const items = useMemo(() => {
    let navItems = NAV_CONFIG[role] || [];

    // hide Merchant Application if member_type === 'corporate'
    if (role === "member" && userType === "corporate") {
      navItems = navItems.filter(
        (item) => item.name !== "Merchant Application"
      );
    }

    return navItems;
  }, [role, userType]);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );
  // restore active menu based on URL (on reload or route change)
  useEffect(() => {
    let found = false;
    items.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setActiveMainIndex(index); // submenu  parent active
            found = true;
          }
        });
      } else if (isActive(nav.path)) {
        setActiveMainIndex(index); // normal menu active
        found = true;
      }
    });

    if (!found) setActiveMainIndex(null);
  }, [location.pathname, items, isActive]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const menuItems = menuType === "main" ? items : othersItems;
      menuItems.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => {
                handleSubmenuToggle(index, menuType);
                setActiveMainIndex(index); // temporary active main menu
              }}
              className={`menu-item group ${
                activeMainIndex === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  activeMainIndex === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="menu-item-text">{nav.name}</span>
                  <ChevronDownIcon
                    className={`ml-auto w-4 h-4 transition-transform duration-200 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-white"
                        : ""
                    }`}
                  />
                </>
              )}
            </button>
          ) : nav.name === "Logout" ? (
            <button
              onClick={handleLogout}
              className="menu-item group menu-item-inactive w-full text-left"
            >
              <span className="menu-item-icon-size menu-item-icon-inactive">
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">
                  {isLoading ? "Logging out..." : "Logout"}
                </span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                onClick={() => setActiveMainIndex(index)} // temporary active
                className={`menu-item group ${
                  activeMainIndex === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-6.5">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      onClick={() => setActiveMainIndex(index)} // parent active on submenu click
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[240px]"
            : isHovered
            ? "w-[240px]"
            : "w-[74px]"
        } 
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to={`/${role}`}>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className=""
                src={MaxReward}
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img src={logo} width={42} height={42} alt="Logo" />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : null}
              </h2>
              {renderMenuItems(items, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
