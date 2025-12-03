import { Rental } from "@/app/api/rentals-service";
import { create } from "zustand";



interface RentStore {
    rental: Rental | null;
    setRental: (rental: Rental) => void;
};

export const useRentStore = create<RentStore>((set) => ({
    rental: null,
    setRental: (rental: Rental) => set({ rental }),
}));