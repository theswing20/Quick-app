import { useMemo } from "react";
import { useApi } from "./api";

export const useCabinetsService = () => {
    const api = useApi();
    const service = useMemo(() => ({
        getNearestCabinets: async (params: {
            latitude: number;
            longitude: number;
            radiusKm?: number;
        }) => {
            const response = await api.get('/cabinets/nearest', { params });
            return response.data;
        },
        getCabinetInfo: async (qrCode: string) => {
            const response = await api.get<CabinetInfoResponse>(`/cabinets/qr/${qrCode}`);
            return response.data;
        },
    }), [api]);
    return service;
}

export interface CabinetInfoResponse {
    address: string | null;
    availableSlots: number;
    cabinetId: string;
    distanceKm: number | null;
    id: string;
    latitude: number;
    longitude: number;
    modelName: string;
    occupiedSlots: number;
    qrCode: string;
    status: string;
}