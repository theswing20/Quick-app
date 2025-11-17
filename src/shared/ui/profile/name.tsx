import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import {View, Text, TouchableOpacity} from "react-native";

export const ProfileName = ({ name }: { name: string }) => {
    const router = useRouter();
    return (
        <TouchableOpacity className="w-full flex-row items-center justify-between border-solid border-[1px] border-gray-50 rounded-md p-4 bg-gray-50 mb-2">
            <View className="flex-col items-start justify-between">
            <Text className="text-base font-bold">Name</Text>
            <Text className="text-base text-start">{name}</Text>
            </View>
            <View className="w-10 h-10 flex items-center justify-center rounded-full">
                <ChevronRight size={24} color="#000000" />
            </View>
        </TouchableOpacity>
    )
}