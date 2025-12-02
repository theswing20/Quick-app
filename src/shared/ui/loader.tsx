import { Loader2 } from 'lucide-react-native';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { THEME } from '@/shared/lib/theme';
import { View } from 'react-native';

export const Loader = () => {

    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1,
            false,
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return <Animated.View style={animatedStyle} className={"w-20 h-20 border-primary border-t-primary-foreground border-[8px] rounded-full"} />
}

export const LoaderLucide = ({size = 24, color = THEME.light.foreground}) => {

    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return <View className="bg-primary p-4 rounded-full"><Animated.View style={animatedStyle}>
        <Loader2 size={size} color={color} />
    </Animated.View>
    </View>
}