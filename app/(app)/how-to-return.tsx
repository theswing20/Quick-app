import { Button } from "@/shared/ui/button";
import { router } from "expo-router";
import { Clock, Home, X, Zap } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HowToReturn() {
    const handleClose = () => {
        router.back();
    };

    const handleAllClear = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                className="flex-1"
            >
                {/* Draggable handle */}
                <View className="w-full items-center pt-2 pb-4">
                    <View className="w-12 h-1 bg-gray-300 rounded-full" />
                </View>

                {/* Header with close button */}
                <View className="flex-row items-center justify-between px-6 pb-6">
                    <View className="flex-1" />
                    <View className="flex-1 items-end">
                        <TouchableOpacity
                            onPress={handleClose}
                            className="w-8 h-8 items-center justify-center rounded-full"
                        >
                            <X size={24} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Title */}
                <View className="px-6 pb-6">
                    <Text className="text-2xl font-bold text-gray-900">
                        How to return?
                    </Text>
                </View>

                {/* Instructions */}
                <View className="px-6 pb-6">
                    {/* Instruction 1 */}
                    <View className="flex-row items-start gap-3 mb-6">
                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mt-1">
                            <Zap size={20} color="#000000" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base text-gray-700 leading-6">
                                Find any station on the map, they are marked with corresponding icons
                            </Text>
                        </View>
                    </View>

                    {/* Instruction 2 */}
                    <View className="flex-row items-start gap-3 mb-6">
                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mt-1">
                            <Clock size={20} color="#000000" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base text-gray-700 leading-6">
                                Make sure the station is working and has free slots
                            </Text>
                        </View>
                    </View>

                    {/* Instruction 3 */}
                    <View className="flex-row items-start gap-3 mb-8">
                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mt-1">
                            <Home size={20} color="#000000" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base text-gray-700 leading-6">
                                Insert the power bank into one of the station's free slots
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
                <View className="gap-3">
                    <Button
                        className="w-full h-14 rounded-2xl bg-primary"
                        onPress={handleAllClear}
                    >
                        <Text className="text-lg font-semibold text-primary-foreground">
                            All clear
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

