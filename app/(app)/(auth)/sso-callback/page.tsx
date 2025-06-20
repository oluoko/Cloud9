import AuthLayout from "@/components/auth-layout";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  // Handle the redirect flow by calling the Clerk.handleRedirectCallback() method
  // or rendering the prebuilt <AuthenticateWithRedirectCallback/> component.
  // This is the final step in the custom OAuth flow.
  return (
    <AuthLayout mode="login">
      <AuthenticateWithRedirectCallback
        signUpForceRedirectUrl="/saving-info"
        signInForceRedirectUrl="/saving-info"
      />
    </AuthLayout>
  );
}
