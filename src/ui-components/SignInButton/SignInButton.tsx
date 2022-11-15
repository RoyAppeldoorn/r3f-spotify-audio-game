import { PropsWithChildren } from "react";

type SignInButtonProps = PropsWithChildren<{
  authenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}>;

export const SignInButton: React.FC<SignInButtonProps> = ({
  signIn,
  signOut,
  authenticated,
}) => {
  return (
    <button onClick={() => (authenticated ? signOut() : signIn())}>
      {authenticated ? "Sign out" : "Sign in"}
    </button>
  );
};
