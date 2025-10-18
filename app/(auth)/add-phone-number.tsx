import { Text } from "@/shared/ui/text";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="items-center justify-center flex-1 px-6">
        <Text className="text-xl font-semibold">Add Phone Number</Text>
      </View>
    </SafeAreaView>
  );
}
