import React, { useEffect } from "react";
import CustomSplash from "../components/CustomSplash";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";

export default function LoadingScreen() {
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/sign-in");
      }
    };

    setTimeout(checkAuth, 2000); // show splash 2 sec
  }, []);

  return <CustomSplash onFinish={() => {}} />;
}
