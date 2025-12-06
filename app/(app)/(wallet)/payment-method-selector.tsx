import { PaymentMethod } from "@/app/api/payment-methods-service";
import PaymentMethodItem from "@/features/payment-methods/payment-method-item";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { Button } from "@/shared/ui/button";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethodSelector() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);
    const setSelectedPaymentMethod = usePaymentMethodsStore((state) => state.setSelectedPaymentMethod);
    const selectedPaymentMethod = usePaymentMethodsStore((state) => state.selectedPaymentMethod);
    const hideBalanceButton = useSearchParams().get('hideBalanceButton') === 'true';

    const renderItems = hideBalanceButton ? paymentMethods.filter((method) => method.id !== null) : paymentMethods;
    const onPaymentMethodTap = (method: PaymentMethod) => {
        setSelectedPaymentMethod(method);
        router.back();
    }

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Select payment method" />
            <ScrollView>
                <View className="px-4">
                    {renderItems.map((method) => {
                        return <PaymentMethodItem 
                        key={method.id} 
                        method={method} 
                        onTap={() => onPaymentMethodTap(method)} 
                        isSelected={selectedPaymentMethod?.id === method.id}
                        />
                    })}
                </View>
            </ScrollView>
            <View className="px-4 pb-6">
                <Button onPress={() => router.push("/(app)/(wallet)/add-card")} className="rounded-2xl h-14">
                    <Text className="text-lg font-semibold text-primary-foreground">Add Payment Method</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}