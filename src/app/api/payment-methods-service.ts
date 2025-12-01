import { useApi } from "./api";

export const usePaymentMethodsService = () => {
    const api = useApi();
    return {
        getAllPaymentMethods: async () => {
            const response = await api.get('/payment-methods/all');
            return response.data;
        },
        getCards: async () => {
            const response = await api.get('/payment-methods/cards');
            return response.data;
        },
        setupPaymentMethod: async () => {
            const response = await api.post('/payment-methods/setup');
            return response.data;
        },
        confirmPaymentMethod: async (payload: {
            paymentIntentId: string;
            paymentMethodId?: string | null;
        }) => {
            const response = await api.post('/payment-methods/confirm', payload);
            return response.data;
        },
        setDefaultPaymentMethod: async (payload: {
            paymentMethodId?: string | null;
        }) => {
            const response = await api.post('/payment-methods/set-default', payload);
            return response.data;
        },
        deletePaymentMethod: async (id: string) => {
            const response = await api.delete(`/payment-methods/${id}`);
            return response.data;
        },
    };
}