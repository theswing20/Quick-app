import { SignOutButton } from "@/features/auth/login";
import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { useEffect } from "react";
import { Dimensions, StatusBar, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

export default function Index() {
  // Анимации для появления элементов
  const logoOpacity = useSharedValue(0);
  // Убираем logoScale - не нужен

  const powerbankOpacity = useSharedValue(0);
  // Убираем powerbankTranslateY и powerbankRotate - не нужны

  const lightningOpacity = useSharedValue(0);
  // Убираем lightningScale - не нужен

  const bottomSheetTranslateY = useSharedValue(height);

  // const buttonScale = useSharedValue(0); // Убрали анимацию кнопки

  // Анимации для LED индикаторов
  const led1Opacity = useSharedValue(0.3);
  const led2Opacity = useSharedValue(0.3);
  const led3Opacity = useSharedValue(0.3);
  const led4Opacity = useSharedValue(0.3);

  useEffect(() => {
    // Последовательность анимаций при загрузке

    // 1. Логотип просто появляется
    logoOpacity.value = withTiming(1, { duration: 600 });
    // Убираем масштабирование - logoScale остается 1

    // 2. Powerbank просто появляется
    powerbankOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    // Убираем движение и поворот - элементы остаются на месте

    // 3. Молния просто появляется
    lightningOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));

    // 4. Нижняя панель плавно выезжает снизу
    bottomSheetTranslateY.value = withSpring(0, {
      damping: 20,
      stiffness: 90,
      mass: 1,
    });

    // 5. Кнопка статичная (без анимации)
    // buttonScale.value = withDelay(1600, withSpring(1, { damping: 12 }));

    // LED индикаторы мигают по очереди
    setTimeout(() => {
      const animateLeds = () => {
        led1Opacity.value = withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        );
        led2Opacity.value = withDelay(
          150,
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.3, { duration: 300 })
          )
        );
        led3Opacity.value = withDelay(
          300,
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.3, { duration: 300 })
          )
        );
        led4Opacity.value = withDelay(
          450,
          withSequence(
            withTiming(1, { duration: 300 }),
            withTiming(0.3, { duration: 300 })
          )
        );
      };

      // Повторяем анимацию LED каждые 3 секунды
      animateLeds();
      const interval = setInterval(animateLeds, 3000);

      return () => clearInterval(interval);
    }, 2000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Анимированные стили
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const powerbankAnimatedStyle = useAnimatedStyle(() => ({
    opacity: powerbankOpacity.value,
  }));

  const lightningAnimatedStyle = useAnimatedStyle(() => ({
    opacity: lightningOpacity.value,
  }));

  const bottomSheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomSheetTranslateY.value }],
  }));

  // const buttonAnimatedStyle = useAnimatedStyle(() => ({
  //   transform: [{ scale: buttonScale.value }],
  // })); // Убрали анимированный стиль кнопки

  const led1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: led1Opacity.value,
  }));

  const led2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: led2Opacity.value,
  }));

  const led3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: led3Opacity.value,
  }));

  const led4AnimatedStyle = useAnimatedStyle(() => ({
    opacity: led4Opacity.value,
  }));

  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    const hasPhoneNumber = (user?.phoneNumbers?.length ?? 0) > 0;

    if (!hasPhoneNumber) {
      return <Redirect href="/phone-verification" />;
    }

    return <Redirect href="/(app)/home" />;
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="#F5D800" />

      {/* Yellow background */}
      <View className="flex-1 bg-primary">
        {/* Large QUICK logo */}
        <Animated.View
          style={[
            logoAnimatedStyle,
            {
              position: "absolute",
              top: 60, // top-12 = 48px
              left: 0,
              right: 0,
              alignItems: "center",
              zIndex: 10,
            },
          ]}
        >
          <Text className="font-black text-black text-8xl opacity-10">
            QUICK
          </Text>
        </Animated.View>

        {/* Main content */}
        <View className="items-center justify-end flex-1 px-6 pb-20">
          {/* Powerbank illustration */}
          <Animated.View style={powerbankAnimatedStyle} className="mb-12">
            <View className="relative">
              {/* Main powerbank body */}
              <View className="items-center justify-center w-32 h-48 bg-white border-2 border-gray-100 shadow-xl rounded-3xl">
                {/* LED indicators with animation */}
                <View className="flex-row mb-4" style={{ gap: 8 }}>
                  <Animated.View
                    style={led1AnimatedStyle}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <Animated.View
                    style={led2AnimatedStyle}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <Animated.View
                    style={led3AnimatedStyle}
                    className="w-3 h-3 bg-green-500 rounded-full"
                  />
                  <Animated.View
                    style={led4AnimatedStyle}
                    className="w-3 h-3 bg-gray-300 rounded-full"
                  />
                </View>

                {/* QUICK logo on powerbank */}
                <Text className="mb-4 text-2xl font-black text-gray-800">
                  QUICK
                </Text>

                {/* USB ports */}
                <View className="w-24 h-3 mb-2 bg-gray-800 rounded-sm" />
                <View className="w-20 h-3 bg-gray-800 rounded-sm" />

                {/* Power button */}
                <View className="items-center justify-center w-8 h-8 mt-4 bg-gray-700 rounded-full">
                  <View className="w-4 h-4 border-2 border-white rounded-full" />
                </View>
              </View>

              {/* Cable */}
              <View
                className="absolute -bottom-8 left-1/2"
                style={{ transform: [{ translateX: -2 }] }}
              >
                <View className="w-1 h-12 bg-gray-600 rounded-full" />
                <View
                  className="w-6 h-3 bg-gray-700 rounded-sm"
                  style={{ marginTop: -4, marginLeft: -10 }}
                />
              </View>

              {/* Lightning effect with animation */}
              <Animated.View
                style={lightningAnimatedStyle}
                className="absolute -top-4 -right-4"
              >
                <Text className="text-4xl">⚡</Text>
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        {/* Bottom section with text and button */}
        <Animated.View
          style={[bottomSheetAnimatedStyle, { minHeight: height * 0.4 }]}
          className="px-6 py-8 bg-white rounded-t-3xl"
        >
          {/* Title */}
          <View className="mb-6">
            <Text className="text-3xl font-black leading-tight text-gray-900">
              Fast charging.{"\n"}
              For you and your{"\n"}
              device ⚡
            </Text>
          </View>
          {/* Button */}
          <Link href="/(auth)/sign-in" asChild>
            <Button size="lg" className="mt-4 bg-primary">
              <Text>Let&apos;s go!</Text>
            </Button>
          </Link>
          <SignOutButton />
          {/* Legal text */}
          <View className="mt-6">
            <Text className="text-xs leading-tight text-center text-gray-400">
              By tapping &ldquo;Let&apos;s go!&rdquo;, you accept Terms of
              Service, Privacy Policy and confirm that you are 18 years old
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
