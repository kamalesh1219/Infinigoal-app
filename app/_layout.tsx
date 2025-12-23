import "../global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { useEffect } from "react";
import AuthProvider from "@/providers/AuthProviders";
import { CartProvider } from "@/providers/CartProvider";
 

// Prevent auto-hide
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
    <CartProvider>
    <AuthProvider> 
      <Stack screenOptions={{ headerShown: false }}>   
          <Stack.Screen name="(auth)" />      
          <Stack.Screen name="(tabs)" />          
          <Stack.Screen name="categorie/[slug]" />
          <Stack.Screen name="productdetails/[id]" />
      </Stack>
    </AuthProvider>  
    </CartProvider> 
    </ThemeProvider>
  );
}
