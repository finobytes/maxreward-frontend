import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
import { dummyNotifications } from "../../../constant/notifications";
import ComponentCard from "../../../components/common/ComponentCard";

const NotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const found = dummyNotifications.find((n) => n.id === Number(id));
    if (found) {
      setNotification({ ...found, status: "read", is_read: true });
    } else {
      navigate("/admin/notification");
    }
  }, [id, navigate]);

  if (!notification) return null;

  return (
    <div>
      <PageBreadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Notifications", to: "/admin/notification" },
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
