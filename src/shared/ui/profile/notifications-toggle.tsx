import { View, Text, Switch } from "react-native"
import { ProfileBlock } from "./profile-block"
import { useState } from "react";

export const ProfileNotificationsToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <ProfileBlock>
            <View className="flex-row items-between">
                <Text className="text-xl font-medium flex-1">Notifications</Text>
                <View className="flex-shrink-1">
                    <Switch value={isEnabled} onValueChange={toggleSwitch} />
                </View>
            </View>
        </ProfileBlock>
    )
}   