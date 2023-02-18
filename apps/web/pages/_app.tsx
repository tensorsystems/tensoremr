import { AppProps } from "next/app";
import Head from "next/head";
import { NotificationProvider } from "@tensoremr/notification";
import { BottomSheetProvider } from "@tensoremr/bottomsheet";
import { SessionProvider } from "next-auth/react";
import { Page } from "@tensoremr/models";
import { MainLayout } from "../components/layout";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import "@material-icons/font/css/all.css";
import "./styles.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Script from "next/script";

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
    <>


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
                {false && (
                  <div className="flex justify-between mt-1 mb-1">
                    <div />
                    <div className="flex space-x-1 transform hover:scale-105 text-emerald-600">
                      <MapPinIcon className="w-5 h-5 " />
                      <p className="text-sm cursor-pointer">Exam Room 1</p>
                    </div>
                  </div>
                )}
                <div>{getLayout(<Component {...pageProps} />)}</div>
              </main>
            </MainLayout>
          </BottomSheetProvider>
        </NotificationProvider>
      </SessionProvider>
    </>
  );
}

export default CustomApp;
