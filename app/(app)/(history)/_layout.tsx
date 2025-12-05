import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function HistoryLayout() {
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
        name="history"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="history-details"
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
