import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import ComponentCard from "../../../components/common/ComponentCard";
import { dummyNotifications } from "../../../constant/notifications";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import { Link } from "react-router";
import { cn } from "../../../lib/utils";

const Notification = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredNotifications = notifications.filter((n) => {
    const matchFilter = filter === "all" ? true : n.status === filter;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: "read",
              is_read: true,
              is_count_read: true,
              read_at: new Date().toISOString(),
            }
          : n
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: "unread",
              is_read: false,
              is_count_read: false,
              read_at: null,
            }
          : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Notifications" }]}
      />

      <ComponentCard>
        <div className="flex items-center justify-between mb-4">
          <SearchInput
            placeholder="Search notification"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <PrimaryButton onClick={() => setFilter("all")}>All</PrimaryButton>
            <PrimaryButton onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </PrimaryButton>
            <PrimaryButton onClick={() => setFilter("read")}>
              Read
            </PrimaryButton>
          </div>
        </div>

        <div className="bg-white rounded-lg divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications found.
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "p-4 flex justify-between items-start hover:bg-gray-50 transition",
                  n.status === "unread" && "bg-blue-50"
                )}
              >
                <Link
                  to={`/admin/notification/${n.id}`}
                  className="flex items-start gap-3 flex-1"
                  onClick={n.status === "unread" && markAsRead}
                >
                  {n.status === "unread" ? (
                    <Circle className="text-blue-500 w-4 h-4 mt-1" />
                  ) : (
                    <CheckCircle2 className="text-gray-400 w-4 h-4 mt-1" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{n.title}</h4>
                    <p className="text-gray-600 text-sm">{n.message}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                </Link>

                <div className="flex gap-2">
                  {n.status === "unread" ? (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsUnread(n.id)}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Mark as Unread
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ComponentCard>
    </div>
  );
};

export default Notification;
