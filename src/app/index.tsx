import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Button>
        <Text>Button</Text>
      </Button>
    </View>
  );
}
