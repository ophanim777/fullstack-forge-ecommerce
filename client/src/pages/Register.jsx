import { useState } from "react";
import { useNavigate } from "react-router-dom";

import * as authService from "../services/auth.service";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await authService.register(form);

      alert("Registrasi berhasil!");

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registrasi gagal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-[420px]"
      >
        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        <input
          className="border w-full p-3 rounded mb-3"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) =>
            setForm({
              ...form,
              firstName: e.target.value,
            })
          }
        />

        <input
          className="border w-full p-3 rounded mb-3"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) =>
            setForm({
              ...form,
              lastName: e.target.value,
            })
          }
        />

        <input
          className="border w-full p-3 rounded mb-3"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <input
          type="email"
          className="border w-full p-3 rounded mb-3"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="border w-full p-3 rounded mb-6"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
}