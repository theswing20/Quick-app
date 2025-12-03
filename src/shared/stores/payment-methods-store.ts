import { PaymentMethod } from "@/app/api/payment-methods-service";
import { create } from "zustand";

interface PaymentMethodsStore {
    paymentMethods: PaymentMethod[];
    defaultPaymentMethod: PaymentMethod | null;
    setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
    selectedPaymentMethod: PaymentMethod | null;
    setSelectedPaymentMethod: (paymentMethodId: PaymentMethod | null) => void;
}

export const usePaymentMethodsStore = create<PaymentMethodsStore>((set) => ({
    paymentMethods: [],
    defaultPaymentMethod: null,
    setPaymentMethods: (paymentMethods) => {
        const defaultPaymentMethod = paymentMethods.find((method) => method.isDefault);
        set({ paymentMethods, defaultPaymentMethod })
    },
    selectedPaymentMethod: null,
    setSelectedPaymentMethod: (paymentMethodId) => set({ selectedPaymentMethod: paymentMethodId }),
}));