import { PaymentMethod } from "@/app/api/payment-methods-service";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

interface PaymentMethodsStore {
    paymentMethods: PaymentMethod[];
    defaultPaymentMethod: PaymentMethod | null;
    setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
    selectedPaymentMethod: PaymentMethod | null;
    setSelectedPaymentMethod: (paymentMethodId: PaymentMethod | null) => void;
    isPaymentMethodNotificationShown: boolean;
    setIsPaymentMethodNotificationShown: (isPaymentMethodNotificationShown: boolean) => void;
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

export const usePaymentMethodsStore = create<PaymentMethodsStore>()(
    persist(
        (set) => ({
            paymentMethods: [],
            defaultPaymentMethod: null,
            setPaymentMethods: (paymentMethods) => {
                const defaultPaymentMethod = paymentMethods.find((method) => method.isDefault);
                set({ paymentMethods, defaultPaymentMethod });
            },
            selectedPaymentMethod: null,
            setSelectedPaymentMethod: (paymentMethodId) => set({ selectedPaymentMethod: paymentMethodId }),
            isPaymentMethodNotificationShown: false,
            setIsPaymentMethodNotificationShown: (isPaymentMethodNotificationShown) => set({ isPaymentMethodNotificationShown }),
        }),
        {
            name: "payment-methods-storage",
            storage: createJSONStorage(() => secureStorage),
        }
    )
);