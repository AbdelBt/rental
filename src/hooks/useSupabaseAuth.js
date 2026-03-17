import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useSupabaseAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Erreur session:", error);
                    setLoading(false);
                    return;
                }

                setSession(session);
                setUser(session?.user ?? null);
            } catch (err) {
                console.error("Erreur:", err);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                if (event === 'SIGNED_IN') {
                    // Session established
                }
            }
        );

        return () => subscription?.unsubscribe();
    }, []);

    return { user, loading, session };
}