import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  ClientAuthProvider,
  useClientAuthContext,
} from "../hooks/ClientAuthContext";

const NAV = [
  { path: "/client/dashboard", icon: "⊞", label: "Tableau de bord" },
  { path: "/client/reservations", icon: "📅", label: "Mes réservations" },
  { path: "/client/profil", icon: "👤", label: "Mon profil" },
];

// Exported default wraps everything in ClientAuthProvider so auth is fetched once
export default function ClientLayout() {
  return (
    <ClientAuthProvider>
      <ClientLayoutInner />
    </ClientAuthProvider>
  );
}

function ClientLayoutInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { client, logout } = useClientAuthContext();
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

  const handleLogout = () => {
    logout();
    navigate("/compte");
  };

  const sidebarW = collapsed ? "64px" : "220px";

  const initials = client
    ? `${client.first_name?.[0] ?? ""}${client.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  const NavLinks = ({ onClickItem }) => (
    <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active =
          location.pathname === item.path ||
          (item.path !== "/client/dashboard" &&
            location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClickItem}
            className={`flex items-center gap-2 rounded-[10px] no-underline transition-all duration-200 border-l-2 py-2.5 px-3 ${
              active
                ? "bg-gold/10 text-gold font-semibold border-gold"
                : "text-cream/55 border-transparent hover:bg-white/[0.04]"
            }`}
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="whitespace-nowrap text-[13px]">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="font-sora bg-[#07070c] text-cream min-h-screen flex">
      {/* Sidebar desktop */}
      {!isMobile && (
        <aside
          className="flex-shrink-0 bg-dark-bg border-r border-white/[0.06] flex flex-col sticky top-0 h-screen overflow-hidden transition-[width] duration-300 ease-out"
          style={{ width: sidebarW }}
        >
          {/* Header */}
          <div className="py-5 px-4 border-b border-white/[0.06] flex items-center justify-between gap-2">
            {!collapsed && (
              <div>
                <div className="font-playfair text-lg font-bold text-gold whitespace-nowrap">
                  DRIVO
                </div>
                <div className="text-[10px] text-cream/35 tracking-widest uppercase">
                  Espace client
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

          {/* Client info */}
          {!collapsed && client && (
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#5b8de8] to-[#2d5fc4] flex items-center justify-center text-sm font-extrabold text-white shrink-0">
                  {initials}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                    {client.first_name} {client.last_name}
                  </div>
                  <div className="text-[11px] text-cream/40 whitespace-nowrap overflow-hidden text-ellipsis">
                    {client.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          <NavLinks onClickItem={undefined} />

          {/* Bottom */}
          <div className="py-3 px-2 border-t border-white/[0.06] flex flex-col gap-0.5">
            <Link
              to="/"
              className="flex items-center gap-2 py-2.5 px-3 rounded-[10px] no-underline text-cream/35 text-[13px] hover:text-cream transition-colors"
            >
              <span>🌐</span>
              {!collapsed && <span>Site public</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 py-2.5 px-3 rounded-[10px] bg-transparent border-none text-cream/35 text-[13px] cursor-pointer hover:text-red-400 transition-colors text-left"
            >
              <span>🚪</span>
              {!collapsed && <span>Déconnexion</span>}
            </button>
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
            {client && (
              <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#5b8de8] to-[#2d5fc4] flex items-center justify-center text-sm font-extrabold text-white shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="font-bold text-sm">
                    {client.first_name} {client.last_name}
                  </div>
                  <div className="text-[11px] text-cream/40">
                    {client.email}
                  </div>
                </div>
              </div>
            )}
            <NavLinks onClickItem={() => setDrawerOpen(false)} />
            <div className="py-3 px-2 border-t border-white/[0.06]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 px-3.5 rounded-[10px] bg-transparent border-none text-cream/45 cursor-pointer hover:text-red-400 transition-colors text-[13px] w-full"
              >
                <span>🚪</span>
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
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
                  (n.path !== "/client/dashboard" &&
                    location.pathname.startsWith(n.path)),
              )?.label || "Mon espace"}
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
            {client && (
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg py-1.5 px-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#5b8de8] to-[#2d5fc4] flex items-center justify-center text-[11px] font-extrabold text-white">
                  {initials}
                </div>
                {!isMobile && (
                  <span className="text-xs font-semibold">
                    {client.first_name}
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-7 overflow-y-auto relative">
          {/* Decorative background */}
          <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden">
            {/* Ambient glow top-right — gold */}
            <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-gold/[0.10] blur-[130px]" />
            {/* Ambient glow bottom-left — blue */}
            <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full bg-[#2d5fc4]/[0.10] blur-[110px]" />
            {/* Ambient glow center — subtle purple */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#4a3a8c]/[0.06] blur-[140px]" />
            {/* Real car image watermark */}
            <img
              src="/_MConverter.eu_autof-removebg-preview (1).png"
              alt=""
              className="absolute bottom-0 right-0 w-[60%] h-full object-cover object-left opacity-10 mix-blend-screen"
              style={{ transform: "scaleX(-1)" }}
            />
            {/* Top edge glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/[0.15] to-transparent" />
          </div>

          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
