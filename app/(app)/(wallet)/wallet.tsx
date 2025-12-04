import { useWalletService, WalletHistory } from "@/app/api/wallet-service";
import { Button } from "@/shared/ui/button";
import { ScreenSection } from "@/shared/ui/screen-section";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
    const walletService = useWalletService();
    const [balance, setBalance] = useState<number | null>(null);
    const [history, setHistory] = useState<WalletHistory | null>(null);
    const router = useRouter();
    const getBalance = async () => {
        const balance = await walletService.getBalance();
        return balance;
    };

    const getHistory = async () => {
        const history = await walletService.getHistory();
        return history;
    };

    useEffect(() => {
        getBalance().then((balance) => {
            console.log('balance', balance);
            setBalance(balance);
        });
        getHistory().then((history) => {
            console.log('history', history);
            setHistory(history);
        });
    }, []);

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScreenTitle title="Wallet" />
            <View className="bg-gray-50 flex-1">
                <ScreenSection roundedTop={false}>
                    <View className="flex-row items-baseline justify-center mb-8">
                        <Text>AED</Text><Text className="text-4xl font-bold ">{balance?.toFixed?.(2).replace('.', ',')},</Text><Text className="text-2xl font-bold ">00</Text>
                    </View>
                    <Button className="h-auto rounded-2xl p-4" onPress={() => {}}>
                        <Text className="text-xl font-medium">Add money</Text>
                    </Button>
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