import { useMemo } from "react";
import { useApi } from "./api";

export interface WalletHistory {
    items: WalletHistoryItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface WalletHistoryItem {
    id: string;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
    rentalId: string;
}

export const useWalletService = () => {
    const api = useApi();
    const service = useMemo(() => ({
        getBalance: async () => {
            const response = await api.get('/wallet');
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

