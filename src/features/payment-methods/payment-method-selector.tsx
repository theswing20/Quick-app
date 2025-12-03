import { Text, TouchableOpacity, View } from "react-native";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, CreditCard } from "lucide-react-native";
import { capitalizeFirstLetter } from "@/shared/lib/utils";
import { THEME } from "@/shared/lib/theme";
import { router } from "expo-router";

export default function PaymentMethodSelector() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);
    const defaultPaymentMethod = usePaymentMethodsStore((state) => state.defaultPaymentMethod);
    const selectedPaymentMethod = usePaymentMethodsStore((state) => state.selectedPaymentMethod);
    const setSelectedPaymentMethod = usePaymentMethodsStore((state) => state.setSelectedPaymentMethod);

    useEffect(() => {
        if (!selectedPaymentMethod) {
            setSelectedPaymentMethod(defaultPaymentMethod);
        }
    }, [defaultPaymentMethod, selectedPaymentMethod]);

    const openPaymentMethods = () => {
        router.push({
            pathname: '/(wallet)/payment-methods',
        });
    }

    return (
        <TouchableOpacity onPress={openPaymentMethods}>
            <View className="w-full bg-primary-foreground text-primary p-4 rounded-2xl flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <CreditCard size={24} color={THEME.light.primary} />
                    <Text className="text-[18px] text-primary font-medium">{capitalizeFirstLetter(selectedPaymentMethod?.displayName ?? '')}</Text>
                </View>
                <ChevronRight size={24} color={THEME.light.primary} />
            </View>
        </TouchableOpacity>
    )
}