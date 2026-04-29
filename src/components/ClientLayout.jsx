import { useEffect, useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useClientAuth } from "../hooks/ClientAuthContext";

const NAV = [
  { path: "/client/dashboard", icon: "⊞", label: "Tableau de bord" },
  { path: "/client/reservations", icon: "📅", label: "Mes réservations" },
  { path: "/client/profil", icon: "👤", label: "Mon profil" },
];

export default function ClientLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, client: profile } = useClientAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ---------------- RESPONSIVE ----------------
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

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/compte");
  };

  // ---------------- UI HELPERS ----------------
  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  const isLoggedIn = !!user;

  // ---------------- RENDER ----------------
  return (
    <div className="font-sora bg-[#07070c] text-cream h-screen flex overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      {!isMobile && (
        <aside
          className="bg-dark-bg border-r border-white/[0.06] flex flex-col h-screen"
          style={{ width: collapsed ? "64px" : "220px" }}
        >
          {/* HEADER */}
          <div className="py-5 px-4 border-b border-white/[0.06] flex justify-between items-center">
            {!collapsed && (
              <div>
                <div className="font-bold text-gold">DRIVO</div>
                <div className="text-[10px] text-cream/40">Espace client</div>
              </div>
            )}

            <button
              onClick={() => setCollapsed((c) => !c)}
              className="text-cream/40"
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>

          {/* USER */}
          {!collapsed && profile && (
            <div className="p-4 border-b border-white/[0.06] flex gap-2 items-center">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {initials}
              </div>

              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">
                  {profile.first_name} {profile.last_name}
                </div>
                <div className="text-[11px] text-cream/40 truncate">
                  {profile.email}
                </div>
              </div>
            </div>
          )}

          {/* NAV */}
          <nav className="flex flex-col p-2 gap-1">
            {NAV.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    active ? "bg-gold/10 text-gold" : "text-cream/60"
                  }`}
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="mt-auto p-3 border-t border-white/[0.06]">
            <button onClick={handleLogout} className="text-red-400 text-sm">
              Déconnexion
            </button>
          </div>
        </aside>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4">
          <div className="text-sm text-cream/60">
            {profile?.first_name
              ? `Bonjour ${profile.first_name}`
              : "Mon espace"}
          </div>

          {isLoggedIn && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                {initials}
              </div>
              <span className="text-xs text-cream/60">
                {profile?.first_name}
              </span>
            </div>
          )}
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
