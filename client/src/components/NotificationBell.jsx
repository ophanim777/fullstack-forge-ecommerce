import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
} from "../api/notification.api";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications);
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      }
    }

    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  async function handleNotificationClick(notification) {
    if (notification.isRead) {
      return;
    }

    try {
      await markNotificationAsRead(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Gagal menandai notifikasi sebagai sudah dibaca:",
        error
      );
    }
  }

  return (
    <div className="notification-bell">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <h3>Notifikasi</h3>

          {notifications.length === 0 ? (
            <p>Belum ada notifikasi.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification)
                }
                className={`notification-item ${
                  !notification.isRead
                    ? "unread"
                    : ""
                }`}
              >
                <strong>
                  {notification.actor.firstName}{" "}
                  {notification.actor.lastName}
                </strong>{" "}
                {notification.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;