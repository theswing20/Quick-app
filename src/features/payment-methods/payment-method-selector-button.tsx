import { THEME } from "@/shared/lib/theme";
import { capitalizeFirstLetter } from "@/shared/lib/utils";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { router } from "expo-router";
import { ChevronRight, CreditCard } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PaymentMethodSelectorButton() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);
    const defaultPaymentMethod = usePaymentMethodsStore((state) => state.defaultPaymentMethod);
    const selectedPaymentMethod = usePaymentMethodsStore((state) => state.selectedPaymentMethod);
    const setSelectedPaymentMethod = usePaymentMethodsStore((state) => state.setSelectedPaymentMethod);

    useEffect(() => {
        return () => {
            setSelectedPaymentMethod(null);
        }
    }, []);

    useEffect(() => {
        if (!selectedPaymentMethod) {
            setSelectedPaymentMethod(defaultPaymentMethod);
        }
    }, [defaultPaymentMethod, selectedPaymentMethod]);

    const openPaymentMethods = () => {
        router.push({
            pathname: '/(app)/(wallet)/payment-method-selector',
        });
    }

    return (
        <TouchableOpacity onPress={openPaymentMethods} activeOpacity={0.7}>
            <View className="w-full bg-primary-foreground text-primary p-4 rounded-2xl flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    <CreditCard size={20} color={THEME.light.primary} />
                    <Text className="text-base text-primary font-medium">{capitalizeFirstLetter(selectedPaymentMethod?.displayName ?? '')}</Text>
                </View>
                <ChevronRight size={20} color={THEME.light.primary} />
            </View>
        </TouchableOpacity>
    )
}