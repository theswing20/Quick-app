import { useMemo } from "react";
import { useApi } from "./api";

export const useWalletService = () => {
    const api = useApi();
    const service = useMemo(() => ({
        getBalance: async () => {
            const response = await api.get('/wallet/balance');
            return response.data;
        },
        getHistory: async (params?: {
            pageNumber?: number;
            pageSize?: number;
            direction?: 'All' | 'Credit' | 'Debit';
        }) => {
            const response = await api.get('/wallet/history', { params });
            return response.data;
        },
    }), [api]);
    return service;
}

