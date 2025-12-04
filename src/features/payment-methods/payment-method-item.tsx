import { View, Text, TouchableOpacity } from "react-native";
import { PaymentMethod } from "@/app/api/payment-methods-service";
import { Check, CreditCard } from "lucide-react-native";
import { THEME } from "@/shared/lib/theme";
import { capitalizeFirstLetter } from "@/shared/lib/utils";
import { usePaymentMethodsStore } from "@/shared/stores/payment-methods-store";
import { useRouter } from "expo-router";
import { Image } from 'expo-image';

export default function PaymentMethodItem(props: { method: PaymentMethod, onTap?: () => void, isSelected?: boolean }) {
    const { method, onTap, isSelected } = props;

    let iconPath = null;

    switch (method.brand) {
        case 'visa':
            iconPath = require('@/shared/assets/images/visa.svg');
            break;
        case 'mastercard':
            iconPath = require('@/shared/assets/images/mastercard.svg');
    }

    return (
        <TouchableOpacity onPress={onTap} disabled={!onTap}>
            <View className="w-full p-4 rounded-2xl flex-row items-center justify-between gap-4 bg-gray-100 mb-4">
                <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 bg-primary/50 rounded-[16px] items-center justify-center">
                        {!iconPath 
                        ? <CreditCard size={24} color={THEME.light.primaryForeground} /> 
                        : <Image source={iconPath} className="w-10 h-10" contentFit="contain" style={{ width: 32, height: 40 }}/>}
                    </View>
                    <Text className="text-[18px]">{capitalizeFirstLetter(method.displayName)}</Text>
                </View>
                {isSelected && <View className="rounded-full bg-primary h-6 w-6 shadow-sm flex items-center justify-center">
                    <Check size={20} color={THEME.light.primaryForeground} />
                </View>}
            </View>
        </TouchableOpacity>
    )
}