import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManualEnter() {
    const [value, setValue] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.dismissAll();
            router.push("/(rent)/pre-rent-info");
        }, 1000);
    }


    return (

        <SafeAreaView className="flex-1 bg-white">
            <ScreenTitle title="Manual Enter" />
            <View className="flex-1 flex-col items-center justify-center px-6">
                <Input
                    placeholder="Enter station number"
                    className="border-0 shadow-none text-center text-2xl font-bold"
                    style={{ textAlign: 'center' }}
                    value={value}
                    onChangeText={setValue}
                />
            </View>
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            <View className="flex p-6">
                <Button className="h-14 rounded-xl" onPress={handleSave} disabled={!value}>
                    <Text className="text-xl font-semibold text-primary-foreground">Find</Text>
                </Button>
            </View>
        </SafeAreaView>
    )
}