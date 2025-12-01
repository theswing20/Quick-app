import { useApi } from "./api";

export const useCabinetsService = () => {
    const api = useApi();
    return {
        getNearestCabinets: async (params: {
            latitude: number;
            longitude: number;
            radiusKm?: number;
        }) => {
            const response = await api.get('/cabinets/nearest', { params });
            return response.data;
        },
    };
}

