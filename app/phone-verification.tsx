import { Button } from "@/shared/ui/button";
import type { PhoneNumberValue } from "@/shared/ui/phone-number";
import { PhoneNumber } from "@/shared/ui/phone-number";
import { Text } from "@/shared/ui/text";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import countries from "countries-phone-masks";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PhoneVerificationForm {
  phone: PhoneNumberValue;
}

function PhoneVerification() {
  const defaultCountry =
    countries.find((country) => country.iso === "AE") ?? countries[0];

  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch } = useForm<PhoneVerificationForm>({
    defaultValues: {
      phone: {
        country: defaultCountry,
        phoneNumber: defaultCountry.code,
      },
    },
  });

  const onSubmit = async (data: PhoneVerificationForm) => {
    const rawPhone = data.phone.phoneNumber ?? "";
    const formattedPhone = rawPhone.replace(/[^\d+]/g, "");
    const normalizedPhone = formattedPhone.startsWith("+")
      ? formattedPhone
      : `+${formattedPhone}`;

    setIsSubmitting(true);
    try {
      // Check if we're in sign-up flow (user doesn't exist yet)
      if (signUp && signUp.missingFields?.includes("phone_number") && !user) {
        // Update signUp with phone number
        await signUp.update({ phoneNumber: normalizedPhone });
        
        // Prepare phone verification
        await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });

        router.push({
          pathname: "/phone-verification/verify",
          params: { 
            phone: normalizedPhone, 
            isSignUp: "true" 
          },
        });
        return;
      }

      // Existing user flow
      if (!isUserLoaded || !user) {
        Alert.alert("Error", "Please try signing in again.");
        return;
      }

      const existingPhone = user.phoneNumbers.find(
        (phoneNumber) => phoneNumber.phoneNumber === normalizedPhone
      );

      if (existingPhone?.verification?.status === "verified") {
        Alert.alert("Verification", "This phone number is already verified.");
        router.replace("/");
        return;
      }

      const phoneResource =
        existingPhone ??
        (await user.createPhoneNumber({ phoneNumber: normalizedPhone }));

      await (phoneResource as any).prepareVerification({
        strategy: "phone_code",
      });

      router.push({
        pathname: "/phone-verification/verify",
        params: { phone: normalizedPhone, phoneId: phoneResource.id },
      });
    } catch (error: any) {
      const message =
        error?.errors?.[0]?.message ?? "Failed to send verification code.";
      Alert.alert("Verification", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone = watch("phone");

  const canSubmit = useMemo(() => {
    if (!phone?.country || !phone?.phoneNumber) {
      return false;
    }

    const rawMask = phone.country.mask;
    const maskTemplate = Array.isArray(rawMask) ? rawMask[0] : rawMask;
    const maskDigitCount = maskTemplate
      ? (maskTemplate.match(/[#\d]/g) || []).length
      : 0;

    const digitsOnly = phone.phoneNumber.replace(/[^\d]/g, "");
    const countryDigits = phone.country.code.replace(/[^\d]/g, "");

    if (digitsOnly.length <= countryDigits.length) {
      return false;
    }

    if (maskDigitCount === 0) {
      return true;
    }

    return digitsOnly.length >= countryDigits.length + maskDigitCount;
  }, [phone]);

  return (
    <SafeAreaView className="flex-1">
      <View className="justify-center flex-1 px-6">
        {/* Белая карточка с закругленными углами */}
        <View className="p-6 bg-white rounded-3xl">
          {/* Заголовок */}
          <Text className="mb-2 text-2xl font-bold text-center text-foreground">
            Phone number
          </Text>

          {/* Подзаголовок */}
          <Text className="mb-6 text-base text-center text-muted-foreground">
            A confirmation code will be sent to it
          </Text>

          {/* Поле ввода номера */}
          <View className="mb-6">
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <PhoneNumber value={value} onChange={onChange} />
              )}
            />
          </View>

          {/* Желтая кнопка */}
          <Button
            disabled={!canSubmit || (!isUserLoaded && !isSignUpLoaded) || isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className="bg-primary active:bg-primary/90"
          >
            <Text className="text-base font-semibold text-primary-foreground">
              Get code
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PhoneVerification;
