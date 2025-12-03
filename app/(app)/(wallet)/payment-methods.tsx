import PaymentMethodItem from "@/features/payment-methods/payment-method-item";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { Button } from "@/shared/ui/button";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethods() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);

    const renderItems = paymentMethods.filter((method) => method.id !== null);

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Payment Methods" />
            <ScrollView>
                <View>{
                    renderItems.map((method) => {
                        return <PaymentMethodItem key={method.id} method={method} />
                    })}</View>
            </ScrollView>
            <View className="p-4">
                <Button onPress={() => router.push("/add-card")}  className="rounded-3xl h-12">
                    <Text className="text-[18px]">Add Payment Method</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}