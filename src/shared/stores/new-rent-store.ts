import { CabinetInfoResponse } from "@/app/api/cabinets-service";
import { create } from "zustand";

interface NewRentStore {
    paymentMethodId: string | null;
    cabinetInfo: CabinetInfoResponse | null;
    setPaymentMethodId: (paymentMethodId: string | null) => void;
    setCabinetInfo: (cabinetInfo: CabinetInfoResponse | null) => void;
    reset: () => void;
}

export const useNewRentStore = create<NewRentStore>((set) => ({
    paymentMethodId: null,
    cabinetInfo: null,
    setPaymentMethodId: (paymentMethodId) => set({ paymentMethodId }),
    setCabinetInfo: (cabinetInfo) => set({ cabinetInfo }),
    reset: () => set({ paymentMethodId: null, cabinetInfo: null }),
}));