import { cn } from "@/shared/lib/utils";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
    children: React.ReactNode;
    variant?: "default" | "elevated" | "outlined";
    className?: string;
}

export function Card({ children, variant = "default", className, ...props }: CardProps) {
    const baseStyles = "bg-white rounded-2xl";
    
    const variantStyles = {
        default: "bg-white",
        elevated: "bg-white shadow-sm",
        outlined: "bg-white border border-gray-200",
    };

    const shadowStyle = variant === "elevated" ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    } : {};

    return (
        <View
            className={cn(baseStyles, variantStyles[variant], className)}
            style={[shadowStyle, props.style]}
            {...props}
        >
            {children}
        </View>
    );
}

interface CardContentProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
    return (
        <View className={cn("p-4", className)} {...props}>
            {children}
        </View>
    );
}

interface CardRowProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
    withBorder?: boolean;
}

export function CardRow({ children, className, withBorder = false, ...props }: CardRowProps) {
    return (
        <View
            className={cn(
                "flex-row justify-between items-center py-3",
                withBorder && "border-b border-gray-200",
                className
            )}
            {...props}
        >
            {children}
        </View>
    );
}

