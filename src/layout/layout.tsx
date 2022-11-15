import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { useThemeContext } from "../contexts/ThemeContext";
import { Navbar, ThemeToggle, SignInButton } from "../ui-components";

export const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { status } = useSession();
  const { isDarkMode, toggle } = useThemeContext();

  return (
    <>
      <Head>
        <title>Spotify audio game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar>
        <ThemeToggle isDarkMode={isDarkMode} toggle={toggle} />
        <SignInButton
          signIn={() => signIn()}
          signOut={() => signOut()}
          authenticated={status === "authenticated"}
        />
      </Navbar>
      <main>{children}</main>
    </>
  );
};
