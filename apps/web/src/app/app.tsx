// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Fragment, useEffect, useState } from 'react';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import { UserRegistrationPage } from '@tensoremr/ui-components';
import { ProtectedRoute } from './layouts/ProtectedLayout';
import {
  useNotificationDispatch,
  useNotificationState,
} from '@tensoremr/notification';
import { HomePage } from './HomePage';
import { LoginPage } from './feature-login/feature-login';
import { parseJwt } from '@tensoremr/util';
import { isAfter } from 'date-fns';
import { useApolloClient } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import { Transition } from '@headlessui/react';
import classnames from 'classnames';

import loadingGif from './loading.gif';
import successGif from './success-blue.gif';
import format from 'date-fns/format';
import GetStartedPage from './feature-get-started/feature-get-started';
import PocketBaseClient from './pocketbase-client';
import { Spinner } from 'flowbite-react';

export function App() {
  const client = useApolloClient();


  const notifDispatch = useNotificationDispatch();
  const {
    showNotification,
    showSavingNotification,
    showSavedNotification,
    notifTitle,
    notifSubTitle,
    variant,
  } = useNotificationState();
  const history = useHistory();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [hasOrganizationDetails, setHasOrganizationDetails] =
    useState<boolean>(true);

  const organizationQuery = useQuery(['organization'], () =>
    PocketBaseClient.records.getList('organization')
  );

  useEffect(() => {
    if (organizationQuery.data?.items.length === 0) {
      setHasOrganizationDetails(false);
      history.replace('/get-started');
    } else {
      setHasOrganizationDetails(true);
    }
  }, [organizationQuery]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token !== null) {
      const claim = parseJwt(token);
      if (claim !== undefined) {
        const tokenExpired = isAfter(new Date(), new Date(claim.exp * 1000));

        if (tokenExpired) {
          client.cache.gc();
          sessionStorage.removeItem('accessToken');
        }
      }
    }
  }, [client.cache]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (organizationQuery.isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <Spinner size="lg" color="info" />
      </div>
    );
  }

  const authenticationPath = hasOrganizationDetails ? '/login' : '/get-started';

  return (
    <div>
      <Switch>
        <Route path="/get-started">
          <GetStartedPage />
        </Route>

        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <UserRegistrationPage
            onFailure={(message) => {
              notifDispatch({
                type: 'showNotification',
                notifTitle: 'Error',
                notifSubTitle: message,
                variant: 'failure',
              });
            }}
          />
        </Route>
        <Route path="/">
          <ProtectedRoute
            component={HomePage}
            isAllowed={isAuthenticated}
            isAuthenticated={isAuthenticated}
            authenticationPath={'/login'}
            restrictedPath={'/'}
          />
        </Route>
      </Switch>
      <Transition.Root
        show={showNotification}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="h-10 fixed top-10 right-10 z-50">
          <div
            className={classnames(
              'flex p-5 bg-white rounded-md shadow-xl border-l-8 ',
              {
                'border-green-600': variant === 'success',
                'border-yellow-600': variant !== 'success',
              }
            )}
          >
            <div className="flex-initial">
              {variant === 'success' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7 text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7 text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 ml-2">
              <p className="font-bold text-gray-700">{notifTitle}</p>
              <p className="text-gray-500">{notifSubTitle}</p>
            </div>
            <div className="flex-initial ml-5">
              <button
                onClick={() => {
                  notifDispatch({ type: 'hideNotification' });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition.Root>

      <Transition.Root
        show={showSavingNotification}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="h-10 fixed bottom-10 right-10 z-50">
          <div
            className={classnames(
              'flex items-center px-3 bg-white rounded-md shadow-xl border-l-8 ',
              {
                'border-green-600': variant === 'success',
                'border-sky-600': variant !== 'success',
              }
            )}
          >
            <div className="flex-initial">
              {variant === 'success' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7 text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <div>
                  <img alt={'Saving'} src={loadingGif} height={60} width={60} />
                </div>
              )}
            </div>
            <div className="flex-1 ml-2">
              <p className=" text-gray-700 font-light">Saving</p>
            </div>
          </div>
        </div>
      </Transition.Root>

      <Transition.Root
        show={showSavedNotification}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="h-10 fixed bottom-10 right-10 z-50">
          <div
            className={classnames(
              'flex items-center px-3 bg-white rounded-md shadow-xl border-l-8 ',
              {
                'border-green-600': variant === 'success',
                'border-sky-600': variant !== 'success',
              }
            )}
          >
            <div className="flex-initial">
              <img alt={'Saved'} src={successGif} height={60} width={60} />
            </div>
            <div className="flex-1 ml-2">
              <p className="text-gray-700 font-light">Saved</p>
              <p className="text-sm font-light">
                {format(new Date(), 'hh:mm aa')}
              </p>
            </div>
          </div>
        </div>
      </Transition.Root>
    </div>
  );
}

export default App;
