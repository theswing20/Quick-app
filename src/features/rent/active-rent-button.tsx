import { TouchableOpacity, View, Text } from "react-native";
import { useRentStore } from "@/shared/stores/rent-store";
import { router } from "expo-router";

export default function ActiveRentButton() {
    const rental = useRentStore((state) => state.rental);
    if(!rental) {
        return null;
    }
    return (
        <TouchableOpacity onPress={() => router.push({pathname:`/(app)/rental-info`})}>
            <View className="bg-primary-foreground/70 text-primary p-4 rounded-2xl flex-row items-center justify-between">
                <Text className="opacity-100 text-primary font-bold">{rental.powerBankDeviceId}</Text>
            </View>
        </TouchableOpacity>
    )
}