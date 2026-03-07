import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { agency } from "../data/dashboardData";

const NAV = [
  { path: "/dashboard", icon: "⊞", label: "Vue d'ensemble" },
  { path: "/dashboard/voitures", icon: "🚗", label: "Mes voitures" },
  { path: "/dashboard/reservations", icon: "📅", label: "Réservations" },
  { path: "/dashboard/paiements", icon: "💳", label: "Paiements" },
  { path: "/dashboard/blacklist", icon: "🚫", label: "Blacklist" },
  { path: "/dashboard/profil", icon: "⚙️", label: "Profil agence" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(false);
    };
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const sidebarW = collapsed ? "64px" : "220px";

  return (
    <div className="font-sora bg-[#07070c] text-cream min-h-screen flex">
      {/* Sidebar desktop */}
      {!isMobile && (
        <aside
          className="flex-shrink-0 bg-dark-bg border-r border-white/[0.06] flex flex-col sticky top-0 overflow-hidden transition-[width] duration-300 ease-out"
          style={{ width: sidebarW }}
        >
          {/* Logo */}
          <div className="py-5 px-4 border-b border-white/[0.06] flex items-center justify-between gap-2">
            {!collapsed && (
              <div>
                <div className="font-playfair text-lg font-bold text-gold whitespace-nowrap">
                  DRIVO
                </div>
                <div className="text-[10px] text-cream/35 tracking-widest uppercase">
                  Espace agence
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="bg-transparent border-none text-cream/40 cursor-pointer text-base p-1 shrink-0"
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>

          {/* Agency info */}
          {!collapsed && (
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-gold to-[#8a6520] flex items-center justify-center text-sm font-extrabold text-[#0a0a0f] shrink-0">
                  {agency.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    {agency.name}
                  </div>
                  <div className="text-[11px] text-gold">
                    📍 {agency.city}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.path !== "/dashboard" &&
                  location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-[10px] no-underline transition-all duration-200 justify-start border-l-2 ${
                    active
                      ? "bg-gold/10 text-gold font-semibold border-gold py-2.5 px-3"
                      : "text-cream/55 border-transparent py-2.5 px-3 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="py-3 px-2 border-t border-white/[0.06]">
            <Link
              to="/"
              className="flex items-center gap-2 py-2.5 px-3 rounded-[10px] no-underline text-cream/35 text-[13px] justify-start hover:text-cream"
            >
              <span>🌐</span>
              {!collapsed && <span>Site public</span>}
            </Link>
          </div>
        </aside>
      )}

      {/* Mobile drawer */}
      {isMobile && drawerOpen && (
        <div className="fixed inset-0 z-[300] flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-[260px] bg-dark-bg h-screen flex flex-col border-r border-white/[0.08] z-10">
            <div className="py-5 px-4 border-b border-white/[0.06] flex justify-between items-center">
              <div className="font-playfair text-xl font-bold text-gold">
                DRIVO
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="bg-transparent border-none text-cream/50 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
              {NAV.map((item) => {
                const active =
                  location.pathname === item.path ||
                  (item.path !== "/dashboard" &&
                    location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 py-3 px-3.5 rounded-[10px] no-underline transition-all ${
                      active
                        ? "bg-gold/10 text-gold font-semibold"
                        : "text-cream/65"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-dark-bg border-b border-white/[0.06] flex items-center justify-between px-6 md:px-7 sticky top-0 z-[100]">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="bg-transparent border-none text-cream text-xl cursor-pointer"
              >
                ☰
              </button>
            )}
            <div className="text-[13px] text-cream/40">
              {NAV.find(
                (n) =>
                  location.pathname === n.path ||
                  (n.path !== "/dashboard" &&
                    location.pathname.startsWith(n.path)),
              )?.label || "Dashboard"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-cream/30 hidden md:block">
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg py-1.5 px-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-gold to-[#8a6520] flex items-center justify-center text-[11px] font-extrabold text-[#0a0a0f]">
                {agency.name.charAt(0)}
              </div>
              {!isMobile && (
                <span className="text-xs font-semibold">{agency.name}</span>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-7 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
