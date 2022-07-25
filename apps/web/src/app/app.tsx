// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { gql, useQuery } from '@apollo/client';
import React, { Fragment, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
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
import { isLoggedInVar } from '@tensoremr/cache';
import { useApolloClient } from '@apollo/client';

import { Transition } from '@headlessui/react';
import classnames from 'classnames';

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export function App() {
  const client = useApolloClient();

  const { data } = useQuery(IS_LOGGED_IN);

  const notifDispatch = useNotificationDispatch();
  const { showNotification, notifTitle, notifSubTitle, variant } =
    useNotificationState();

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token !== null) {
      const claim = parseJwt(token);
      if (claim !== undefined) {
        const tokenExpired = isAfter(new Date(), new Date(claim.exp * 1000));

        if (tokenExpired) {
          client.cache.gc();
          sessionStorage.removeItem('accessToken');
          isLoggedInVar(false);
        }
      }
    }
  }, [client.cache]);

  return (
    <div>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <UserRegistrationPage
            onFailure={(message) => {
              notifDispatch({
                type: 'show',
                notifTitle: 'Error',
                notifSubTitle: message,
                variant: 'failure',
              });
            }}
          />
        </Route>
        <ProtectedRoute
          component={HomePage}
          isAllowed={data?.isLoggedIn}
          isAuthenticated={data?.isLoggedIn}
          authenticationPath={'/login'}
          restrictedPath={'/'}
        />
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
                  notifDispatch({ type: 'hide' });
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
    </div>
  );
}

export default App;
