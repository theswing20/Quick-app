import { Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethodOptions() {
    const { height } = useWindowDimensions();
    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={{ height: height * 0.5 }} className="shadow-lg bg-white rounded-t-3xl py-6 px-4">
                <SafeAreaView className="flex-1">
                    <View>
                        <Text>Payment Method Options</Text>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
}