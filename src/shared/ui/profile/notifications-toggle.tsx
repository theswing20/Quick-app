import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { ScreenSection } from "../screen-section";

export const ProfileNotificationsToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <ScreenSection>
            <View className="flex-row items-between">
                <Text className="text-xl font-medium flex-1">Notifications</Text>
                <View className="flex-shrink-1">
                    <Switch value={isEnabled} onValueChange={toggleSwitch} />
                </View>
            </View>
        </ScreenSection>
    )
}   