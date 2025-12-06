import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export const ProfileButton = () => {
    const router = useRouter();
    const { user } = useUser();
    const onPress = () => {
        console.log("Profile pressed");
        router.dismiss(1);
        setTimeout(() => {
            router.push("/(app)/(profile)/profile");
        }, 100);
    };

    return <TouchableOpacity
        key={"profile"}
        activeOpacity={0.7}
        onPress={onPress}
        className={"w-full rounded-2xl bg-white p-6 min-h-[80px] flex-row justify-between items-center shadow-sm"}
    >
        <View className="flex-col justify-between gap-2 flex-1">
            <Text className="text-lg font-semibold text-gray-900 text-start">
                {"Profile"}
            </Text>
            <Text className="text-base text-gray-500 text-start">
                {user?.phoneNumbers?.[0]?.phoneNumber ?? ""}
            </Text>
        </View>
        <View className="flex items-center justify-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
                <User size={20} color="#000000" />
            </View>
        </View>

    </TouchableOpacity>
}