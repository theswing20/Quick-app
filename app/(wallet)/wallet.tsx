import { Button } from "@/shared/ui/button";
import { ScreenSection } from "@/shared/ui/screen-section";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Wallet" />
            <View className="bg-gray-50 flex-1">
                <ScreenSection roundedTop={false}>
                    <View className="flex-row items-baseline justify-center mb-8">
                    <Text className="text-4xl font-bold ">0,</Text><Text className="text-2xl font-bold ">00</Text>
                    </View>
                    <Button className="h-auto rounded-2xl p-4"><Text className="text-xl font-medium">Add money</Text></Button>
                </ScreenSection>
                <ScreenSection roundedBottom={false} className="flex-1">
                    <View className="flex-col items-center justify-center flex-1">
                    <Text className="text-base text-gray-500 text-center">Here you will find the history of deposits and withdrawals.</Text>
                    </View>
                </ScreenSection>
            </View>
        </SafeAreaView>
    )
}