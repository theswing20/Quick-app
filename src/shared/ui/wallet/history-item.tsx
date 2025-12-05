import { WalletHistoryItem } from "@/app/api/wallet-service";
import { CurrencyAmount } from "@/shared/ui/currency-amount";
import { Zap } from "lucide-react-native";
import { Text, View } from "react-native";

export default function HistoryItem({ item }: { item: WalletHistoryItem }) {
    return <View className={"w-full flex-row gap-4 my-2 justify-center items-center px-4"}>
        <View className={"w-10 h-10 rounded-full bg-primary flex items-center justify-center"}>
            <Zap size={20} color="#000000" />
        </View>
        <View className={"flex-col flex-1 gap-1"}>
            <Text className={"text-base font-medium text-gray-900"}>{item.type}</Text>
            <Text className={"text-sm text-gray-500"}>{item.description}</Text>
        </View>
        <View className={"flex-row items-center justify-center"}>
            <CurrencyAmount amount={item.amount} size="md" />
        </View>
    </View>
}