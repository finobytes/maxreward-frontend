import React, { useState } from "react";
import { CheckCircle2, Circle, Loader } from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import SearchInput from "../../../components/form/form-elements/SearchInput";
import { Link } from "react-router";
import { cn } from "../../../lib/utils";
import {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../../../redux/features/admin/notification/notificationApi";

const Notification = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAllNotificationsQuery({
    page,
    search,
    status: filter === "all" ? "" : filter,
    role: "member",
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.statistics?.total_unread || 0;

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[{ label: "Home", to: "/member" }, { label: "Notifications" }]}
      />

      <ComponentCard>
        <div className="flex items-center justify-between mb-4">
          <SearchInput
            placeholder="Search notification"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading || isFetching ? (
          <div className="p-6 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader className="w-4 h-4 animate-spin" /> Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No notifications found.
          </div>
        ) : (
          <div className="bg-white rounded-lg divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "p-4 flex justify-between items-start hover:bg-gray-50 transition",
                  n.status === "unread" && "bg-blue-50"
                )}
              >
                <Link
                  to={`/member/notification/${n.id}`}
                  className="flex items-start gap-3 flex-1"
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  {n.is_read === false ? (
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
              </div>
            ))}
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default Notification;
