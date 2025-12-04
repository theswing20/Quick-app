import { useWalletService, WalletHistory } from "@/app/api/wallet-service";
import { WalletHistoryComponent } from "@/features/wallet";
import { Button } from "@/shared/ui/button";
import { ScreenSection } from "@/shared/ui/screen-section";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useWalletStore } from "@/shared/stores/wallet-store";

export default function Wallet() {
    const [balanceParts, setBalanceParts] = useState<[string, string] | null>(['0', '00']);
    const router = useRouter();
    const balance = useWalletStore((state) => state.balance);


    useEffect(() => {
        const balanceParts = balance.toFixed(2).split('.');
        setBalanceParts(balanceParts as [string, string]);
    }, [balance]);

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Wallet" />
            <View className="bg-gray-50 flex-1">
                <ScreenSection roundedTop={false}>
                    <View className="flex-row items-baseline justify-center mb-8">
                        <Image source={require('@/shared/assets/images/dirham-icon.png')}
                            style={{ width: 24, height: 24 }}
                            contentFit="contain"
                        />
                        <Text className="text-4xl font-bold ">&nbsp;{balanceParts?.[0]},</Text>
                        <Text className="text-2xl font-bold ">{balanceParts?.[1]}</Text>

                    </View>
                    <Button className="h-auto rounded-2xl p-4" onPress={() => { router.push("/(app)/(wallet)/account-replenishment") }}>
                        <Text className="text-xl font-medium">Add money</Text>
                    </Button>
                </ScreenSection>
                <ScreenSection roundedBottom={false} className="flex-1">
                    <WalletHistoryComponent />
                </ScreenSection>
            </View>
        </SafeAreaView>
    )
}