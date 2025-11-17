import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export const ProfileButton = () => {
    const router = useRouter();
    const onPress = () => {
        console.log("Profile pressed");
        router.dismiss(1);
        router.push('/(profile)/profile');
    };

    return <TouchableOpacity
        key={"profile"}
        activeOpacity={0.7}
        onPress={onPress}
        className={"w-full rounded-2xl bg-white p-6 min-h-[80px] flex-row justify-between items-between"}
    >
        <View className="flex-col justify-between gap-2">
            <Text className="text-[18px] font-semibold text-gray-900 text-start">
                {"Profile"}
            </Text>
            <Text className="text-[18px] text-gray-500 text-start">
                {'phone number'}
            </Text>
        </View>
        <View className="flex items-center justify-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
                <User size={24} color="#000000" />
            </View>
        </View>

    </TouchableOpacity>
}