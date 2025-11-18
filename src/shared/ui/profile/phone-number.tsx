import { View, Text } from "react-native"

export const ProfilePhoneNumber = ({ phoneNumber }: { phoneNumber: string }) => {
    return (
        <View className="w-col flex-col items-start justify-between border-solid border-[1px] border-gray-100 rounded-md p-4 mb-2">
            <Text className="text-base font-bold">Phone number</Text>
            <Text className=" text-base text-start">{phoneNumber}</Text>
        </View>
    )
}