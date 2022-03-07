import type { AppProps } from "next/app";
import "@fontsource/uncial-antiqua";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
