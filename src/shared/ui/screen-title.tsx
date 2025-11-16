import { Ionicons } from "@expo/vector-icons"
import { View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"

export const ScreenTitle = ({ title, backButton = true, closeButton = false }: { title: string, backButton?: boolean, closeButton?: boolean }) => {
    const router = useRouter();
    const onBack = () => {
        if (backButton) {
            router.back();
        }
    }
    const onClose = () => {
        router.dismissAll();
    }
    return (
        <View className="w-full flex-row items-center justify-between">
            <View className="w-10 h-10 flex items-center justify-center">
                {backButton && <TouchableOpacity onPress={onBack}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>}
            </View>
            <Text className="text-2xl font-bold text-center">{title}</Text>
            <View className="w-10 h-10 flex items-center justify-center">
                {closeButton && <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>}
            </View>
        </View>
    )
}