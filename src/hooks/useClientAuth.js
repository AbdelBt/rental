import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

const LS_KEY = "drivo_customer";

function saveToCache(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (_) {}
}

function loadFromCache() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch (_) { return null; }
}

function clearCache() {
  try { localStorage.removeItem(LS_KEY); } catch (_) {}
}

export function useClientAuth() {
  // Initialise depuis le cache localStorage pour éviter le flash de chargement
  const [user, setUser]         = useState(null);
  const [session, setSession]   = useState(null);
  const [customer, setCustomer] = useState(() => loadFromCache());
  const [loading, setLoading]   = useState(true);

  const userRef = useRef(null);

  const saveCustomer = (data) => {
    setCustomer(data);
    if (data) saveToCache(data);
    else clearCache();
  };

  const fetchCustomer = async (authUser) => {
    if (!authUser) { saveCustomer(null); return; }

    try {
      const { data } = await supabase
        .from("customers")
        .select("*")
        .eq("auth_user_id", authUser.id)
        .maybeSingle();

      if (data) {
        saveCustomer(data);
        return;
      }

      // Row missing — create it from user_metadata
      const m = authUser.user_metadata ?? {};
      const { data: created } = await supabase
        .from("customers")
        .insert([{
          auth_user_id: authUser.id,
          email:        authUser.email,
          first_name:   m.first_name ?? "",
          last_name:    m.last_name  ?? "",
          phone:        m.phone      ?? "",
        }])
        .select()
        .single();

      saveCustomer(created ?? {
        id:           null,
        auth_user_id: authUser.id,
        email:        authUser.email,
        first_name:   m.first_name ?? "",
        last_name:    m.last_name  ?? "",
        phone:        m.phone      ?? "",
      });
    } catch (_) {
      // Network error — garde le cache existant si dispo, sinon user_metadata
      const cached = loadFromCache();
      if (cached && cached.auth_user_id === authUser.id) return; // cache valide, on ne touche pas
      const m = authUser.user_metadata ?? {};
      saveCustomer({
        id:           null,
        auth_user_id: authUser.id,
        email:        authUser.email,
        first_name:   m.first_name ?? "",
        last_name:    m.last_name  ?? "",
        phone:        m.phone      ?? "",
      });
    }
  };

  // Refresh customer row on demand (full re-fetch)
  const refresh = () => fetchCustomer(userRef.current);

  // Optimistic patch — met à jour l'état local ET le cache instantanément
  const patchCustomer = (fields) => {
    setCustomer((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...fields };
      saveToCache(updated);
      return updated;
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;
      if (session?.user) {
        const cached = loadFromCache();
        if (cached && cached.auth_user_id === session.user.id) {
          setLoading(false);
          fetchCustomer(session.user).catch(() => {});
          return;
        }
      }
      try { await fetchCustomer(session?.user ?? null); } catch (_) {}
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;
      if (event === "SIGNED_OUT") {
        clearCache();
        setCustomer(null);
      } else if (event === "SIGNED_IN") {
        try { await fetchCustomer(session?.user ?? null); } catch (_) {}
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Memoized — stable reference prevents infinite re-render loops in consumers
  const client = useMemo(() => customer
    ? {
        id:                customer.id,
        auth_id:           customer.auth_user_id,
        email:             customer.email,
        first_name:        customer.first_name ?? "",
        last_name:         customer.last_name  ?? "",
        phone:             customer.phone      ?? "",
        license_verified:  customer.license_verified,
        id_front_verified: customer.id_front_verified,
        id_back_verified:  customer.id_back_verified,
      }
    : null,
  [customer]);

  const logout = () => supabase.auth.signOut();

  return { user, client, customer, session, loading, logout, refresh, patchCustomer, isLoggedIn: !!user };
}
