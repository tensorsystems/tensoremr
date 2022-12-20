import { AppProps } from "next/app";
import Head from "next/head";
import { NotificationProvider } from "@tensoremr/notification";
import { BottomSheetProvider } from "@tensoremr/bottomsheet";
import { SessionProvider } from "next-auth/react";
import { Page } from "@tensoremr/models";
import { MainLayout } from "../components/layout";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import _ from "lodash";
import "material-icons-font/material-icons-font.css";
import "./styles.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

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
    <SessionProvider session={pageProps.session}>
      <NotificationProvider>
        <BottomSheetProvider>
          <Head>
            <title>Tensor EMR</title>
          </Head>
          <MainLayout
            onPageSelect={(route: string) => {
              console.log("Route", route);
            }}
            onAddPage={(page: Page) => {
              console.log("Route", page);
            }}
          >
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
