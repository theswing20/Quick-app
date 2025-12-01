import { StripeProvider } from "@stripe/stripe-react-native";
import { ReactElement, ReactNode } from "react";

function StripeProviderWrapper({ children }: { children: ReactNode }) {
    const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    // Ensure publishableKey is a non-empty string to prevent nil values in native code
    if (!publishableKey || typeof publishableKey !== "string" || publishableKey.trim() === "") {
        // В режиме разработки можно использовать тестовый ключ
        console.warn("Missing Stripe publishable key. Stripe features will not work.");
        return <>{children}</>;
    }

    return (
        <StripeProvider publishableKey={publishableKey}>
            {children as ReactElement}
        </StripeProvider>
    );
}

export default StripeProviderWrapper;

