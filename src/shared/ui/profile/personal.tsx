import { ProfileAvatar, ProfileName, ProfilePhoneNumber } from ".";
import { ProfileEmail } from "./email";
import { ProfileBlock } from "./profile-block";
import { Text } from "react-native";

export const ProfilePersonal = () => {
    return (<ProfileBlock roundedTop={false}>
        <ProfileAvatar />
        <Text className="text-xl font-medium mb-4">Personal information</Text>
        <ProfilePhoneNumber phoneNumber="1234567890" />
        <ProfileName name="John Doe" />
        <ProfileEmail email="john.doe@example.com" />
    </ProfileBlock>)
};