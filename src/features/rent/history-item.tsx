import { RentalHistoryItem } from "@/app/api/rentals-service";
import { THEME } from "@/shared/lib/theme";
import { formatDateTime } from "@/shared/lib/utils";
import { CurrencyAmount } from "@/shared/ui/currency-amount";
import { Zap } from "lucide-react-native";
import { Text, View } from "react-native";

export default function HistoryItem({ item }: { item: RentalHistoryItem }) {
    return (
        <View
            className="w-full flex-row items-center justify-between rounded-2xl bg-white p-4 border border-gray-200 mb-3"
        >
            <View className="flex-row items-center justify-start gap-3 flex-1">
                <Zap color={THEME.light.primary} size={20} />
                <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">{formatDateTime(item.startTime)}</Text>
                    <Text className="text-sm text-gray-500">#{item.powerBankDeviceId}</Text>
                </View>
            </View>
            <View className="flex-row items-center">
                <CurrencyAmount amount={item.cost} size="sm" />
            </View>
        </View>
    )
}
