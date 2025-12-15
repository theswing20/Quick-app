import { WalletHistoryComponent } from "@/features/wallet";
import { useUpdateBalance } from "@/shared/hooks/useUpdateBalance";
import { useWalletStore } from "@/shared/stores/wallet-store";
import { Button } from "@/shared/ui/button";
import { ScreenSection } from "@/shared/ui/screen-section";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
    const router = useRouter();
    const balance = useWalletStore((state) => state.balance);
    const updateBalance = useUpdateBalance();
    
    useEffect(() => {
        updateBalance();    
    }, []);

    const handleAddMoney = () => {
            router.push("/(app)/(wallet)/account-replenishment");

    }

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Wallet" />
            <View className="bg-gray-50 flex-1">
                <ScreenSection roundedTop={false}>
                    <View className="items-center justify-center mb-8">
                        <Text className="text-3xl font-bold text-gray-900">
                            {balance} AED
                        </Text>
                    </View>
                    <Button className="h-14 rounded-2xl" onPress={handleAddMoney}>
                        <Text className="text-lg font-semibold text-primary-foreground">Add money</Text>
                    </Button>
                </ScreenSection>
                <ScreenSection roundedBottom={false} className="flex-1">
                    <WalletHistoryComponent />
                </ScreenSection>
            </View>
        </SafeAreaView>
    )
}