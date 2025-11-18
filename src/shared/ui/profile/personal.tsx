import { Text } from "react-native";
import { ProfileAvatar } from "./avatar";
import { ProfileName } from "./name";
import { ProfilePhoneNumber } from "./phone-number";
import { ScreenSection } from "../screen-section";
import { ProfileEmail } from "./email";
import { useUser } from "@clerk/clerk-expo";

export const ProfilePersonal = () => {
    const { user } = useUser();
    return (<ScreenSection roundedTop={false}>
        <ProfileAvatar />
        <Text className="text-xl font-medium mb-4">Personal information</Text>
        <ProfilePhoneNumber phoneNumber={user?.phoneNumbers?.[0]?.phoneNumber ?? ""} />
        <ProfileName name={user?.fullName ?? ""} />
        <ProfileEmail email={user?.emailAddresses[0].emailAddress ?? ""} />
    </ScreenSection>)
};