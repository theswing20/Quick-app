import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Text } from "@/shared/ui/text";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PhoneVerificationCode() {
  const router = useRouter();
  const { phone, phoneId } = useLocalSearchParams<{
    phone?: string;
    phoneId?: string;
  }>();
  const { user, isLoaded } = useUser();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => code.trim().length >= 6, [code]);

  const handleVerify = async () => {
    if (!isLoaded || !user || !phoneId || !canSubmit) {
      return;
    }

    const phoneResource = user.phoneNumbers.find((p) => p.id === phoneId);
    if (!phoneResource) {
      Alert.alert("Verification", "Phone number not found.");
      return;
    }

    if (phoneResource.verification?.status === "verified") {
      Alert.alert("Verification", "This phone number is already verified.");
      router.replace("/");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await (phoneResource as any).attemptVerification({ code });

      if (result?.status === "verified") {
        Alert.alert("Verification", "Phone number verified successfully.");
        router.replace("/");
      } else {
        Alert.alert(
          "Verification",
          "The code you entered is invalid. Please try again."
        );
      }
    } catch (error: any) {
      const clerkError = error?.errors?.[0];

      if (
        clerkError?.code === "verification_already_attempted" ||
        clerkError?.message?.toLowerCase().includes("already verified")
      ) {
        Alert.alert("Verification", "This phone number is already verified.");
        router.replace("/");
      } else {
        const message =
          clerkError?.message ?? "Failed to verify the code. Please try again.";
        Alert.alert("Verification", message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !user || !phoneId) {
      return;
    }

    const phoneResource = user.phoneNumbers.find((p) => p.id === phoneId);
    if (!phoneResource) {
      Alert.alert("Verification", "Phone number not found.");
      return;
    }

    if (phoneResource.verification?.status === "verified") {
      Alert.alert("Verification", "This phone number is already verified.");
      router.replace("/");
      return;
    }

    try {
      setIsSubmitting(true);
      await (phoneResource as any).prepareVerification({
        strategy: "phone_code",
      });
      Alert.alert("Verification", "A new code has been sent.");
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.message ??
        "Unable to resend the code. Please try again later.";
      Alert.alert("Verification", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="justify-center flex-1 px-6">
        <View className="p-6 bg-white rounded-3xl">
          <Text className="mb-2 text-2xl font-bold text-center text-foreground">
            Enter verification code
          </Text>
          <Text className="mb-6 text-base text-center text-muted-foreground">
            {phone ? `We sent a code to ${phone}.` : "Enter the code we sent."}
          </Text>

          <View className="mb-6">
            <Input
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              placeholder="••••••"
              className="text-lg text-center"
              maxLength={6}
            />
          </View>

          <Button
            disabled={!canSubmit || !isLoaded || isSubmitting}
            onPress={handleVerify}
            className="mb-3 bg-primary active:bg-primary/90"
          >
            <Text className="text-base font-semibold text-primary-foreground">
              Verify code
            </Text>
          </Button>

          <Button
            variant="ghost"
            disabled={isSubmitting || !isLoaded}
            onPress={handleResend}
          >
            <Text className="text-base font-semibold text-primary">
              Resend code
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PhoneVerificationCode;
