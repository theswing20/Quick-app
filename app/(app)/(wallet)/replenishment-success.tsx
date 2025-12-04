import { Button } from "@/shared/ui/button";
import { CheckCircle } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME } from "@/shared/lib/theme";

export default function ReplenishmentSuccess() {
    const router = useRouter();
    const { amount } = useLocalSearchParams<{ amount: string }>();

    const handleDone = () => {
        router.dismissAll();
        router.back();
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            <View className="flex-1 justify-center items-center px-6">
                {/* Success Icon */}
                <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-6">
                    <CheckCircle size={64} color={THEME.light.primaryForeground}  />
                </View>

                {/* Amount Text */}
                <Text className="text-3xl font-bold text-black mb-2">
                    +{amount || "0"} AED
                </Text>

                {/* Subtitle */}
                <Text className="text-base text-gray-600 text-center mb-12">
                    Already in your account
                </Text>
            </View>
            
            {/* Done Button */}
            <View className="w-full px-4 pb-8">
                <Button 
                    className="h-14 rounded-2xl" 
                    onPress={handleDone}
                >
                    <Text className="text-xl font-semibold">Great</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}

