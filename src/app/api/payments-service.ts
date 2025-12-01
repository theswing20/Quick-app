import { useApi } from "./api";

export const usePaymentsService = () => {
    const api = useApi();
    return {
        getPaymentsConfig: async () => {
            const response = await api.get('/payments/config');
            return response.data;
        },
        postPaymentTopUp: async (payload: {
            amount: number;
            description?: string | null;
            paymentMethodId?: string | null;
        }) => {
            const response = await api.post('/payments/top-up', payload);
            return response.data;
        },
    };
}