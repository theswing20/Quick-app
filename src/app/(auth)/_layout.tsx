import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
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
