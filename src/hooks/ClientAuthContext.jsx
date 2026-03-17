import { createContext, useContext, useMemo } from "react";
import { useClientAuth } from "./useClientAuth";

const ClientAuthContext = createContext(null);

// Wrap around ClientLayout so auth is fetched once and shared to all child pages
export function ClientAuthProvider({ children }) {
  const { user, client, customer, session, loading, logout, refresh, patchCustomer, isLoggedIn } = useClientAuth();

  // Memoize context value — prevents all consumers from re-rendering on unrelated state changes
  const value = useMemo(
    () => ({ user, client, customer, session, loading, logout, refresh, patchCustomer, isLoggedIn }),
    // logout/refresh/patchCustomer are stable refs (defined outside effects); omit to avoid dep churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, client, customer, session, loading, isLoggedIn],
  );

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  );
}

// Use this in child pages instead of useClientAuth() directly
export function useClientAuthContext() {
  return useContext(ClientAuthContext);
}
