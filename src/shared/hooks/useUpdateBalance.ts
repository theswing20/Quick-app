import { useCallback, useEffect } from "react";
import { useWalletStore } from "../stores/wallet-store";
import { useWalletService } from "@/app/api/wallet-service";

export const useUpdateBalance = () => {
    const walletService = useWalletService();
    const setBalance = useWalletStore((state) => state.setBalance);


    const updateBalance = useCallback(async () => {
        try {
            const balance = await walletService.getBalance();
            setBalance(balance.balance);
        } catch (error) {
            console.error('Error updating balance', error);
        }
    }, [walletService, setBalance]);


    return updateBalance;
}   