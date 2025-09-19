import { NAV_THEME } from "@/shared/lib/theme";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import "../../global.css";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: NAV_THEME.light.colors.background,
          },
          headerShown: false,
        }}
      />
      <PortalHost />
    </>
  );
}
