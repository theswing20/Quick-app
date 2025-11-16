import { Ionicons } from "@expo/vector-icons"
import { Image, View } from "react-native"

export const ProfileAvatar = () => {
    return (
        <View className="w-full flex-row items-center justify-center  p-2">
            <View className="w-10 h-10 flex items-center justify-center rounded-full bg-primary">
                {/* <Image source={} className="w-10 h-10" /> */}
                <Ionicons name={"person-outline"} size={24} color="#000000" />
            </View>
        </View>
    )
}