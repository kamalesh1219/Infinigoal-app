import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home main screen */}
      <Stack.Screen name="index" />

      {/* Product details */}
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
