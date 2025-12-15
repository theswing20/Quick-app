import { useAuth } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { ReactNode, useEffect, useState } from "react";
import { usePaymentsService } from "../api/payments-service";

function StripeProviderWrapper({ children }: { children: ReactNode }) {
    const { isSignedIn } = useAuth();
    const paymentsService = usePaymentsService();
    const [publishableKey, setPublishableKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isSignedIn) {
            setIsLoading(false);
            return;
        }

        const fetchPublishableKey = async () => {
            try {
                const config = await paymentsService.getPaymentsConfig();
                
                if (config?.publishableKey && typeof config.publishableKey === 'string' && config.publishableKey.trim().length > 0) {
                    setPublishableKey(config.publishableKey);
                } else {
                    console.warn("Invalid or missing publishableKey in config");
                }
            } catch (error) {
                console.error("Failed to fetch Stripe publishable key:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublishableKey();
    }, [isSignedIn, paymentsService]);

    // Рендерим StripeProvider только если есть валидный publishableKey
    const hasValidKey = publishableKey && publishableKey.trim().length > 0;

    if (!isSignedIn || !hasValidKey || !publishableKey) {
        // Если пользователь не авторизован или ключ не загружен, просто возвращаем children
        return children as React.ReactElement;
    }

    return (
        <StripeProvider publishableKey={publishableKey}>
            {children as React.ReactElement}
        </StripeProvider>
    );
}

export default StripeProviderWrapper;

