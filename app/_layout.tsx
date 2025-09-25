import { ClerkProviderWrapper } from "@/app/providers";
import { NAV_THEME } from "@/shared/lib/theme";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import "./styles/global.css";

export default function RootLayout() {
  return (
    <ClerkProviderWrapper>
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
    </ClerkProviderWrapper>
  );
}
