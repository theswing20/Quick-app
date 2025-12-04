import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

export default function QuickAmountButton({ amount, onTap }: { amount: number, onTap: () => void }) {
    return (
        <TouchableOpacity onPress={onTap}>
            <View className="bg-primary/75 text-primary py-4 px-6 rounded-2xl flex-row items-center justify-center mr-2">
            <Image source={require('@/shared/assets/images/dirham-icon.png')}
                    style={{ width: 14, height: 14 }}
                    contentFit="contain"
                />
                <Text className="text-[18px] text-primary-foreground font-medium">&nbsp;{amount}</Text>
            </View>
        </TouchableOpacity>
    )
}   