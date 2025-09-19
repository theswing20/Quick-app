import { NAV_THEME } from "@/shared/lib/theme";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import "../../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor:
              NAV_THEME[colorScheme ?? "light"].colors.background,
          },
          headerTintColor: NAV_THEME[colorScheme ?? "light"].colors.text,
          headerTitleStyle: {
            color: NAV_THEME[colorScheme ?? "light"].colors.text,
          },
        }}
      />
      <PortalHost />
    </>
  );
}
