import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  const hasPhoneNumber = (user?.phoneNumbers?.length ?? 0) > 0;

  if (!hasPhoneNumber) {
    return <Redirect href="/phone-verification" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="menu"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="marker-details"
        options={{
          headerShown: false,
          animation: "none",
          gestureEnabled: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </Stack>
  );
}
