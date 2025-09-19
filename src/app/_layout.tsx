import { NAV_THEME } from "@/shared/lib/theme";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing Clerk publishable key");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
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
      </ClerkLoaded>
    </ClerkProvider>
  );
}
