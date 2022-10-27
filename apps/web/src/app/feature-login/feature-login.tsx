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
import { useNotificationDispatch } from '@tensoremr/notification';
import { useHistory } from 'react-router-dom';
import Logo from '../img/logo_dark.png';
import classnames from 'classnames';
import { OrganizationDetails } from '@tensoremr/models';
import PocketBaseClient from '../pocketbase-client';
import { ClientResponseError } from 'pocketbase';
import { pocketbaseErrorMessage } from '../util';
import { Spinner } from 'flowbite-react';
import { useQuery } from '@tanstack/react-query';

export const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<any>();
  const notifDispatch = useNotificationDispatch();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const organizationQuery = useQuery(['organization'], () =>
    PocketBaseClient.records.getList('organization', 1, 1)
  );

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // user authentication via email/pass
      const userAuthData = await PocketBaseClient.users.authViaEmail(
        data.email,
        data.password
      );

      if (userAuthData.token) {
        setIsLoading(false);
        localStorage.setItem('accessToken', userAuthData.token as string);

        const organization = organizationQuery.data?.items[0];
        if (organization) {
          localStorage.setItem(
            'organizationDetails',
            JSON.stringify(organization)
          );
        }

        window.location.replace('/');
      } else {
        throw new Error('Could not log in');
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof ClientResponseError) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: pocketbaseErrorMessage(error) ?? '',
          variant: 'failure',
        });
      } else if (error instanceof Error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      }

      console.error(error);
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-600 p-16">
      <div className="h-full w-full bg-white rounded-lg shadow-xl p-5 overflow-auto bg-login bg-center bg-cover">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img alt="Logo" className="h-auto w-44" src={Logo} />
          </div>
          <div className="flex justify-center ml-16 mt-10">
            <div className="px-7 flex-initial">
              <p className="text-3xl text-gray-800 font-bold tracking-wide">
                Welcome Back
              </p>

              <p className="text-teal-500 font-semibold">
                {organizationQuery.data?.items[0]?.name}
              </p>

              <div className="mt-16 w-full z-20 ">
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

              <div className="mt-10 flex">
                <div className="flex-1">
                  <button
                    className={classnames(
                      'p-3 tracking-wide text-white rounded-full w-full flex items-center justify-center',
                      {
                        'bg-teal-600 hover:bg-teal-700': !isLoading,
                        'bg-teal-700': isLoading,
                      }
                    )}
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner color="warning" aria-label="Button loading" />
                    ) : (
                      <p>Login now</p>
                    )}
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
