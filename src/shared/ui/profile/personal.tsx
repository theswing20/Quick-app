import { Text } from "react-native";
import { ProfileAvatar } from "./avatar";
import { ProfileName } from "./name";
import { ProfilePhoneNumber } from "./phone-number";
import { ScreenSection } from "../screen-section";
import { ProfileEmail } from "./email";

export const ProfilePersonal = () => {
    return (<ScreenSection roundedTop={false}>
        <ProfileAvatar />
        <Text className="text-xl font-medium mb-4">Personal information</Text>
        <ProfilePhoneNumber phoneNumber="1234567890" />
        <ProfileName name="John Doe" />
        <ProfileEmail email="john.doe@example.com" />
    </ScreenSection>)
};