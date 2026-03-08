import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useSupabaseAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Récupérer la session initiale
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

        // Écouter les changements d'auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log("Auth event:", event, session?.user?.email);

                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                // Force le re-rendu
                if (event === 'SIGNED_IN') {
                    // La session est établie
                }
            }
        );

        return () => subscription?.unsubscribe();
    }, []);

    return { user, loading, session };
}