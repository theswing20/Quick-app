import { Ionicons } from "@expo/vector-icons"
import { ProfileBlock } from "./profile-block"
import { Text, TouchableOpacity, View } from "react-native"

export const ProfileLegal = () => {
    return (
        <ProfileBlock roundedBottom={false}>
            <Text className="text-xl font-medium flex-1 mb-4">Legal</Text>
            <View className="flex-col items-start justify-between bg-gray-50 rounded-3xl overflow-hidden mb-4">
                <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4">
                    <Text className="text-base ">Terms of Service</Text>
                    <View className="w-10 h-10 flex items-center justify-center rounded-full">
                        <Ionicons name={"arrow-forward"} size={24} color="#000000" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4">
                    <Text className="text-base ">Privacy Policy</Text>
                    <View className="w-10 h-10 flex items-center justify-center rounded-full">
                        <Ionicons name={"arrow-forward"} size={24} color="#000000" />
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4 bg-gray-50 mb-4 rounded-3xl">
                <Text className="text-base text-[#FF0000]">Delete Account</Text>
                <View className="w-10 h-10 flex items-center justify-center rounded-full">
                    <Ionicons name={"trash-outline"} size={24} color="#FF0000" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 p-4 bg-gray-50 rounded-3xl">
                <Text className="text-base ">Sign Out</Text>
                <View className="w-10 h-10 flex items-center justify-center rounded-full">
                    <Ionicons name={"log-out-outline"} size={24} color="#000000" />
                </View>
            </TouchableOpacity>
        </ProfileBlock>
    )
}