import { useDeviceRegistration } from "@/features/notifications/use-device-registration";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const { isSignedIn, user } = useUser();
  const { registerDevice, deviceId } = useDeviceRegistration();

  // Регистрируем устройство при входе пользователя (если еще не зарегистрировано)
  useEffect(() => {
    if (isSignedIn && user && (user?.phoneNumbers?.length ?? 0) > 0 && !deviceId) {
      registerDevice().catch((error) => {
        console.error("Failed to register device on app mount:", error);
      });
    }
  }, [isSignedIn, user, deviceId, registerDevice]);

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
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="qr-scanner"
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          animation: "fade",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="manual-enter"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="rental-info"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="how-to-return"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="rental-finished"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="(profile)"
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="(wallet)"
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="(rent)"
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="(history)"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
