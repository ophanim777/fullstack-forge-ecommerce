import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          Odin Book
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <Link
              to={`/profile/${user.username}`}
              className="font-medium hover:text-blue-600"
            >
              {user.firstName}
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}