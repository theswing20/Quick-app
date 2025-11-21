import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QRScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (permission && !permission.granted && !permission.canAskAgain) {
            Alert.alert(
                "Permission Required",
                "Camera permission is required to scan QR codes. Please enable it in your device settings.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        }
    }, [permission]);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);

        // Обработка отсканированного QR-кода
        console.log("Scanned QR code:", data);

        // Здесь можно добавить логику обработки данных
        // Например, проверка формата URL, обработка специальных кодов и т.д.

        Alert.alert(
            "QR Code Scanned",
            `Data: ${data}`,
            [
                {
                    text: "Scan Again",
                    onPress: () => setScanned(false),
                },
                {
                    text: "Close",
                    onPress: () => router.back(),
                },
            ]
        );
    };

    const handleClose = () => {
        router.back();
    };

    if (!permission) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="text-white">Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-black px-4">
                <Text className="text-white text-center mb-4 text-lg">
                    We need your permission to use the camera
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    className="bg-primary px-6 py-3 rounded-full"
                >
                    <Text className="text-[#101828] font-semibold">Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleClose}
                    className="mt-4"
                >
                    <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView
                style={{ flex: 1 }}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <SafeAreaView className="flex-1">
                    <View className="flex-1 items-center justify-center">
                        {/* Overlay frame */}
                        <View className="w-64 h-64 border-4 border-white rounded-2xl relative">
                            {/* Corner indicators */}
                            <View className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                            <View className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                            <View className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                            <View className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                        </View>

                        <Text className="text-white mt-8 text-center px-4 text-base">
                            Position the QR code within the frame
                        </Text>
                    </View>

                    {/* Close button */}
                    <View className="absolute top-6 right-0 p-4">
                        <TouchableOpacity
                            onPress={handleClose}
                            className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
                        >
                            <X size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

