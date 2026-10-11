
import { useState } from "react";

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-bell">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Buka notifikasi"
        aria-expanded={isOpen}
      >
        🔔
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <h3>Notifikasi</h3>
          <p>Fitur notifikasi ecommerce sedang disiapkan.</p>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
