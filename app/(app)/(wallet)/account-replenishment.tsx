import { usePaymentsService } from "@/app/api/payments-service";
import PaymentMethodSelectorButton from "@/features/payment-methods/payment-method-selector-button";
import { useUpdateBalance } from "@/shared/hooks/useUpdateBalance";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import QuickAmountButton from "@/shared/ui/quick-amount-button";
import { ScreenSection } from "@/shared/ui/screen-section";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const QUICK_ADD_AMOUNTS = [25, 50, 75, 100] as const;

export default function AccountReplenishment() {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const paymentsService = usePaymentsService();
    const selectedPaymentMethod = usePaymentMethodsStore((state) => state.selectedPaymentMethod);
    const router = useRouter();
    const updateBalance = useUpdateBalance();
    const handleChange = (text: string) => {
        let cleaned = text.replace(/[^0-9.,]/g, "");
        cleaned = cleaned.replace(",", ".");

        if (cleaned.startsWith(".")) {
            cleaned = "0" + cleaned;
        }
        const parts = cleaned.split(".");
        if (parts.length > 2) {
            cleaned = parts[0] + "." + parts.slice(1).join("");
        }
        if (parts.length === 2 && parts[1].length > 2) {
            cleaned = parts[0] + "." + parts[1].substring(0, 2);
        }

        setValue(cleaned);
    };

    const handleAddMoney = async () => {
        setIsLoading(true);
        try {
            const response = await paymentsService.postPaymentTopUp({
                amount: parseFloat(value),
                paymentMethodId: selectedPaymentMethod?.id,
            });

            console.log("response", response);
            if (response.paymentIntentId) {
                await updateBalance();
                router.replace({
                    pathname: "/(app)/(wallet)/replenishment-success",
                    params: { amount: value }
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Account Replenishment" />
            <View className="bg-gray-50 flex-1">
                <ScreenSection roundedTop={false} className="px-0">
                    <View className="px-4">
                        <PaymentMethodSelectorButton />
                        <Input
                            placeholder="Enter amount"
                            className="border-0 border-b-[1px] bordfer-b-yellow-500 shadow-none text-center text-2xl font-bold mt-10 mb-10"
                            style={{ textAlign: 'center' }}
                            value={value}
                            onChangeText={handleChange}
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <ScrollView horizontal className="mb-4 px-4" showsHorizontalScrollIndicator={false}>
                        {QUICK_ADD_AMOUNTS.map((amount) => (
                            <QuickAmountButton key={amount} amount={amount} onTap={() => setValue(amount.toString())} />
                        ))}
                    </ScrollView>
                </ScreenSection>
            </View>
            <View className="p-4">
                <Button className="h-14 rounded-xl" onPress={() => { handleAddMoney() }} disabled={isLoading}>
                    <Text className="text-xl font-semibold text-primary-foreground">Add money</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}