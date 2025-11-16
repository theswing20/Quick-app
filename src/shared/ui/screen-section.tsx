import { cn } from "@/shared/lib/utils"
import { View } from "react-native"

export const ScreenSection = ({ children , roundedBottom = true, roundedTop = true, className = "" }: { children: React.ReactNode, roundedBottom?: boolean, roundedTop?: boolean, className?: string }) => {
    return (
        <View className={cn("px-4 py-4 bg-white", roundedBottom && "rounded-b-3xl  mb-2", roundedTop && "rounded-t-3xl", className)}>
            {children}
        </View>
    )
}