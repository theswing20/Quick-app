import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export const ProfileName = ({ name }: { name: string }) => {
    const router = useRouter();
    const onPress = () => {
        router.push(`/(app)/(profile)/edit/name`);
    };
    return (
        <TouchableOpacity
            className="w-full flex-row items-center justify-between border border-gray-200 rounded-2xl p-4 bg-gray-50 mb-3"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View className="flex-col items-start justify-between flex-1">
                <Text className="text-sm font-medium text-gray-500 mb-1">Name</Text>
                <Text className="text-base font-medium text-gray-900 text-start">{name}</Text>
            </View>
            <View className="w-8 h-8 flex items-center justify-center rounded-full">
                <ChevronRight size={20} color="#000000" />
            </View>
        </TouchableOpacity>
    )
}