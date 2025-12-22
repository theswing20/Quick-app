import { useDeviceRegistration } from "@/features/notifications/use-device-registration";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Text } from "@/shared/ui/text";
import { useClerk, useSignIn, useSignUp, useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function PhoneVerificationCode() {
  const router = useRouter();
  const { phone, phoneId, isSignUp, isSignIn } = useLocalSearchParams<{
    phone?: string;
    phoneId?: string;
    isSignUp?: string;
    isSignIn?: string;
  }>();
  const { user, isLoaded } = useUser();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { setActive } = useClerk();
  const { registerDevice } = useDeviceRegistration();

  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [timer, setTimer] = useState(0);

  const canSubmit = useMemo(() => code.trim().length >= 6, [code]);

  // Определяем время таймера в зависимости от попытки
  const getTimerDuration = (attempt: number): number => {
    if (attempt === 0) return 60; // Первая отправка SMS при переходе на страницу
    if (attempt === 1) return 180; // Вторая попытка
    return 3000; // Третья и последующие попытки
  };

  // Запускаем таймер при монтировании компонента (когда SMS уже отправлено)
  useEffect(() => {
    const initialDuration = getTimerDuration(0);
    setTimer(initialDuration);
  }, []);

  // Таймер обратного отсчета
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if we're in sign-in flow
      if (isSignIn === "true" && signIn) {
        if (!isSignInLoaded) {
          Alert.alert("Error", "Please wait...");
          return;
        }

        // Attempt phone verification for sign-in
        const result = await signIn.attemptFirstFactor({
          strategy: "phone_code",
          code,
        });

        if (result?.status === "complete") {
          const sessionId = signIn.createdSessionId;

          if (sessionId && setActive) {
            // Set the active session with navigate callback
            await setActive({
              session: sessionId,
              navigate: async ({ session }: { session: any }) => {
                // Check for tasks and navigate to custom UI to help users resolve them
                if (session?.currentTask) {
                  return;
                }

                const hasPhoneNumber =
                  (session?.user?.phoneNumbers?.length ?? 0) > 0;

                if (!hasPhoneNumber) {
                  router.replace("/phone-verification");
                  return;
                }

                // Регистрируем устройство после успешной авторизации
                try {
                  await registerDevice();
                } catch (error) {
                  console.error("Failed to register device:", error);
                }

                router.replace("/(app)/home");
              },
            });
          } else {
            // If no session ID available, redirect anyway
            setTimeout(() => {
              router.replace("/");
            }, 500);
          }
        } else {
          Alert.alert(
            "Verification",
            "The code you entered is invalid. Please try again."
          );
        }
        return;
      }

      // Check if we're in sign-up flow
      if (isSignUp === "true" && signUp) {
        if (!isSignUpLoaded) {
          Alert.alert("Error", "Please wait...");
          return;
        }

        // Attempt phone verification for sign-up
        const result = await signUp.attemptPhoneNumberVerification({ code });
        if (result?.status === "complete") {
          let sessionId: string | null = null;

          // Check if session already exists before creating
          if (signUp.createdSessionId) {
            sessionId = signUp.createdSessionId;
          } else {
            // Try to create the account and session
            try {
              const completeResult = await signUp.create({});
              sessionId =
                completeResult?.createdSessionId || signUp.createdSessionId;
            } catch (createError: any) {
              const errorCode = createError?.errors?.[0]?.code;
              const errorMessage =
                createError?.errors?.[0]?.message?.toLowerCase() || "";

              // If session already exists, try to use it
              if (
                errorCode === "session_exists" ||
                errorMessage.includes("session already exists") ||
                errorMessage.includes("session exists")
              ) {
                sessionId = signUp.createdSessionId;
              } else {
                throw createError;
              }
            }
          }

          if (sessionId && setActive) {
            // Set the active session with navigate callback
            await setActive({
              session: sessionId,
              navigate: async ({ session }: { session: any }) => {
                // Check for tasks and navigate to custom UI to help users resolve them
                if (session?.currentTask) {
                  return;
                }

                const hasPhoneNumber =
                  (session?.user?.phoneNumbers?.length ?? 0) > 0;

                if (!hasPhoneNumber) {
                  router.replace("/phone-verification");
                  return;
                }

                // Регистрируем устройство после успешной верификации
                try {
                  await registerDevice();
                } catch (error) {
                  console.error("Failed to register device:", error);
                }

                router.replace("/(app)/home");
              },
            });
          } else {
            // If no session ID available, redirect anyway
            // The index.tsx will handle authentication state check
            // Wait a bit for state to update
            setTimeout(() => {
              router.replace("/");
            }, 500);
          }
        } else {
          Alert.alert(
            "Verification",
            "The code you entered is invalid. Please try again."
          );
        }
        return;
      }

      // Existing user flow
      if (!isLoaded || !user || !phoneId) {
        Alert.alert("Error", "Please try again.");
        return;
      }

      const phoneResource = user.phoneNumbers.find((p) => p.id === phoneId);
      if (!phoneResource) {
        Alert.alert("Verification", "Phone number not found.");
        return;
      }

      if (phoneResource.verification?.status === "verified") {
        Alert.alert("Verification", "This phone number is already verified.");
        router.replace("/(app)/home");
        return;
      }

      const result = await (phoneResource as any).attemptVerification({ code });

      if (result?.status === "verified") {
        // Регистрируем устройство после успешной верификации
        try {
          await registerDevice();
        } catch (error) {
          console.error("Failed to register device:", error);
        }
        Alert.alert("Verification", "Phone number verified successfully.");
        router.replace("/(app)/home");
      } else {
        Alert.alert(
          "Verification",
          "The code you entered is invalid. Please try again."
        );
      }
    } catch (error: any) {
      const clerkError = error?.errors?.[0];
      const errorCode = clerkError?.code;
      const errorMessage = clerkError?.message?.toLowerCase() || "";

      if (
        errorCode === "verification_already_attempted" ||
        errorMessage.includes("already verified")
      ) {
        Alert.alert("Verification", "This phone number is already verified.");
        router.replace("/(app)/home");
      } else if (
        errorCode === "session_exists" ||
        errorMessage.includes("session already exists") ||
        errorMessage.includes("session exists")
      ) {
        // Session already exists - try to use it and redirect
        if (signUp?.createdSessionId && setActive) {
          try {
            await setActive({
              session: signUp.createdSessionId,
              navigate: async ({ session }: { session: any }) => {
                const hasPhoneNumber =
                  (session?.user?.phoneNumbers?.length ?? 0) > 0;

                if (!hasPhoneNumber) {
                  router.replace("/phone-verification");
                  return;
                }

                // Регистрируем устройство после успешной верификации
                try {
                  await registerDevice();
                } catch (error) {
                  console.error("Failed to register device:", error);
                }

                router.replace("/(app)/home");
              },
            });
          } catch (setActiveError) {
            console.error("Error setting active session:", setActiveError);
            // Fallback: redirect anyway
            router.replace("/");
          }
        } else {
          // No session available, redirect to home page
          router.replace("/");
        }
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
    // Проверяем, не истек ли таймер
    if (timer > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Check if we're in sign-in flow
      if (isSignIn === "true" && signIn) {
        if (!isSignInLoaded) {
          Alert.alert("Error", "Please wait...");
          return;
        }

        // Получаем phoneNumberId из signIn объекта
        // Когда используется телефон как identifier, Clerk автоматически определяет phoneNumberId
        const phoneNumberId = (signIn as any).supportedFirstFactors?.[0]
          ?.phoneNumberId;

        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          ...(phoneNumberId && { phoneNumberId }),
        } as any);

        // Увеличиваем счетчик попыток и запускаем таймер
        const newAttempts = resendAttempts + 1;
        setResendAttempts(newAttempts);
        setTimer(getTimerDuration(newAttempts));

        Alert.alert("Verification", "A new code has been sent.");
        return;
      }

      // Check if we're in sign-up flow
      if (isSignUp === "true" && signUp) {
        if (!isSignUpLoaded) {
          Alert.alert("Error", "Please wait...");
          return;
        }

        await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });

        // Увеличиваем счетчик попыток и запускаем таймер
        const newAttempts = resendAttempts + 1;
        setResendAttempts(newAttempts);
        setTimer(getTimerDuration(newAttempts));

        Alert.alert("Verification", "A new code has been sent.");
        return;
      }

      // Existing user flow
      if (!isLoaded || !user || !phoneId) {
        Alert.alert("Error", "Please try again.");
        return;
      }

      const phoneResource = user.phoneNumbers.find((p) => p.id === phoneId);
      if (!phoneResource) {
        Alert.alert("Verification", "Phone number not found.");
        return;
      }

      if (phoneResource.verification?.status === "verified") {
        Alert.alert("Verification", "This phone number is already verified.");
        router.replace("/(app)/home");
        return;
      }

      await (phoneResource as any).prepareVerification({
        strategy: "phone_code",
      });

      // Увеличиваем счетчик попыток и запускаем таймер
      const newAttempts = resendAttempts + 1;
      setResendAttempts(newAttempts);
      setTimer(getTimerDuration(newAttempts));

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

  // Форматируем время для отображения
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }
    return `${secs}s`;
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'height' для Android, 'padding' для iOS
    style={{ flex: 1 }}
  >
      <View className="justify-center flex-1 px-6">
        <View className="p-6 bg-white rounded-3xl">
          {/* Кнопка возврата */}
          <TouchableOpacity
            onPress={handleGoBack}
            className="self-start mb-4"
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#000000" />
          </TouchableOpacity>

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
            disabled={
              !canSubmit ||
              (!isLoaded && !isSignUpLoaded && !isSignInLoaded) ||
              isSubmitting
            }
            onPress={handleVerify}
            className="mb-3 bg-primary active:bg-primary/90"
          >
            <Text className="text-base font-semibold text-primary-foreground">
              Verify code
            </Text>
          </Button>

          <Button
            variant="ghost"
            disabled={
              isSubmitting ||
              timer > 0 ||
              (!isLoaded && !isSignUpLoaded && !isSignInLoaded)
            }
            onPress={handleResend}
          >
            <Text className="text-base font-semibold text-primary">
              {timer > 0 ? `Resend code (${formatTime(timer)})` : "Resend code"}
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default PhoneVerificationCode;
