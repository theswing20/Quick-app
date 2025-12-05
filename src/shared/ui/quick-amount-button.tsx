import { CurrencyAmount } from "@/shared/ui/currency-amount";
import { TouchableOpacity, View } from "react-native";

export default function QuickAmountButton({ amount, onTap }: { amount: number, onTap: () => void }) {
    return (
        <TouchableOpacity onPress={onTap} activeOpacity={0.7}>
            <View className="bg-primary/75 text-primary py-3 px-5 rounded-2xl flex-row items-center justify-center mr-2">
                <CurrencyAmount amount={amount} size="md" variant="default" />
            </View>
        </TouchableOpacity>
    )
}   