import { NAV_THEME } from "@/shared/lib/theme";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: NAV_THEME.light.colors.background,
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(auth)"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
    </ClerkProvider>
  );
}
