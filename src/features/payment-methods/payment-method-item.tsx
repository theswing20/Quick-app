import { PaymentMethod } from "@/app/api/payment-methods-service";
import { THEME } from "@/shared/lib/theme";
import { capitalizeFirstLetter } from "@/shared/lib/utils";
import { Image } from 'expo-image';
import { Check, CreditCard } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

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
        <TouchableOpacity onPress={onTap} disabled={!onTap} activeOpacity={0.7}>
            <View className="mx-1 p-4 rounded-2xl flex-row items-center justify-between gap-4 bg-gray-50 mb-3 shadow-sm">
                <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 bg-primary/50 rounded-xl items-center justify-center">
                        {!iconPath
                            ? <CreditCard size={20} color={THEME.light.primaryForeground} />
                            : <Image source={iconPath} className="w-10 h-10" contentFit="contain" style={{ width: 32, height: 40 }} />}
                    </View>
                    <Text className="text-base font-medium text-gray-900">{capitalizeFirstLetter(method.displayName)}</Text>
                </View>
                {isSelected && <View className="rounded-full bg-primary h-6 w-6 shadow-sm flex items-center justify-center">
                    <Check size={16} color={THEME.light.primaryForeground} />
                </View>}
            </View>
        </TouchableOpacity>
    )
}