import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethods() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);

    return (
        <SafeAreaView className="bg-white flex-1">
                <ScreenTitle title="Payment Methods" />
                <View>{
                    paymentMethods.map((method)=>{
                        return<Text key={method.id ?? 0}>{method.displayName}</Text>
                    })}</View>
        </SafeAreaView>
    );
}