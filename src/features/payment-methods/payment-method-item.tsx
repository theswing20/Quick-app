import { View, Text, TouchableOpacity } from "react-native";
import { PaymentMethod } from "@/app/api/payment-methods-service";
import { Check, CreditCard } from "lucide-react-native";
import { THEME } from "@/shared/lib/theme";
import { capitalizeFirstLetter } from "@/shared/lib/utils";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { useRouter } from "expo-router";

export default function PaymentMethodItem(props: { method: PaymentMethod}) {
    const { method } = props;
    const isSelected = usePaymentMethodsStore((state) => state.selectedPaymentMethod?.id === method.id);
    const setSelectedPaymentMethod = usePaymentMethodsStore((state) => state.setSelectedPaymentMethod);
    const router = useRouter();

    const handleTap = () => {
        setSelectedPaymentMethod(method);
        router.back();
    }

    return (
        <TouchableOpacity onPress={handleTap}>
        <View className="w-full p-4 rounded-2xl flex-row items-center justify-between gap-4">
            <View className="flex-row items-center gap-4">
            <View className="w-10 h-10 bg-primary rounded-[16px] items-center justify-center">
                <CreditCard size={24} color={THEME.light.primaryForeground} />
            </View>
            <Text className="text-[18px]">{capitalizeFirstLetter(method.displayName)}</Text>
            </View>
            {isSelected && <View className="rounded-full bg-primary h-10 w-10 shadow-sm flex items-center justify-center">
                <Check size={28} color={THEME.light.primaryForeground} />
            </View>}
        </View>
        </TouchableOpacity>
    )
}