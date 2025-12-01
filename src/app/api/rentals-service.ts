import { useMemo } from "react";
import { useApi } from "./api";

export const useRentalsService = () => {
    const api = useApi();
    const service = useMemo(() => ({
        getActiveRental: async () => {
            const response = await api.get('/rentals/active');
            return response.data;
        },
        getRentalById: async (id: string) => {
            const response = await api.get(`/rentals/${id}`);
            return response.data;
        },
        getRentalHistory: async (params?: {
            pageNumber?: number;
            pageSize?: number;
        }) => {
            const response = await api.get('/rentals/history', { params });
            return response.data;
        },
        startRental: async (payload: {
            cabinetQRCode: string;
            paymentMethodId?: string | null;
        }) => {
            const response = await api.post('/rentals/start', payload);
            return response.data;
        },
        endRental: async (id: string) => {
            const response = await api.post(`/rentals/${id}/end`);
            return response.data;
        },
        extendRental: async (id: string) => {
            const response = await api.post(`/rentals/${id}/extend`);
            return response.data;
        },
    }), [api]);
    return service;
}

