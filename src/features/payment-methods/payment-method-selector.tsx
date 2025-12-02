import { Text, View } from "react-native";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { useEffect, useState } from "react";

export default function PaymentMethodSelector() {
    const paymentMethods = usePaymentMethodsStore((state) => state.paymentMethods);
    const defaultPaymentMethod = usePaymentMethodsStore((state) => state.defaultPaymentMethod);
    const selectedPaymentMethod = usePaymentMethodsStore((state) => state.selectedPaymentMethod);
    const setSelectedPaymentMethod = usePaymentMethodsStore((state) => state.setSelectedPaymentMethod);

    useEffect(() => {
        setSelectedPaymentMethod(defaultPaymentMethod);
    }, [defaultPaymentMethod]);

    return (
        <View>
            <Text>Payment Method Selector</Text>
        </View>
    )
}