import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  }

  const navLinkClass = ({ isActive }) =>
    `font-medium transition-colors ${
      isActive
        ? "text-indigo-600"
        : "text-slate-600 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-indigo-600 sm:text-2xl">
          Fullstack Forge Store
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Feed
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Produk
          </NavLink>

          {user && (
            <>
              <NavLink to="/cart" className={navLinkClass}>
                🛒 Keranjang
              </NavLink>

              <NavLink
                to={`/profile/${user.username}`}
                className={navLinkClass}
              >
                Profil
              </NavLink>

              <NotificationBell />

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 sm:px-4"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
