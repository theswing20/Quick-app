import { useUser } from "@clerk/clerk-expo";
import { Text } from "react-native";
import { ScreenSection } from "../screen-section";
import { ProfileAvatar } from "./avatar";
import { ProfileEmail } from "./email";
import { ProfileName } from "./name";
import { ProfilePhoneNumber } from "./phone-number";

export const ProfilePersonal = () => {
    const { user } = useUser();
    return (<ScreenSection roundedTop={false}>
        <ProfileAvatar />
        <Text className="text-xl font-medium mb-4 text-gray-900">Personal information</Text>
        <ProfilePhoneNumber phoneNumber={user?.phoneNumbers?.[0]?.phoneNumber ?? ""} />
        <ProfileName name={user?.fullName ?? ""} />
        {/* <ProfileEmail email={user?.emailAddresses[0].emailAddress ?? ""} /> */}
    </ScreenSection>)
};