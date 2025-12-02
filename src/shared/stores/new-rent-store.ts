import { create } from "zustand";

interface NewRentStore {
    paymentMethodId: string | null;
    cabinetQRCode: string | null;
    setPaymentMethodId: (paymentMethodId: string | null) => void;
    setCabinetQRCode: (cabinetQRCode: string | null) => void;
    reset: () => void;
}

export const useNewRentStore = create<NewRentStore>((set) => ({
    paymentMethodId: null,
    cabinetQRCode: null,
    setPaymentMethodId: (paymentMethodId) => set({ paymentMethodId }),
    setCabinetQRCode: (cabinetQRCode) => set({ cabinetQRCode }),
    reset: () => set({ paymentMethodId: null, cabinetQRCode: null }),
}));