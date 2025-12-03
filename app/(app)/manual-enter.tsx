import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScreenTitle } from "@/shared/ui/screen-title";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCabinetsService } from "@/app/api/cabinets-service";
import { AxiosError } from "axios";
import { useNewRentStore } from "@/shared/stores/new-rent-store";

export default function ManualEnter() {
    const [value, setValue] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const cabinetsService = useCabinetsService();
    const { setCabinetInfo } = useNewRentStore();
    
    const handleSave = async () => {
        setIsLoading(true);
        try {
            const cabinetInfo = await cabinetsService.getCabinetInfo(value);
            console.log("cabinetInfo", cabinetInfo);
            if(cabinetInfo.id){
                setCabinetInfo(cabinetInfo);
                router.dismissAll();
                router.push("/(app)/(rent)/pre-rent-info");
            }
        } catch (error) {
            if(error instanceof AxiosError) {
                Alert.alert("Check the QR code", "The QR code is not valid");
            } else {
                Alert.alert("Something went wrong", "Please try again later");
            }
        } finally {
            setIsLoading(false);
        }
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