import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
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

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="#F5D800" />

      {/* Желтый фон */}
      <View className="flex-1 bg-primary">
        {/* Большой логотип QUICK в углу */}
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
          <Text className="text-8xl font-black text-black opacity-10">
            QUICK
          </Text>
        </Animated.View>

        {/* Главный контент */}
        <View className="flex-1 justify-end items-center px-6 pb-20">
          {/* Powerbank иллюстрация */}
          <Animated.View style={powerbankAnimatedStyle} className="mb-12">
            <View className="relative">
              {/* Основной корпус powerbank */}
              <View className="w-32 h-48 bg-white rounded-3xl shadow-xl items-center justify-center border-2 border-gray-100">
                {/* LED индикаторы с анимацией */}
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

                {/* Логотип QUICK на powerbank */}
                <Text className="text-2xl font-black text-gray-800 mb-4">
                  QUICK
                </Text>

                {/* USB порты */}
                <View className="w-24 h-3 bg-gray-800 rounded-sm mb-2" />
                <View className="w-20 h-3 bg-gray-800 rounded-sm" />

                {/* Кнопка питания */}
                <View className="w-8 h-8 bg-gray-700 rounded-full mt-4 items-center justify-center">
                  <View className="w-4 h-4 border-2 border-white rounded-full" />
                </View>
              </View>

              {/* Кабель */}
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

              {/* Молния эффект с анимацией */}
              <Animated.View
                style={lightningAnimatedStyle}
                className="absolute -top-4 -right-4"
              >
                <Text className="text-4xl">⚡</Text>
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        {/* Нижняя секция с текстом и кнопкой */}
        <Animated.View
          style={[bottomSheetAnimatedStyle, { minHeight: height * 0.4 }]}
          className="bg-white rounded-t-3xl px-6 py-8"
        >
          {/* Заголовок */}
          <View className="mb-6">
            <Text className="text-3xl font-black text-gray-900 leading-tight">
              Быстрая зарядка.{"\n"}
              Для вас и вашего{"\n"}
              устройства ⚡
            </Text>
          </View>

          {/* Кнопка без анимации */}
          <Button size="lg" className="bg-primary mt-4">
            <Text>Поехали!</Text>
          </Button>

          {/* Мелкий текст */}

          <View className="mt-6">
            <Text className="text-xs text-gray-400 text-center leading-tight">
              Нажимая «Поехали», вы принимаете Договор присоединения, Политику
              конфиденциальности и подтверждаете, что вам исполнилось 18 лет
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
