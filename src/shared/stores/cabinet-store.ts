import { CabinetInfoResponse } from "@/app/api/cabinets-service";
import { create } from "zustand";

interface CabinetStore {
  nearestCabinets: CabinetInfoResponse[];
  setNearestCabinets: (nearestCabinets: CabinetInfoResponse[]) => void;
}

export const useCabinetStore = create<CabinetStore>((set) => ({
  nearestCabinets: [],
  setNearestCabinets: (nearestCabinets: CabinetInfoResponse[]) => set({ nearestCabinets }),
}));