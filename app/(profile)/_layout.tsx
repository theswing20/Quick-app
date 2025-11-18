import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function ProfileLayout() {
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
        name="profile"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
    </Stack>
  );
}
