import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Platform, StatusBar, View } from "react-native";

export default function SignIn() {
  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-black text-foreground mb-4 text-center">
          Sign In
        </Text>

        <Text className="text-lg text-muted-foreground text-center mb-12">
          Welcome back to QUICK!
        </Text>

        {/* Apple Sign In Button */}
        <Button size="lg" className="bg-black w-full mb-4">
          <Text className="text-white font-semibold">Continue with Apple</Text>
        </Button>

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
