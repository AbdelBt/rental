import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

export function useClientAuth() {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stable ref to current auth user — lets refresh() work without dependencies
  const userRef = useRef(null);

  // Fetch customer row from public.customers, auto-create if missing
  // Also checks Supabase Storage to know which documents have been uploaded
  const fetchCustomer = async (authUser) => {
    if (!authUser) { setCustomer(null); return; }

    let row = null;
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (data) {
      row = data;
    } else {
      // No row yet — create it from user_metadata (handles users who signed up before this code)
      const m = authUser.user_metadata ?? {};
      const { data: created } = await supabase
        .from("customers")
        .insert([{
          auth_user_id: authUser.id,
          email: authUser.email,
          first_name: m.first_name ?? "",
          last_name: m.last_name ?? "",
          phone: m.phone ?? "",
        }])
        .select()
        .single();
      row = created ?? null;
    }

    // Check which documents exist in storage
    if (row) {
      const { data: files } = await supabase.storage
        .from("customer-documents")
        .list(authUser.id, { limit: 10 });

      const names = new Set((files ?? []).map((f) => f.name));
      row = {
        ...row,
        license_uploaded:  names.has("license"),
        id_front_uploaded: names.has("id_front"),
        id_back_uploaded:  names.has("id_back"),
      };
    }

    setCustomer(row);
  };

  // Expose refresh so profile page can re-fetch after saving changes
  const refresh = () => fetchCustomer(userRef.current);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;
      await fetchCustomer(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;
      await fetchCustomer(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Memoized client object — stable reference prevents infinite loops in consumers using [client] deps
  const client = useMemo(() => customer
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
  [customer]);

  const logout = () => supabase.auth.signOut();

  return { user, client, customer, session, loading, logout, refresh, isLoggedIn: !!user };
}
