import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-3xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}