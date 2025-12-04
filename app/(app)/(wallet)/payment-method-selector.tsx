import { PaymentMethod } from "@/app/api/payment-methods-service";
import PaymentMethodItem from "@/features/payment-methods/payment-method-item";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { Button } from "@/shared/ui/button";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethodSelector() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);
    const setSelectedPaymentMethod = usePaymentMethodsStore((state) => state.setSelectedPaymentMethod);
    const selectedPaymentMethod = usePaymentMethodsStore((state) => state.selectedPaymentMethod);

    const renderItems = paymentMethods;
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
            <View className="p-4">
                <Button onPress={() => router.push("/(app)/(wallet)/add-card")} className="rounded-3xl h-12">
                    <Text className="text-[18px]">Add Payment Method</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}