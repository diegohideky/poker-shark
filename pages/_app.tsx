// @ts-nocheck
// pages/_app.js
import "reflect-metadata";
import "@styles/globals.css";
import { UserProvider } from "@contexts/UserContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
