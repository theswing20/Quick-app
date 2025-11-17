import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Platform, StatusBar, View } from "react-native";
import {
  AppleSignInButton,
  GoogleSignInButton,
} from "../../src/features/auth/login";

export default function SignIn() {
  const { isSignedIn } = useUser();
  console.log("isSignedIn", isSignedIn);
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="items-center justify-center flex-1 px-6">
        <Text className="mb-4 text-3xl font-black text-center text-foreground">
          Sign In
        </Text>

        <Text className="mb-12 text-lg text-center text-muted-foreground">
          Welcome back to QUICK!
        </Text>

        {/* Apple Sign In Button */}
        <AppleSignInButton />
        {/* Google Sign In Button */}
        <GoogleSignInButton />

        {/* Back to Home - Android style */}
        {Platform.OS === "android" && (
          <Link href="/" asChild>
            <Button variant="ghost" className="flex-row items-center">
              <ArrowLeft
                size={20}
                style={{ marginRight: 8 }}
              />
              <Text className="font-medium">Back to Home</Text>
            </Button>
          </Link>
        )}
      </View>
    </View>
  );
}
