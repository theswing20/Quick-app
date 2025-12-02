import { create } from "zustand";

interface PaymentMethod {
    balance: number | null;
    brand: string | null;
    cardholderName: string | null;
    createdAt: string;
    currency: string | null;
    displayName: string;
    expMonth: string | null;
    expYear: string | null;
    id: string | null;
    isDefault: boolean;
    last4: string;
    lastUsedAt: string | null;
    type: string;
}

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