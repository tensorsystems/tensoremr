import { AppProps } from "next/app";
import Head from "next/head";
import { NotificationProvider } from "@tensoremr/notification";
import { BottomSheetProvider } from "@tensoremr/bottomsheet";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import "./styles.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { SessionProvider } from "../context/SessionProvider";
import { MainLayout } from "../components/layout";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: any;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider>
      <NotificationProvider>
        <BottomSheetProvider>
          <Head>
            <title>Tensor EMR</title>
          </Head>

          <MainLayout>
            <main className="app">
              <div>{getLayout(<Component {...pageProps} />)}</div>
            </main>
          </MainLayout>
        </BottomSheetProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}

export default CustomApp;
