import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

export default function HistoryItemSkeleton() {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, {
                duration: 1500,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => {
        return {
            opacity: 0.3 + shimmer.value * 0.4,
        };
    });

    return (
        <View className="flex-row gap-4 my-2 justify-center items-center p-4 shadow-sm rounded-2xl bg-white">
            {/* Icon skeleton */}
            <Animated.View
                style={shimmerStyle}
                className="w-10 h-10 rounded-full bg-gray-200"
            />

            {/* Text content skeleton */}
            <View className="flex-col flex-1 gap-1">
                <Animated.View
                    style={shimmerStyle}
                    className="h-4 bg-gray-200 rounded-md"
                />
                <Animated.View
                    style={shimmerStyle}
                    className="h-3 bg-gray-200 rounded-md w-3/4"
                />
            </View>

            {/* Amount skeleton */}
            <Animated.View
                style={shimmerStyle}
                className="h-4 w-16 bg-gray-200 rounded-md"
            />
        </View>
    );
}
