import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, Redirect } from "expo-router";
import { Platform, StatusBar, View } from "react-native";
import { AppleSignInButton } from "../../src/features/auth/login";

export default function SignIn() {
  const { isSignedIn } = useUser();

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
        <Button size="lg" variant="outline" className="w-full mb-8">
          <Text className="font-semibold">Continue with Google</Text>
        </Button>

        {/* Back to Home - Android style */}
        {Platform.OS === "android" && (
          <Link href="/" asChild>
            <Button variant="ghost" className="flex-row items-center">
              <Ionicons
                name="arrow-back"
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
