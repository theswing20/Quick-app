import { useDevicesService } from "@/app/api/devices-service";
import { useDeviceStore } from "@/shared/stores/device-store";
import * as Device from "expo-device";
import { useCallback } from "react";
import { Platform } from "react-native";
import registerForPushNotificationsAsync from "./registerForPushNotificationsAsync";

export const useDeviceRegistration = () => {
    const devicesService = useDevicesService();
    const { setDeviceId, deviceId } = useDeviceStore();

    const registerDevice = useCallback(async () => {
        try {
            // Получаем push токен
            const pushToken = await registerForPushNotificationsAsync();
            if (!pushToken) {
                console.error("Failed to get push token");
                return;
            }

            // Получаем тип устройства
            const deviceType = Platform.OS === "ios" ? "ios" : "android";

            // Получаем название устройства
            const deviceName = Device.deviceName || Device.modelName || `${deviceType} device`;

            // Регистрируем устройство на сервере
            const response = await devicesService.registerDevice({
                pushToken,
                deviceType,
                deviceName,
            });

            // Сохраняем deviceId локально
            setDeviceId(response.id);
        } catch (error) {
            console.error("Failed to register device:", error);
            throw error;
        }
    }, [devicesService, setDeviceId]);

    const unregisterDevice = useCallback(async () => {
        try {
            if (deviceId) {
                await devicesService.deleteDevice(deviceId);
                setDeviceId(null);
            }
        } catch (error) {
            console.error("Failed to unregister device:", error);
            // Очищаем deviceId даже если удаление не удалось
            setDeviceId(null);
        }
    }, [deviceId, devicesService, setDeviceId]);

    return {
        registerDevice,
        unregisterDevice,
        deviceId,
    };
};

