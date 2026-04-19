import AppNavbar from "./AppNavbar";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppNavbar />
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
