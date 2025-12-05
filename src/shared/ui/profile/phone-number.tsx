import { Text, View } from "react-native"

export const ProfilePhoneNumber = ({ phoneNumber }: { phoneNumber: string }) => {
    return (
        <View className="w-full flex-col items-start justify-between border border-gray-200 rounded-2xl p-4 mb-3 bg-gray-50">
            <Text className="text-sm font-medium text-gray-500 mb-1">Phone number</Text>
            <Text className="text-base font-medium text-gray-900 text-start">{phoneNumber}</Text>
        </View>
    )
}