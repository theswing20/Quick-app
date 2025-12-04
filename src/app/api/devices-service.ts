import { useMemo } from "react";
import { useApi } from "./api";

export interface RegisterDeviceRequest {
    pushToken: string;
    deviceType: "ios" | "android";
    deviceName: string;
}

export interface RegisterDeviceResponse {
    deviceId: string;
}

export const useDevicesService = () => {
    const api = useApi();
    const service = useMemo(() => ({
        registerDevice: async (payload: RegisterDeviceRequest) => {
            const response = await api.post<RegisterDeviceResponse>('/users/devices', payload);
            return response.data;
        },
        deleteDevice: async (deviceId: string) => {
            await api.delete(`/users/devices/${deviceId}`);
        },
    }), [api]);
    return service;
};

