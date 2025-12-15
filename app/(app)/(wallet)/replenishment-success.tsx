import { Button } from "@/shared/ui/button";
import { CheckCircle } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { THEME } from "@/shared/lib/theme";
import { useUpdateBalance } from "@/shared/hooks/useUpdateBalance";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { useEffect } from "react";

export default function ReplenishmentSuccess() {
    const router = useRouter();
    const { amount } = useLocalSearchParams<{ amount: string }>();
    const updateBalance = useUpdateBalance();
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);

    useEffect(() => {
        if (paymentMethods.filter((method) => method.id !== null).length === 0) {
            router.push("/(app)/(wallet)/add-card");
        }
    }, [paymentMethods, router]);

    const handleDone = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.dismissAll();
        }
        try{
            updateBalance();
        } catch (error) {
            console.error('Error updating balance', error);
        }
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            <View className="flex-1 justify-center items-center px-6">
                {/* Success Icon */}
                <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-6">
                    <CheckCircle size={64} color={THEME.light.primaryForeground}  />
                </View>

                {/* Amount Text */}
                <View className="flex-row items-center justify-center mb-2">
                    <Text className="text-3xl font-bold text-gray-900">
                        {parseFloat(amount || "0")} AED
                    </Text>
                </View>

                {/* Subtitle */}
                <Text className="text-base text-gray-600 text-center mb-12">
                    Already in your account
                </Text>
            </View>
            
            {/* Done Button */}
            <View className="w-full px-4 pb-6">
                <Button 
                    className="h-14 rounded-2xl" 
                    onPress={handleDone}
                >
                    <Text className="text-lg font-semibold text-primary-foreground">Great</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}

