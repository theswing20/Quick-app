import { Image } from "expo-image";
import { Text, View } from "react-native";
import { cn } from "@/shared/lib/utils";

interface CurrencyAmountProps {
    amount: number | string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    variant?: "default" | "bold";
    className?: string;
    showIcon?: boolean;
}

const sizeConfig = {
    sm: {
        text: "text-sm",
        icon: 12,
    },
    md: {
        text: "text-base",
        icon: 14,
    },
    lg: {
        text: "text-lg",
        icon: 16,
    },
    xl: {
        text: "text-xl",
        icon: 18,
    },
    '2xl': {
        text: "text-2xl",
        icon: 20,
    },
    '3xl': {
        text: "text-3xl",
        icon: 24,
    },
};

export function CurrencyAmount({
    amount,
    size = "md",
    variant = "default",
    className,
    showIcon = true,
}: CurrencyAmountProps) {
    const config = sizeConfig[size];
    const fontWeight = variant === "bold" ? "font-bold" : "font-medium";

    // For inline usage, return Text component
    if (className?.includes("inline")) {
        return (
            <>
                {showIcon && (
                    <Image
                        source={require('@/shared/assets/images/dirham-icon.png')}
                        style={{ width: config.icon, height: config.icon, marginLeft: 4 }}
                        contentFit="contain"
                    />
                )}
                <Text className={cn(config.text, fontWeight, "text-gray-900")}>
                    {amount}
                </Text>

            </>
        );
    }

    return (
        <View className={cn("flex-row items-center", className)}>
            {showIcon && (
                <Image
                    source={require('@/shared/assets/images/dirham-icon.png')}
                    style={{ width: config.icon, height: config.icon, marginLeft: 4 }}
                    contentFit="contain"
                />
            )}
            <Text className={cn(config.text, fontWeight, "text-gray-900")}>
              &nbsp;{amount}
            </Text>

        </View>
    );
}

