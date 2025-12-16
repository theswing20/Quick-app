import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function SignIn() {
  const { isSignedIn } = useUser();
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  // Перенаправляем на верификацию телефона для входа/регистрации
  return <Redirect href="/phone-verification" />;
}
