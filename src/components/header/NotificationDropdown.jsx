import React, { useState } from "react";
import { Link } from "react-router";
import { Bell } from "lucide-react";
import {
  useGetAllNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} from "../../redux/features/admin/notification/notificationApi";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { getIcon } from "../../utils/getIcon";
import { useSelector } from "react-redux";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "member"; // admin | merchant | member


  console.log("-------------------------------");
  console.log("role", role);

  const { data } = useGetAllNotificationsQuery({ page: 1, role });

  console.log("data::::", data);
  
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();


  // console.log("role", user);

  const notifications = data?.notifications?.slice(0, 10) || [];
  const unreadCount = data?.statistics?.total_unread || 0;

  const handleToggle = async () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && unreadCount > 0) {
      await markAllAsRead(role);
    }
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        className="relative flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-full h-11 w-11 hover:bg-gray-100 transition"
        onClick={handleToggle}
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <Bell size={18} />
      </button>

      {/* Dropdown */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[12px] flex flex-col w-[360px] max-h-[480px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-lg p-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <h5 className="text-lg font-semibold text-gray-800">Notifications</h5>
          <button
            onClick={() => markAllAsRead(role)}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {/* Notification List */}
        <ul className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-5 text-sm">
              No notifications found
            </p>
          ) : (
            notifications.map((n) => (
              <Link
                to={
                  role === "member"
                    ? `/member/notification/${n.id}`
                    : role === "merchant"
                    ? `/merchant/notification/${n.id}`
                    : `/admin/notification/${n.id}`
                }
                key={n.id}
                onClick={closeDropdown}
              >
                <DropdownItem
                  className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 hover:bg-gray-100 transition ${
                    n.status === "unread" ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </DropdownItem>
              </Link>
            ))
          )}
        </ul>

        {/* Footer */}
        <Link
          to={
            role === "member"
              ? "/member/notification"
              : role === "merchant"
              ? "/merchant/notification"
              : "/admin/notification"
          }
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
