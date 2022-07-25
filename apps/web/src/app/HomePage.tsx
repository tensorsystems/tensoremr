/* eslint-disable @typescript-eslint/ban-ts-comment */
/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState, useEffect } from 'react';
import { Page } from '@tensoremr/models';
import { HomeTabs, HomePages, Component404 } from '@tensoremr/ui-components';

// @ts-ignore
import Sheet from 'react-modal-sheet';

import {
  matchPath,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { PatientRegistrationPage } from './feature-patient-registration/feature-patient-registration';
import { DiagnosticOrdersPage } from './feature-diagnostic-orders/feature-diagnostic-orders';
import { Patients } from './feature-patients/feature-patients';
import { parseJwt } from '@tensoremr/util';
import { Appointments } from './feature-appointments/feature-appointments';
import { SurgicalOrdersPage } from './feature-surgical-orders/feature-surgical-orders';
import { TreatmentOrdersPage } from './feature-treatment-orders/feature-treatment-orders';
import { LabOrdersPage } from './feature-lab-orders/feature-lab-orders';
import { ChatsPage } from './feature-chats/feature-chats';
import { AdminHome } from './feature-admin/feature-admin';
import { UpdatePatientPage } from './feature-update-patient/feature-update-patient';
import { ReferralOrdersPage } from './feature-referral-orders/feature-referral-orders';
import { ProfilePage } from './feature-profile/feature-profile';
import { PharmacyHome } from './feature-pharmacy-home/feature-pharmacy-home';
import { EyeShopHome } from './feature-eyeshope-home/feature-eyeshope-home';
import { HomeReception } from './feature-reception-home/feature-reception-home';
import { HomeClinician } from './feature-clinician-home/feature-clinician-home';
import { PatientQueuePage } from './feature-patient-queue/feature-patient-queue';
import { FollowUpOrdersPage } from './feature-followup-orders/feature-followup-orders';

import {
  useBottomSheetDispatch,
  useBottonSheetState,
} from '@tensoremr/bottomsheet';
import { MainLayout } from './layouts/MainLayout';

export const HomePage: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const [pages, setPages] = useState<Array<Page>>([HomePages[0]]);
  const [activeTab, setActiveTab] = useState<string>('/');
  const [userType, setUserType] = useState<
    'Receptionist' | 'Clinician' | 'Pharmacist' | 'Optical Assistant'
  >();

  const bottomSheetDispatch = useBottomSheetDispatch();
  const { showBottomSheet, snapPoint, BottomSheetChildren } =
    useBottonSheetState();

  const handlePageSelect = (route: string) => {
    const existingPage = pages.find((e) => e.route === route);
    const page = HomePages.find(
      (e) =>
        matchPath(route.charAt(0) === '/' ? route : `/${route}`, {
          path: e.route,
        })?.isExact ?? false
    );

    if (existingPage === undefined && page !== undefined) {
      const newPages = pages.concat(page);
      setPages(newPages);
    } else {
      if (page !== undefined) setActiveTab(page.route);
    }
  };

  const handlePageAdd = (page: Page) => {
    const existingPage = pages.find((e) => e.route === page.route);

    if (existingPage === undefined) {
      const newPages = pages.concat(page);
      setPages(newPages);
    } else {
      setActiveTab(page.route);
    }
  };

  const handleTabOpen = (route: string) => {
    setActiveTab(route);
    history.replace(route);
  };

  const handleTabClose = (route: string) => {
    const newPages = pages.filter((e) => e.route !== route);

    const lastIdx = newPages.length - 1;
    const lastRoute = newPages[lastIdx].route;

    setActiveTab(lastRoute);
    history.replace(lastRoute);

    setPages(newPages);
  };

  useEffect(() => {
    const sessionPagesString = sessionStorage.getItem('currentPages');
    const sessionActiveTabString = sessionStorage.getItem('activeTab');

    if (sessionPagesString !== null) {
      const sessionPages = JSON.parse(sessionPagesString);
      const newPages: Array<Page> = sessionPages.map((e: any) => {
        const routePage = HomePages.find((page) => {
          return (
            matchPath(
              location.pathname.charAt(0) === '/'
                ? location.pathname
                : `/${location.pathname}`,
              {
                path: page.match,
                exact: true,
              }
            ) ?? false
          );
        });

        return {
          title: e.title,
          cancellable: e.cancellable,
          route: e.route,
          icon: routePage?.icon,
          match: e.match,
          notifs: e.notifs,
        };
      });

      setPages(newPages);
    }

    if (sessionActiveTabString !== null) {
      const sessionActiveTab = sessionActiveTabString;
      setActiveTab(sessionActiveTab);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token !== null) {
      const claim = parseJwt(token);
      if (claim.UserType.includes('Receptionist')) {
        setUserType('Receptionist');
      } else if (
        claim.UserType.includes('Physician') ||
        claim.UserType.includes('Nurse') ||
        claim.UserType.includes('Optometrist')
      ) {
        setUserType('Clinician');
      } else if (claim.UserType.includes('Pharmacist')) {
        setUserType('Pharmacist');
      } else if (claim.UserType.includes('Optical Assistant')) {
        setUserType('Optical Assistant');
      }
    }
  }, []);

  // Go to last page after change
  useEffect(() => {
    const lastIdx = pages.length - 1;
    const lastRoute = pages[lastIdx].route;

    setActiveTab(lastRoute);
    history.replace(lastRoute);
  }, [pages, history]);

  useEffect(() => {
    sessionStorage.setItem('currentPages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    sessionStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleTabUpdate = (page: any) => {
    // const exists = pages.find((e) => e.title === page.title);
    // if (exists) return;
    // const idx = pages.findIndex((e) => {
    //   return (
    //     matchPath(page.route, {
    //       path: e.match,
    //       exact: true,
    //     }) ?? false
    //   );
    // });
    // if (idx) {
    //   console.log(
    //     "handleTabUpdate",
    //     ...pages.slice(0, idx),
    //     {
    //       ...pages[idx],
    //       title: page.title,
    //       icon: page.icon,
    //       route: page.route,
    //     },
    //     ...pages.slice(idx + 1)
    //   );
    //   setPages([
    //     ...pages.slice(0, idx),
    //     {
    //       ...pages[idx],
    //       title: page.title,
    //       icon: page.icon,
    //       route: page.route,
    //     },
    //     ...pages.slice(idx + 1),
    //   ]);
    // }
  };

  return (
    <div>
      <MainLayout
        onPageSelect={(route: string) => handlePageSelect(route)}
        onAddPage={(page: Page) => handlePageAdd(page)}
      >
        <div>
          <HomeTabs
            pages={pages}
            activeTab={activeTab}
            onTabOpen={(route: string) => handleTabOpen(route)}
            onClose={(route: string) => handleTabClose(route)}
          />

          <div className="relative flex flex-col min-w-0 break-words w-full mb-6">
            <div className="px-2 py-5 flex-auto">
              <div className="tab-content tab-space">
                <Switch>
                  <Route exact path="/">
                    {userType === 'Receptionist' && (
                      <HomeReception
                        onAddPage={(page: Page) => handlePageAdd(page)}
                      />
                    )}

                    {userType === 'Clinician' && (
                      <HomeClinician
                        onAddPage={(page: Page) => handlePageAdd(page)}
                      />
                    )}

                    {userType === 'Pharmacist' && <PharmacyHome />}
                    {userType === 'Optical Assistant' && <EyeShopHome />}
                  </Route>
                  <Route path="/profile/:profileId">
                    <ProfilePage />
                  </Route>
                  <Route exact path="/new-patient">
                    <PatientRegistrationPage
                      onAddPage={(page: Page) => handlePageAdd(page)}
                    />
                  </Route>
                  <Route exact path="/update-patient">
                    <UpdatePatientPage
                      onAddPage={(page: Page) => handlePageAdd(page)}
                    />
                  </Route>
                  <Route path="/patients">
                    <Patients
                      onAddPage={handlePageAdd}
                      onUpdateTab={handleTabUpdate}
                    />
                  </Route>
                  <Route path="/appointments">
                    <Appointments
                      onUpdateTab={handleTabUpdate}
                      onAddPage={(page: Page) => handlePageAdd(page)}
                      onTabClose={(route: string) => handleTabClose(route)}
                    />
                  </Route>
                  <Route path="/chats">
                    <ChatsPage />
                  </Route>
                  <Route exact path="/lab-orders">
                    <LabOrdersPage />
                  </Route>
                  <Route exact path="/diagnostic-orders">
                    <DiagnosticOrdersPage />
                  </Route>
                  <Route exact path="/treatment-orders">
                    <TreatmentOrdersPage />
                  </Route>
                  <Route exact path="/surgical-orders">
                    <SurgicalOrdersPage />
                  </Route>
                  <Route exact path="/followup-orders">
                    <FollowUpOrdersPage />
                  </Route>
                  <Route exact path="/referrals">
                    <ReferralOrdersPage />
                  </Route>
                  <Route exact path="/patient-queue">
                    <PatientQueuePage />
                  </Route>
                  <Route path="/admin">
                    <AdminHome
                      matchUrl={match.url}
                      location={`${history.location.pathname}${location.search}`}
                    />
                  </Route>
                  <Route>
                    <Component404 />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {showBottomSheet && (
        <Sheet
          isOpen={showBottomSheet}
          disableDrag={true}
          onClose={() => bottomSheetDispatch({ type: 'hide' })}
          snapPoints={[snapPoint]}
        >
          <Sheet.Container
            // @ts-ignore
            onClose={() => {
              bottomSheetDispatch({ type: 'hide' });
            }}
          >
            <Sheet.Header />
            <Sheet.Content>{BottomSheetChildren}</Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop
            // @ts-ignore
            onClose={() => {
              bottomSheetDispatch({ type: 'hide' });
            }}
          />
        </Sheet>
      )}
    </div>
  );
};
