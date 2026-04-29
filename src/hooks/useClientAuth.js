import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

const LS_KEY = "drivo_customer";

/* ------------------ CACHE ------------------ */
function saveToCache(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (_) {}
}

function loadFromCache() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY));
  } catch (_) {
    return null;
  }
}

function clearCache() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch (_) {}
}

/* ------------------ HOOK ------------------ */
export function useClientAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [customer, setCustomer] = useState(() => loadFromCache());
  const [loading, setLoading] = useState(true);

  const userRef = useRef(null);
  const initRef = useRef(false);

  /* ------------------ CUSTOMER ------------------ */
  const saveCustomer = (data) => {
    setCustomer(data);
    if (data) saveToCache(data);
    else clearCache();
  };

  const fetchCustomer = async (authUser) => {
    if (!authUser?.id) return;

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

      // create if not exists
      const m = authUser.user_metadata ?? {};

      const { data: created } = await supabase
        .from("customers")
        .insert([
          {
            auth_user_id: authUser.id,
            email: authUser.email,
            first_name: m.first_name ?? "",
            last_name: m.last_name ?? "",
            phone: m.phone ?? "",
          },
        ])
        .select()
        .single();

      saveCustomer(
        created ?? {
          id: null,
          auth_user_id: authUser.id,
          email: authUser.email,
          first_name: m.first_name ?? "",
          last_name: m.last_name ?? "",
          phone: m.phone ?? "",
        }
      );
    } catch (err) {
      console.error("fetchCustomer error:", err);

      const cached = loadFromCache();
      if (cached?.auth_user_id === authUser.id) return;

      const m = authUser.user_metadata ?? {};

      saveCustomer({
        id: null,
        auth_user_id: authUser.id,
        email: authUser.email,
        first_name: m.first_name ?? "",
        last_name: m.last_name ?? "",
        phone: m.phone ?? "",
      });
    }
  };

  /* ------------------ PATCH ------------------ */
  const patchCustomer = (fields) => {
    setCustomer((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...fields };
      saveToCache(updated);
      return updated;
    });
  };

  /* ------------------ INIT (SAFE) ------------------ */
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let mounted = true;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;

      if (session?.user) {
        const cached = loadFromCache();

        if (cached?.auth_user_id === session.user.id) {
          setCustomer(cached);
        } else {
          await fetchCustomer(session.user);
        }
      }

      setLoading(false);
    };

    initAuth();

    /* ------------------ LISTENER ------------------ */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;

      if (event === "SIGNED_OUT") {
        clearCache();
        setCustomer(null);
      }

      if (event === "SIGNED_IN" && session?.user) {
        await fetchCustomer(session.user);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* ------------------ CUSTOMER OBJECT ------------------ */
  const client = useMemo(
    () =>
      customer
        ? {
            id: customer.id,
            auth_id: customer.auth_user_id,
            email: customer.email,
            first_name: customer.first_name ?? "",
            last_name: customer.last_name ?? "",
            phone: customer.phone ?? "",
            license_verified: customer.license_verified,
            id_front_verified: customer.id_front_verified,
            id_back_verified: customer.id_back_verified,
          }
        : null,
    [customer]
  );

  /* ------------------ ACTIONS ------------------ */
  const logout = () => supabase.auth.signOut();

  const refresh = () => fetchCustomer(userRef.current);

  /* ------------------ RETURN ------------------ */
  return {
    user,
    client,
    customer,
    session,
    loading,
    logout,
    refresh,
    patchCustomer,
    isLoggedIn: !!user,
  };
}