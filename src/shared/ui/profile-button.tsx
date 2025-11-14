import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ProfileButton = () => {

    const onPress = () => console.log("Profile pressed");

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
                <Ionicons name={"person-outline"} size={24} color="#000000" />
            </View>
        </View>

    </TouchableOpacity>
}