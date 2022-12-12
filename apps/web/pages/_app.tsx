import { AppProps } from "next/app";
import Head from "next/head";
import { NotificationProvider } from "@tensoremr/notification";
import { BottomSheetProvider } from "@tensoremr/bottomsheet";
import { SessionProvider } from "next-auth/react";
import { Page } from "@tensoremr/models";
import { MainLayout } from "../components/layout";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";
import { Breadcrumb } from "flowbite-react";
import { useRouter } from "next/router";
import { HomePages } from "../components/home-tabs/pages";
import _ from "lodash";
import "material-icons-font/material-icons-font.css";
import "./styles.css";

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: any;
};

interface Breadcrumb {
  href: string;
  title: string;
  icon?: string;
}

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<Breadcrumb>>([]);

  useEffect(() => {
    const paths = router.asPath.split("/");
    let crumbs: Array<Breadcrumb> = [];
    paths.forEach((path: string) => {
      if (path.startsWith("&")) {
        return;
      }

      if (path !== "") {
        const title = _.startCase(path.replace("-", " "));
        const icon = HomePages.find((e) => e.route === `/${path}`)?.icon;
        document.title = `${title} - Tensor EMR`;
        crumbs = crumbs.concat({
          title: title,
          href: path,
          icon: icon,
        });
      } else {
        crumbs = crumbs.concat({
          title: "Home",
          href: "/",
          icon: "home",
        });
      }
    });
    const uniqueCrumbs = _.uniqBy(crumbs, (e) => e.href);
    setBreadcrumbs([...uniqueCrumbs]);
  }, [router.asPath]);

  return (
    <SessionProvider session={pageProps.session}>
      <NotificationProvider>
        <BottomSheetProvider>
          <Head>
            <title>Welcome to web!</title>
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
              <div className="shadow-md">
                <Breadcrumb
                  aria-label="Solid background breadcrumb example"
                  className="bg-gray-50 py-3 px-5 dark:bg-gray-900"
                >
                  {breadcrumbs.map((e) => (
                    <Breadcrumb.Item key={e.href}>
                      <div className="flex items-center space-x-2">
                        <span className="material-icons text-teal-600">
                          {e.icon}
                        </span>{" "}
                        <span>{e.title}</span>
                      </div>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </div>

              <div className="mt-5">
                {getLayout(<Component {...pageProps} />)}
              </div>
            </main>
          </MainLayout>
        </BottomSheetProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}

export default CustomApp;
