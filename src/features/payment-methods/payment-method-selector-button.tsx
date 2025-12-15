import { THEME } from "@/shared/lib/theme";
import { capitalizeFirstLetter } from "@/shared/lib/utils";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { router } from "expo-router";
import { ChevronRight, CreditCard } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PaymentMethodSelectorButton({ hideBalanceButton = false }: { hideBalanceButton?: boolean }) {
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
            const isDefaultBalance = defaultPaymentMethod?.id === null;
            
            const selectedPaymentMethod = isDefaultBalance && hideBalanceButton ? paymentMethods.filter((method) => method.id !== null)[0] : defaultPaymentMethod;
            setSelectedPaymentMethod(selectedPaymentMethod);
        }
    }, [defaultPaymentMethod, selectedPaymentMethod]);

    const openPaymentMethods = () => {
        if(hideBalanceButton && paymentMethods.filter((method) => method.id !== null).length === 0){
            router.push("/(app)/(wallet)/add-card");
            return;
        }
        router.push({
            pathname: '/(app)/(wallet)/payment-method-selector',
            params: {
                hideBalanceButton: hideBalanceButton.toString(),
            },
        });
    }

    return (
        <TouchableOpacity onPress={openPaymentMethods} activeOpacity={0.7}>
            <View className="w-full bg-primary-foreground text-primary p-4 rounded-2xl flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                    <CreditCard size={20} color={THEME.light.primary} />
                    {selectedPaymentMethod ? <Text className="text-base text-primary font-medium">{capitalizeFirstLetter(selectedPaymentMethod?.displayName ?? '')}</Text> :
                    <Text className="text-base text-primary">Select payment method</Text>}
                </View>
                <ChevronRight size={20} color={THEME.light.primary} />
            </View>
        </TouchableOpacity>
    )
}