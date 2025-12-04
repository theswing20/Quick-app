import { useDeviceRegistration } from "@/features/notifications/use-device-registration";
import { useDeviceStore } from "@/shared/stores/device-store";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { ScreenSection } from "../screen-section";

export const ProfileNotificationsToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { deviceId } = useDeviceStore();
    const { registerDevice, unregisterDevice } = useDeviceRegistration();

    // Проверяем статус уведомлений при монтировании компонента
    useEffect(() => {
        const checkNotificationStatus = async () => {
            try {
                const { status } = await Notifications.getPermissionsAsync();
                // Уведомления включены, если есть разрешения И зарегистрировано устройство
                const hasPermissions = status === "granted";
                setIsEnabled(hasPermissions && !!deviceId);
            } catch (error) {
                console.error("Error checking notification status:", error);
            }
        };

        checkNotificationStatus();
    }, [deviceId]);

    const toggleSwitch = async (value: boolean) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (value) {
                // Включаем уведомления
                const { status: existingStatus } = await Notifications.getPermissionsAsync();

                if (existingStatus !== "granted") {
                    // Запрашиваем разрешения
                    const { status } = await Notifications.requestPermissionsAsync();

                    if (status !== "granted") {
                        Alert.alert(
                            "Permission Required",
                            "Please enable notifications in your device settings to receive push notifications.",
                            [{ text: "OK" }]
                        );
                        setIsEnabled(false);
                        setIsLoading(false);
                        return;
                    }
                }

                // Регистрируем устройство, если еще не зарегистрировано
                if (!deviceId) {
                    await registerDevice();
                }

                setIsEnabled(true);
            } else {
                // Выключаем уведомления - удаляем устройство
                if (deviceId) {
                    await unregisterDevice();
                }
                setIsEnabled(false);
            }
        } catch (error) {
            console.error("Error toggling notifications:", error);
            Alert.alert(
                "Error",
                "Failed to update notification settings. Please try again.",
                [{ text: "OK" }]
            );
            // Откатываем состояние
            setIsEnabled(!value);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenSection>
            <View className="flex-row items-center justify-between">
                <Text className="text-xl font-medium flex-1">Notifications</Text>
                <View className="flex-shrink-0">
                    <Switch
                        value={isEnabled}
                        onValueChange={toggleSwitch}
                        disabled={isLoading}
                    />
                </View>
            </View>
        </ScreenSection>
    );
};   