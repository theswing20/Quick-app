import { Button } from "@/shared/ui/button";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { ArrowDown, ArrowUp, QrCode, X, Zap } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MarkerDetails() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ["50%", "100%"], []);

  useEffect(() => {
    // Открываем bottom sheet при монтировании компонента
    bottomSheetRef.current?.present();
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.back();
  }, [router]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
        enableTouchThrough={false}
      />
    ),
    []
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View
        className="flex-1"
        style={{ backgroundColor: "transparent" }}
        pointerEvents="box-none"
      >
        {/* Bottom Sheet */}
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: "white" }}
          handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
          onDismiss={handleClose}
        >
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            {/* Заголовок с кнопкой закрытия */}
            <View className="flex-row items-center justify-between px-5 pt-5 pb-4">
              <View className="flex-row items-center gap-2">
                <QrCode size={20} color="#000000" />
                <Text className="text-base font-medium text-gray-900">
                  1-030-592 • Станция павербанков
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 items-center justify-center"
              >
                <X size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Название места */}
            <View className="px-5 pb-2">
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                Arena Cyber Club
              </Text>
              <Text className="text-base text-gray-600 mb-2">
                Компьютерный клуб
              </Text>
              <Text className="text-base text-gray-700 mb-2">
                Проспект Металлургов, 12/2
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-base text-gray-700">Открыто</Text>
              </View>
            </View>

            {/* Блоки доступности */}
            <View className="flex-row gap-3 px-5 py-4">
              <View className="flex-1 bg-gray-50 rounded-2xl p-4 items-center">
                <Text className="text-4xl font-bold text-gray-900 mb-2">7</Text>
                <View className="flex-row items-center gap-1 mb-1">
                  <ArrowDown size={20} color="#000000" />
                  <Text className="text-base font-medium text-gray-700">взять</Text>
                </View>
              </View>
              <View className="flex-1 bg-gray-50 rounded-2xl p-4 items-center">
                <Text className="text-4xl font-bold text-gray-900 mb-2">1</Text>
                <View className="flex-row items-center gap-1 mb-1">
                  <ArrowUp size={20} color="#000000" />
                  <Text className="text-base font-medium text-gray-700">сдать</Text>
                </View>
              </View>
            </View>

            {/* Конкретное место */}
            <View className="px-5 pb-4">
              <Text className="text-base text-gray-600">Барная стойка</Text>
            </View>

            {/* Таблица цен */}
            <View className="px-5 pb-4">
              <View className="bg-gray-50 rounded-2xl p-4">
                <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
                  <Text className="text-base font-medium text-gray-900">
                    1 Первый час
                  </Text>
                  <Text className="text-base font-semibold text-gray-900">
                    449 〒
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
                  <Text className="text-base font-medium text-gray-900">
                    2 Оставшиеся 23 часа
                  </Text>
                  <Text className="text-base font-semibold text-gray-900">
                    749 〒
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-3">
                  <Text className="text-base font-medium text-gray-900">
                    3 Следующие сутки
                  </Text>
                  <Text className="text-base font-semibold text-gray-900">
                    1198 〒
                  </Text>
                </View>
              </View>
            </View>

            {/* Как это работает */}
            <View className="px-5 pb-4">
              <Text className="text-lg font-semibold text-gray-900 mb-4">
                Как это работает?
              </Text>

              <View className="flex-row items-start gap-3 mb-4">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <QrCode size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    Вы сканируете QR-код станции и берете павербанк
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mt-1">
                  <Zap size={20} color="#000000" />
                </View>
                <View className="flex-1">
                  <Text className="text-base text-gray-700 leading-6">
                    Заряжаетесь — кабели встроены. Есть Type-C, micro-USB и Lightning для iPhone
                  </Text>
                </View>
              </View>
            </View>

            {/* Кнопка действия */}
            <View className="px-5 pb-4">
              <Button
                className="w-full h-14 rounded-2xl bg-blue-600"
                onPress={() => {
                  console.log("Take via QR pressed");
                }}
              >
                <Text className="text-lg font-semibold text-white">
                  Взять через QR
                </Text>
              </Button>
            </View>

            {/* Ссылка на карту */}
            <View className="px-5 pb-6">
              <TouchableOpacity onPress={() => console.log("Find on map")}>
                <Text className="text-sm text-gray-500 text-center">
                  — можно найти на карте
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </View>
    </>
  );
}
