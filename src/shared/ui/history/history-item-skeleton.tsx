import { Card, CardContent } from "@/shared/ui/card";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

export function HistorySectionHeaderSkeleton() {
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
        <View className="px-4 py-3 bg-white">
            <Animated.View
                style={shimmerStyle}
                className="h-4 w-20 bg-gray-200 rounded-md"
            />
        </View>
    );
}

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
        <View className="mb-3">
            <Card variant="elevated" className="mx-1">
                <CardContent>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            {/* Icon skeleton */}
                            <Animated.View
                                style={shimmerStyle}
                                className="w-6 h-6 mr-4 bg-gray-200 rounded"
                            />

                            {/* Date and Identifier skeleton */}
                            <View className="flex-1">
                                <Animated.View
                                    style={shimmerStyle}
                                    className="h-4 bg-gray-200 rounded-md mb-1 w-32"
                                />
                                <View className="flex-row items-center gap-2">
                                    <Animated.View
                                        style={shimmerStyle}
                                        className="h-3 bg-gray-200 rounded-md w-24"
                                    />
                                    <Animated.View
                                        style={shimmerStyle}
                                        className="w-3 h-3 bg-gray-200 rounded"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Amount skeleton */}
                        <Animated.View
                            style={shimmerStyle}
                            className="h-4 w-16 bg-gray-200 rounded-md ml-4"
                        />
                    </View>
                </CardContent>
            </Card>
        </View>
    );
}
