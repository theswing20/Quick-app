import { Button } from "@/shared/ui/button";
import { Text } from "@/shared/ui/text";
import { useSSO, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Link, Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-black text-foreground mb-4 text-center">
          Sign In
        </Text>

        <Text className="text-lg text-muted-foreground text-center mb-12">
          Welcome back to QUICK!
        </Text>

        {/* Apple Sign In Button */}
        <ButtonApple />
        {/* Google Sign In Button */}
        <Button size="lg" variant="outline" className="w-full mb-8">
          <Text className="font-semibold">Continue with Google</Text>
        </Button>

        {/* Back to Home - Android style */}
        {Platform.OS === "android" && (
          <Link href="/" asChild>
            <Button variant="ghost" className="flex-row items-center">
              <Ionicons
                name="arrow-back"
                size={20}
                style={{ marginRight: 8 }}
              />
              <Text className="font-medium">Back to Home</Text>
            </Button>
          </Link>
        )}
      </View>
    </View>
  );
}

const ButtonApple = () => {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
        // For web, defaults to current path
        // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
        // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.push("/");
          },
        });
      } else {
        console.log("no createdSessionId");

        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      console.log("error");

      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);
  return (
    <Button onPress={onPress} size="lg" className="bg-black w-full mb-4">
      <Text className="text-white font-semibold">Continue with Apple</Text>
    </Button>
  );
};

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
