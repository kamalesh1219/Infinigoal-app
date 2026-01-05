import { supabase } from "@/src/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { PropsWithChildren,createContext, useContext, useEffect, useState } from "react";

type AuthData = {
    session : Session | null;
    loading: boolean;
};

const AuthContext = createContext<AuthData>({
   session : null,
   loading: true,
});

export default function AuthProvider({ children } : PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("🔥 AUTH SESSION LOADED:", data.session);
      setSession(data.session);
      setLoading(false);

      if (data.session) {
        router.replace("/(tabs)/newhome");
      } else {
        router.replace("/(auth)/sign-in");
      }
    };

    load();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session) {
          router.replace("/(tabs)/newhome");
        } else {
          router.replace("/(auth)/sign-in");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);
 

  return (
    <AuthContext.Provider value = {{session,loading}}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)


