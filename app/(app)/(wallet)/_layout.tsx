import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function WalletLayout() {
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
        name="wallet"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="add-payment-method"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="add-card"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
