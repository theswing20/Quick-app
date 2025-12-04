import {WalletHistoryItem} from "@/app/api/wallet-service";
import {View, Text} from "react-native";
import {Zap} from "lucide-react-native";
import {Image} from "expo-image";

export default function HistoryItem({item}: { item: WalletHistoryItem }) {
    console.log('history item', item)
    return <View className={"w-full flex-row gap-4 mt-4 justify-center items-center"}>
        <View className={"w-10 h-10 rounded-full bg-primary flex items-center justify-center"}>
            <Zap size={32}/>
        </View>
        <View className={"flex-col flex-1"}>
            <Text className={"text-xl font-medium text-primary-foreground"}>{item.type}</Text>
            <Text className={"text-xl font-medium text-primary-foreground/50"}>{item.description}</Text>
        </View>
        <View className={"flex-row items-center justify-center"}>
            <Image
                source={require('@/shared/assets/images/dirham-icon.png')}
                style={{width: 18, height: 18}}
                contentFit="contain"
            />
            <Text className={"text-xl font-medium text-primary-foreground"}>

                &nbsp;{item.amount}
            </Text>
        </View>
    </View>
}