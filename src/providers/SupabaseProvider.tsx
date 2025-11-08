import { createContext, useContext, PropsWithChildren } from "react";
import { supabase } from "@/integrations/supabase/client";

const SupabaseContext = createContext({ supabase });

export const SupabaseProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseClient = () => useContext(SupabaseContext).supabase;
