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
import { MainLayout } from "../components/layout";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";

import { frontendConfig } from "../config/frontendConfig";
import { useRouter } from "next/router";
import { useRouter as useRouterNavigation } from "next/navigation";

if (typeof window !== "undefined") {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init(frontendConfig());
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: any;
};

const publicPages: string[] = ["/auth/[[...path]]"];

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const routerNav = useRouterNavigation();

  const getLayout = Component.getLayout ?? ((page) => page);
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <SuperTokensWrapper>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SessionAuth
            onSessionExpired={() => {
              routerNav.refresh();
            }}
          >
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
          </SessionAuth>
        </>
      )}
    </SuperTokensWrapper>
  );
}

export default CustomApp;
