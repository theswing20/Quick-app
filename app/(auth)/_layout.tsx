import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn, user } = useUser();

  const hasPhoneNumber = (user?.phoneNumbers?.length ?? 0) > 0;

  if (isSignedIn && hasPhoneNumber) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
