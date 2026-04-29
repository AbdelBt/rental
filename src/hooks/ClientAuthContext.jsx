import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ClientAuthContext = createContext(null);

export function ClientAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user and customer profile on mount and auth state changes
  useEffect(() => {
    const loadUserAndProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current session user
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          setError(userError.message);
          setUser(null);
          setClient(null);
          return;
        }

        setUser(authUser);

        if (authUser) {
          // Fetch customer profile linked by auth_user_id
          const { data: profile, error: profileError } = await supabase
            .from("customers")
            .select("*")
            .eq("auth_user_id", authUser.id)
            .single();

          if (profileError && profileError.code !== "PGRST116") {
            // PGRST116 = no rows found, which is ok on first signup
            setError(profileError.message);
          }
          setClient(profile);
        } else {
          setClient(null);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error loading user/profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndProfile();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from("customers")
            .select("*")
            .eq("auth_user_id", authUser.id)
            .single();

          if (profileError && profileError.code !== "PGRST116") {
            setError(profileError.message);
          }
          setClient(profile);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching profile on auth change:", err);
        }
      } else {
        setClient(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  // Method to update customer profile
  const patchCustomer = async (updates) => {
    if (!client?.id) {
      setError("No customer profile found");
      return { error: new Error("No customer profile found") };
    }

    try {
      const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", client.id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { error };
      }

      setClient(data);
      return { data };
    } catch (err) {
      setError(err.message);
      console.error("Error updating customer:", err);
      return { error: err };
    }
  };

  const value = {
    user,
    client,
    loading,
    error,
    patchCustomer,
  };

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error("useClientAuth must be used within ClientAuthProvider");
  }
  return context;
}
