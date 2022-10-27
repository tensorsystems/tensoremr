/* eslint-disable-next-line */

import Logo from '../img/logo_dark.png';

import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PocketBaseClient from '../pocketbase-client';

import { useNotificationDispatch } from '@tensoremr/notification';
import {
  AddressRecord,
  OrganizationRecord,
} from '../../types/pocketbase-types';
import { useState } from 'react';
import OrganizationDetailsForm from './OrganizationDetailsForm';
import AdminAccountForm from './AdminAccountForm';
import { pocketbaseErrorMessage } from '../util';
import { ClientResponseError } from 'pocketbase';

export function GetStartedPage() {
  const match = useRouteMatch();
  const location = useLocation();
  const notifDispatch = useNotificationDispatch();
  const history = useHistory();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const codingsQuery = useQuery(['organizationTypes'], () =>
    PocketBaseClient.records.getList('codings', 1, 50, {
      filter: `system='http://terminology.hl7.org/CodeSystem/organization-type'`,
    })
  );

  const identifierQuery = useQuery(['identifier'], () =>
    PocketBaseClient.records.getList('codings', 1, 1, {
      filter: `code='XX'`,
    })
  );

  const handleFormSubmit = (input: any) => {
    setIsLoading(true);

    if (location.pathname === '/get-started/organization') {
      createOrganization(input);
      return;
    }

    if (location.pathname === '/get-started/admin') {
      createAdmin(input);
      return;
    }
  };

  // Create organization
  const createOrganization = async (input: any) => {
    try {
      const identifierCode = identifierQuery.data?.items[0];

      if (!identifierCode) {
        throw new Error('Something went wrong');
      }

      const telecomResult = await PocketBaseClient.records.create(
        'contact_points',
        {
          system: 'phone',
          value: input.contactNumber,
          use: 'work',
          rank: 1,
        }
      );

      const emailResult = await PocketBaseClient.records.create(
        'contact_points',
        {
          system: 'email',
          value: input.email,
          use: 'work',
          rank: 1,
        }
      );

      const address: AddressRecord = {
        use: 'work',
        type: 'physical',
        line: input.streetAddress,
        line2: input.streetAddress2,
        city: input.city,
        district: input.district,
        state: input.state,
        country: input.country,
      };

      const addressResult = await PocketBaseClient.records.create(
        'address',
        address
      );

      const organization: OrganizationRecord = {
        identifier: identifierCode.id,
        active: true,
        primary: true,
        type: input.type,
        name: input.name,
        telecom: telecomResult.id,
        email: emailResult.id,
        address: addressResult.id,
      };

      await PocketBaseClient.records.create('organization', organization);

      setIsLoading(false);
      history.push('/get-started/admin');
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

  // Create admin
  const createAdmin = async (input: any) => {
    try {
      if (input.password !== input.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const userResult = await PocketBaseClient.users.create({
        email: input.email,
        password: input.password,
        passwordConfirm: input.confirmPassword,
      });

      if (userResult.profile) {
        const humanNameResult = await PocketBaseClient.records.create(
          'human_names',
          {
            use: 'official',
            text: input.givenName + ' ' + input.familyName,
            family: input.familyName,
            given: input.givenName,
          }
        );

        const telecomResult = await PocketBaseClient.records.create(
          'contact_points',
          {
            system: 'phone',
            value: input.contactNumber,
            use: 'work',
            rank: 1,
          }
        );

        await PocketBaseClient.records.update(
          'profiles',
          userResult.profile.id,
          {
            role: 'Admin',
            active: true,
            name: humanNameResult.id,
            telecom: telecomResult.id,
            gender: input.gender,
          }
        );

        setIsLoading(false);
        history.replace('/');
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
    <div className="bg-gray-700 flex items-center justify-center h-screen">
      <div className="bg-gray-700 w-screen p-4 md:p-52 z-10">
        <div className="bg-white rounded-md shadow-lg h-full w-full z-20 py-6 px-10 ">
          <div className="container mx-auto">
            <div className="flex items-center justify-center">
              <div className="flex space-x-4 items-center text-red-600 no-underline hover:no-underline font-bold md:text-2xl lg:text-4xl">
                <div>
                  <img alt="Logo" className="h-auto w-44" src={Logo} />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className=" text-teal-700 tracking-wide font-thin">
                Let's get you started!
              </p>
            </div>

            <Switch>
              <Route path={`${match.path}/organization`}>
                <OrganizationDetailsForm
                  organizationTypes={codingsQuery.data?.items}
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              </Route>
              <Route path={`${match.path}/admin`}>
                <AdminAccountForm
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              </Route>
              <Route path={`${match.path}`}>
                <Redirect to={`${match.path}/organization`} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStartedPage;
