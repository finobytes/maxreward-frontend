import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import {
  Bell,
  Gift,
  CheckCircle,
  XCircle,
  Star,
  AlertTriangle,
  UserPlus,
  DollarSign,
  Lock,
  Award,
  ShoppingBag,
} from "lucide-react";
import { userImage } from "../../assets/assets";
import { dummyNotifications } from "../../constant/notifications";

// Helper: icon based on notification type
const getIcon = (type) => {
  switch (type) {
    case "referral_points_earned":
      return <UserPlus className="text-blue-500" size={18} />;
    case "community_points_earned":
      return <Star className="text-yellow-500" size={18} />;
    case "point_approval":
      return <CheckCircle className="text-green-500" size={18} />;
    case "purchase_approved":
      return <ShoppingBag className="text-green-500" size={18} />;
    case "purchase_rejected":
      return <XCircle className="text-red-500" size={18} />;
    case "cp_unlock":
      return <Lock className="text-indigo-500" size={18} />;
    case "referral_invite":
      return <UserPlus className="text-cyan-500" size={18} />;
    case "redemption":
      return <DollarSign className="text-green-500" size={18} />;
    case "milestone":
      return <Award className="text-purple-500" size={18} />;
    case "voucher_purchase":
      return <Gift className="text-pink-500" size={18} />;
    case "level_unlocked":
      return <Star className="text-amber-500" size={18} />;
    case "system_alert":
      return <AlertTriangle className="text-orange-500" size={18} />;
    default:
      return <Bell className="text-gray-400" size={18} />;
  }
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: "read", is_read: true }))
    );
  };
  const [notifying, setNotifying] = useState(true);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }
  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);

    markAllAsRead();
  };
  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full h-11 w-11 hover:text-gray-700 hover:bg-gray-100"
        onClick={handleClick}
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <Bell size={18} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[12px] flex h-[480px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <h5 className="text-lg font-semibold text-gray-800">Notifications</h5>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-5 text-sm">
              No notifications found
            </p>
          ) : (
            notifications.map((notification) => (
              <Link
                to={`/admin/notification/${notification.id}`}
                key={notification.id}
                onClick={closeDropdown}
              >
                <DropdownItem
                  onItemClick={closeDropdown}
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-100 transition ${
                    notification.status === "unread" ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-[11px] text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </div>
                </DropdownItem>
              </Link>
            ))
          )}
        </ul>

        <Link
          to="/admin/notification"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          onClick={closeDropdown}
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
};

export default NotificationDropdown;
