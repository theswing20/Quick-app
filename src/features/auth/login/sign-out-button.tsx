import { Button } from "@/shared/ui/button";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text } from "react-native";

const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace("/");
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button onPress={handleSignOut}>
      <Text>Sign out</Text>
    </Button>
  );
};

export default SignOutButton;
