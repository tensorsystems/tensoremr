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

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isLoggedInVar, accessToken } from '@tensoremr/cache';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useHistory } from 'react-router-dom';
import Logo from '../img/logo_dark.png';
import ReactLoading from 'react-loading';
import classnames from 'classnames';
import { OrganizationDetails } from '@tensoremr/models';

export const LoginPage: React.FC = () => {
  const history = useHistory();

  const { register, handleSubmit } = useForm<any>();
  const notifDispatch = useNotificationDispatch();

  const [isLegacy, setIsLegacy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [networkStatus, setNetworkStatus] = useState<boolean>(false);

  const isLoggedIn = isLoggedInVar();

  useEffect(() => {
    if (isLoggedIn === true) {
      history.replace('/');
    }
  }, [isLoggedIn]);

  const [organizationDetails, setOrganizationDetails] =
    useState<OrganizationDetails>();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(`${process.env['NX_APP_SERVER_URL']}/organizationDetails`, {
      method: 'GET',
      signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setOrganizationDetails(data);
      })
      .catch((error) => null);

    return () => controller.abort();
  }, []);

  const onSubmit = (data: any) => {
    setIsLoading(true);

    fetch(`${process.env['NX_APP_SERVER_URL']}/organizationDetails`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((organizationDetails) => {
        if (isLegacy) {
          fetch(`${process.env['NX_APP_SERVER_URL']}/legacy-login`, {
            method: 'POST',
            body: JSON.stringify(data),
          })
            .then((res) => {
              if (!res.ok) {
                throw res;
              }

              return res.json();
            })
            .then((data) => {
              setIsLoading(false);
              sessionStorage.setItem('accessToken', data.token as string);
              sessionStorage.setItem(
                'organizationDetails',
                JSON.stringify(organizationDetails)
              );
              isLoggedInVar(true);
              accessToken(data.token);
            })
            .catch((error) => {
              setIsLoading(false);

              if (typeof error.json !== 'function') {
                notifDispatch({
                  type: 'showNotification',
                  notifTitle: 'Error',
                  notifSubTitle: "Couldn't connect to the server",
                  variant: 'failure',
                });

                return;
              }

              error.json().then((data: any) => {
                notifDispatch({
                  type: 'showNotification',
                  notifTitle: 'Error',
                  notifSubTitle: data.message,
                  variant: 'failure',
                });
              });
            });
        } else {
          fetch(`${process.env['NX_APP_SERVER_URL']}/login`, {
            method: 'POST',
            body: JSON.stringify(data),
          })
            .then((res) => {
              if (!res.ok) {
                throw res;
              }

              return res.json();
            })
            .then((result) => {
              setIsLoading(false);
              sessionStorage.setItem('accessToken', result.token as string);
              sessionStorage.setItem(
                'organizationDetails',
                JSON.stringify(organizationDetails)
              );
              isLoggedInVar(true);
              accessToken(result.token);
            })
            .catch((error) => {
              setIsLoading(false);
              if (typeof error.json !== 'function') {
                notifDispatch({
                  type: 'showNotification',
                  notifTitle: 'Error',
                  notifSubTitle: "Couldn't connect to the server",
                  variant: 'failure',
                });

                return;
              }

              error.json().then((data: any) => {
                notifDispatch({
                  type: 'showNotification',
                  notifTitle: 'Error',
                  notifSubTitle: data.message,
                  variant: 'failure',
                });
              });
            });
        }
      })
      .catch((error) => null);
  };

  return (
    <div className="h-screen w-screen bg-gray-600 p-16">
      <div className="h-full w-full bg-white rounded-lg shadow-xl p-5 overflow-auto bg-login bg-center bg-cover">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img className="h-auto w-44" src={Logo} />
          </div>
          <div className="flex justify-center ml-16 mt-10">
            <div className="px-7 flex-initial">
              <p className="text-3xl text-gray-800 font-bold tracking-wide">
                Welcome Back
              </p>

              <p className="text-teal-500 font-semibold">
                {organizationDetails?.name}
              </p>

              <div className="mt-16 w-full z-20 ">
                {isLegacy && (
                  <p className="text-gray-400 font-semibold mt-6">
                    Log in using your legacy account
                  </p>
                )}

                {isLegacy && (
                  <input
                    className="mt-3 p-3 border-none w-full rounded-md bg-gray-200 focus:bg-white focus:placeholder-gray-400"
                    type="text"
                    placeholder="Username"
                    name="username"
                    id="username"
                    required
                    ref={register({ required: true })}
                  />
                )}
                <input
                  className="mt-6 p-3 border-none w-full rounded-md bg-gray-200 focus:bg-white focus:placeholder-gray-400"
                  type="text"
                  placeholder="Email"
                  name="email"
                  id="email"
                  required
                  ref={register({ required: true })}
                />
                <input
                  className="mt-6 p-3 border-none w-full rounded-md bg-gray-200 focus:bg-white focus:placeholder-gray-400"
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="password"
                  required
                  ref={register({ required: true })}
                />
              </div>

              <div className="mt-4 text-sm text-gray-600 flex justify-end">
                <div>
                  {isLegacy ? (
                    <a
                      href="#"
                      onClick={(evt) => {
                        evt.preventDefault();
                        setIsLegacy(false);
                      }}
                    >
                      New Account?
                    </a>
                  ) : (
                    <div />
                  )}
                </div>
              </div>

              <div className="mt-10 flex">
                <div className="flex-1">
                  <button
                    className={classnames(
                      'p-3 tracking-wide text-white rounded-full w-full flex items-center justify-center',
                      {
                        'bg-teal-600 hover:bg-teal-700': !isLoading,
                        'bg-gray-600': isLoading,
                      }
                    )}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      <ReactLoading
                        type={'cylon'}
                        color={'white'}
                        height={30}
                        width={30}
                        className="inline-block"
                      />
                    ) : (
                      <p>Login now</p>
                    )}
                  </button>
                </div>
                <div className="flex-1">
                  <button
                    className="p-3 w-full text-gray-800 tracking-wide"
                    type="button"
                    onClick={() => {
                      history.push('/register');
                    }}
                  >
                    Create account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
