import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

interface DeviceStore {
    deviceId: string | null;
    setDeviceId: (deviceId: string | null) => void;
    clearDeviceId: () => void;
}

// Создаем адаптер для SecureStore, совместимый с zustand persist
const secureStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(name);
        } catch (error) {
            console.error("Error getting item from secure storage:", error);
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            await SecureStore.setItemAsync(name, value);
        } catch (error) {
            console.error("Error setting item in secure storage:", error);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(name);
        } catch (error) {
            console.error("Error removing item from secure storage:", error);
        }
    },
};

export const useDeviceStore = create<DeviceStore>()(
    persist(
        (set) => ({
            deviceId: null,
            setDeviceId: (deviceId: string | null) => set({ deviceId }),
            clearDeviceId: () => set({ deviceId: null }),
        }),
        {
            name: "device-storage",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);

