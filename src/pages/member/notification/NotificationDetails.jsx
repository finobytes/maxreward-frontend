import React from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { useGetNotificationByIdQuery } from "../../../redux/features/admin/notification/notificationApi";

const NotificationDetails = () => {
  const { id } = useParams();
  const { data: notification, isLoading } = useGetNotificationByIdQuery(id);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (!notification) return <p className="p-4 text-gray-500">Not found.</p>;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/member" },
          { label: "Notifications", to: "/member/notification" },
          { label: "Notification Details" },
        ]}
      />

      <ComponentCard>
        <h2 className="text-xl font-semibold mb-3">{notification.title}</h2>
        <p className="text-gray-600 mb-4">{notification.message}</p>

        {notification.data && Object.keys(notification.data).length > 0 && (
          <pre className="text-sm bg-gray-50 p-3 rounded border border-gray-200">
            {JSON.stringify(notification.data, null, 2)}
          </pre>
        )}

        <div className="text-xs text-gray-400 mt-4">
          Created at: {new Date(notification.created_at).toLocaleString()}
        </div>
      </ComponentCard>
    </div>
  );
};

export default NotificationDetails;
