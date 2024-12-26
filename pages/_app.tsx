// @ts-nocheck
// pages/_app.js
import "reflect-metadata";
import "@styles/globals.css";
import { UserProvider } from "@contexts/UserContext";
import { useRouter } from "next/router";
import BottomNavBar from "@components/BottomNavBar"; // Adjust the import path as needed
import ToastContainer from "@components/ToastContainer";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Determine if the current route is under `/accounts/*`
  const isAccountPage = router.pathname.startsWith("/accounts");

  return (
    <UserProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        {/* Conditionally render BottomNavBar */}
        {!isAccountPage && <BottomNavBar />}
      </div>
      <ToastContainer />
      {/* <Component {...pageProps} /> */}
    </UserProvider>
  );
}

export default MyApp;
