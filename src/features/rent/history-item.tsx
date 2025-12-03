import { RentalHistoryItem } from "@/app/api/rentals-service";
import { Zap } from "lucide-react-native";
import { Text, View, StyleSheet } from "react-native";
import { formatDateTime } from "@/shared/lib/utils";
import { THEME } from "@/shared/lib/theme";
import { Image } from 'expo-image';



export default function HistoryItem({ item }: { item: RentalHistoryItem }) {
    return (
        <View
            className="w-full h-20 flex-row items-center justify-between rounded-3xl bg-white p-4 border-[1px] border-gray-300"
        >
            <View className="flex-row items-center justify-start gap-4">
                <Zap color={THEME.light.primary} size={28} /><View>
                    <Text className="text-[18px] font-medium">{formatDateTime(item.startTime)}</Text>
                    <Text className="text-sm text-gray-500">#{item.powerBankDeviceId}</Text>
                </View>
            </View>
            <View><Text className="text-[18px] font-medium">{item.cost}&nbsp;
                <Image source={require('@/shared/assets/images/uae_symbol.svg')}
                    style={{ width: 12, height: 12 }}
                    contentFit="contain"
                />
                </Text>
                </View>
        </View>
    )
}
