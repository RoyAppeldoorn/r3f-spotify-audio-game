import "../ui-components/theme.css";
import "../globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ThemeProvider } from "../application/contexts/ThemeContext";
import { Layout } from "../application/layout/layout";

// Refetch session to manually trigger refresh tokens
const REFETCH_INTERVAL_IN_MINUTES = 5 * 60;

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider
      session={pageProps.session}
      refetchInterval={REFETCH_INTERVAL_IN_MINUTES}
    >
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
