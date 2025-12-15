import { BurgerMenuButton } from "@/shared/ui/burger-menu-button";
import { ProfileButton } from "@/shared/ui/profile-button";
import { useRouter } from "expo-router";
import { Clock, CreditCard, WalletMinimal } from "lucide-react-native";
import { useRef } from "react";
import { Animated, PanResponder, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const router = useRouter();
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Начинаем обрабатывать, если движение вниз и есть заметный сдвиг
        return gestureState.dy > 5;
      },
      onPanResponderMove: Animated.event(
        [null, { dy: translateY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose = gestureState.dy > 80; // порог для закрытия

        if (shouldClose) {
          Animated.timing(translateY, {
            toValue: 300,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            router.dismiss(1);
          });
        } else {
          // Возвращаем панель обратно
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const menuItems = [
    {
      id: "wallet",
      title: "Wallet",
      icon: WalletMinimal,
      onPress: () => {
        router.dismiss(1);
        setTimeout(() => {
          router.push("/(app)/(wallet)/wallet");
        }, 100);
      },
    },
    {
      id: "history",
      title: "History",
      icon: Clock,
      onPress: () => {
        router.dismiss(1);
        setTimeout(() => {
          router.push("/(app)/(history)/history");
        }, 100);
      },
    },
    {
      id: "payment",
      title: "Payment Method",
      icon: CreditCard,
      onPress: () => {
        router.dismiss(1);
        setTimeout(() => {
          router.push("/(app)/(wallet)/payment-methods");
        }, 100);
      },
    },
  ];

  return (
    <View className="flex-1">
      <View className="absolute bottom-0 bg-gray-50 flex-1 w-full h-[100px]"></View>
    <SafeAreaView className="flex-1 justify-end">
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
        {...panResponder.panHandlers}
        className="bg-gray-50 px-5 pt-8 pb-10 rounded-t-3xl flex-col"
      >
        <View className="flex-row flex-wrap gap-4 w-full justify-between">
          <ProfileButton />
          {menuItems.map((item) => (
            <BurgerMenuButton item={item} key={item.id} />
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
    </View>
  );
}