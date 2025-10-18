import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import {
  ChartArea,
  ChartLine,
  ChevronDownIcon,
  CircleUserRound,
  DollarSign,
  FileUser,
  LayoutDashboard,
  List,
  LogOut,
  QrCode,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  UserCircle2,
  UserCog,
  Users,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import { logo, MaxReward } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";

const othersItems = [];

const Sidebar = () => {
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

      // clear local Redux state & localStorage
      dispatch(logoutAction());
      toast.success(res?.message || "Logged out successfully ");
      // redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed ");
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const NAV_CONFIG = {
    admin: [
      { icon: <LayoutDashboard />, name: "Dashboard", path: "/admin" },
      { name: "Member Manage", icon: <Users />, path: "/admin/member-manage" },
      { name: "Staff Manage", icon: <UserCog />, path: "/admin/staff-manage" },
      {
        name: "Merchant",
        icon: <ShoppingBag />,
        subItems: [
          {
            name: "Pending Merchant",
            path: "/admin/merchant/pending-merchant",
          },
          { name: "Active Merchant", path: "/admin/merchant/active-merchant" },
        ],
      },
      {
        name: "Accounts",
        icon: <ChartArea />,
        subItems: [
          { name: "Income", path: "/admin/accounts/income" },
          { name: "Expense", path: "/admin/accounts/expense" },
        ],
      },
      {
        name: "Reports",
        icon: <ChartLine />,
        subItems: [
          { name: "Transaction", path: "/admin/reports/transaction" },
          { name: "Voucher Purchase", path: "/admin/reports/voucher-purchase" },
          {
            name: "Member Points Report",
            path: "/admin/reports/member-points-report",
          },
          { name: "Tree Performance", path: "/admin/reports/tree-performance" },
          { name: "Redemption History", path: "/admin/reports/redemption" },
        ],
      },
      { name: "Profile", icon: <UserCircle2 />, path: "/admin/profile" },
      { name: "Logout", icon: <LogOut />, path: "/login" },
    ],
    merchant: [
      { icon: <LayoutDashboard />, name: "Dashboard", path: "/merchant" },
      {
        icon: <Users />,
        name: "Member Registration",
        path: "/merchant/member-registration",
      },
      {
        icon: <Users />,
        name: "Merchant Staff",
        path: "/merchant/merchant-staff",
      },
      {
        icon: <ChartArea />,
        name: "Transactions",
        subItems: [
          {
            name: "Pending Approval",
            path: "/merchant/transactions/pending-approval",
          },
          {
            name: "Approved Transactions",
            path: "/merchant/transactions/approved-transactions",
          },
        ],
      },
      {
        icon: <ShoppingBag />,
        name: "Redeem Mall",
        path: "/merchant/redeem-mall",
      },
      {
        icon: <ChartArea />,
        name: "Voucher Purchase",
        path: "/merchant/voucher-purchase",
      },
      {
        icon: <ChartLine />,
        name: "Reports",
        subItems: [
          {
            name: "Member Transactions",
            path: "/merchant/reports/member-transactions",
          },
          {
            name: "Voucher Purchase",
            path: "/merchant/reports/voucher-purchase",
          },
          {
            name: "Redeem Transactions",
            path: "/merchant/reports/redeem-mall-transactions",
          },
        ],
      },
      { icon: <CircleUserRound />, name: "Profile", path: "/merchant/profile" },

      { name: "Logout", icon: <LogOut />, path: "/login" },
    ],
    member: [
      { icon: <LayoutDashboard />, name: "Dashboard", path: "/member" },
      {
        icon: <Users />,
        name: "Refer New Member",
        path: "/member/referred-member",
      },
      {
        icon: <QrCode />,
        name: "Show QR Code",
        path: "/member/show-qr-code",
      },
      {
        icon: <ChartArea />,
        name: "Point Statement",
        path: "/member/point-statement",
      },
      {
        icon: <ShoppingBag />,
        name: "Max Redeem Mall",
        path: "/member/max-redeem-mall",
      },
      {
        icon: <DollarSign />,
        name: "Purchase Voucher",
        path: "/member/purchase-voucher",
      },
      {
        icon: <ShoppingCart />,
        name: "Shop With Merchant",
        path: "/member/shop-with-merchant",
      },
      {
        icon: <List />,
        name: "Referred Member List",
        path: "/member/referred-member-list",
      },
      { icon: <UserCog />, name: "Community", path: "/member/community" },
      {
        icon: <FileUser />,
        name: "Merchant Application",
        path: "/member/merchant-application",
      },
      { icon: <CircleUserRound />, name: "Profile", path: "/member/profile" },
      {
        icon: <ScrollText />,
        name: "Terms & Condition",
        path: "/member/terms-and-condition",
      },
      {
        icon: <ShieldCheck />,
        name: "Data Privacy Policy",
        path: "/member/terms-and-condition",
      },

      { name: "Logout", icon: <LogOut /> },
    ],
  };
  const items = useMemo(() => NAV_CONFIG[role]);
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

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
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-4  h-4 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-white"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : nav.name === "Logout" ? (
            <button
              onClick={handleLogout}
              className={`menu-item group menu-item-inactive w-full text-left`}
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
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
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
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
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
