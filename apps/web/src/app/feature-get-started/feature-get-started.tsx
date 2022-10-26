/* eslint-disable-next-line */
import { Label, Select, TextInput } from 'flowbite-react';
import Logo from '../img/logo_dark.png';
import {
  PhoneIcon,
  MailIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { Button } from '@tensoremr/ui-components';
import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import PocketBaseClient from '../pocketbase-client';

import { useForm } from 'react-hook-form';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  AddressRecord,
  ContactPointsRecord,
  OrganizationRecord,
} from '../../types/pocketbase-types';
import { useState } from 'react';
import { OrganizationDetailsForm } from './OrganizationDetailsForm';

export function GetStartedPage() {
  const match = useRouteMatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();

  const notifDispatch = useNotificationDispatch();

  const query = useQuery(['organizationTypes'], () =>
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

    if (location.pathname === '/get-started/admin') {
      createAdmin(input);
    }

    if (location.pathname === '/get-started/organization') {
      createOrganization(input);
    }
  };

  const createOrganization = async (input: any) => {
    try {
      const identifierCode = identifierQuery.data?.items[0];

      if (!identifierCode) {
        throw new Error('Something went wrong');
      }

      const telecom: ContactPointsRecord = {
        system: 'phone',
        value: input.contactNumber,
        use: 'work',
        rank: 1,
      };

      const telecomResult = await PocketBaseClient.records.create(
        'contact_points',
        telecom
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
        address: addressResult.id,
      };

      await PocketBaseClient.records.create('organization', organization);

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);

      if (e.message) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: e.message,
          variant: 'failure',
        });
        return;
      }

      if (e.data) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: e.data.message,
          variant: 'failure',
        });
      }
    }
  };

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
      }

      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);

      if (e.message) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: e.message,
          variant: 'failure',
        });
        return;
      }

      if (e.data) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: e.data.message,
          variant: 'failure',
        });
      }
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
                <Transition
                  show={true}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <OrganizationDetailsForm
                    organizationTypes={query.data?.items}
                    isLoading={isLoading}
                  />
                </Transition>
              </Route>
              <Route path={`${match.path}/admin`}>
                <Transition
                  show={true}
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <AdminAccountForm isLoading={isLoading} />
                </Transition>
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



interface AdminAccountFormProps {
  isLoading: boolean;
}

function AdminAccountForm(props: AdminAccountFormProps) {
  const { isLoading } = props;
  const { register, handleSubmit } = useForm();

  const onSubmit = (input: any) => {
    console.log('Input', input);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex space-x-5 items-center mt-5">
        <div className="w-full">
          <div className="block">
            <Label htmlFor="givenName" value="Given Name" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="givenName"
            type="text"
            name="givenName"
            placeholder="Given Name"
            ref={register({ required: true })}
          />
        </div>
        <div className="w-full">
          <div className="block">
            <Label htmlFor="familyName" value="Family name" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="familyName"
            type="text"
            name="familyName"
            placeholder="Family name"
            ref={register({ required: true })}
          />
        </div>
      </div>
      <div className="mt-3">
        <div className="block">
          <Label htmlFor="email" value="Admin Email" />{' '}
          <span className="text-red-600">*</span>
        </div>
        <TextInput
          required
          id="email"
          type="email"
          name="email"
          icon={MailIcon}
          placeholder="Email"
          ref={register({ required: true })}
        />
      </div>

      <div className="mt-3">
        <div></div>
        <div className="block">
          <Label htmlFor="contactNumber" value="Contact Number" />{' '}
          <span className="text-red-600">*</span>
        </div>
        <TextInput
          required
          type="tel"
          id="contactNumber"
          name="contactNumber"
          icon={PhoneIcon}
          placeholder="0911111111"
          ref={register({ required: true })}
        />
      </div>
      <div className="mt-3">
        <div className="block">
          <Label htmlFor="gender" value="Gender" />
        </div>
        <Select ref={register} name="gender" icon={UserIcon} id="gender">
          <option value={'male'}>Male</option>
          <option value={'female'}>Female</option>
          <option value={'other'}>Other</option>
        </Select>
      </div>

      <div className="mt-3">
        <div className="block">
          <Label htmlFor="password" value="Password" />
        </div>
        <TextInput
          required
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          ref={register({ required: true })}
        />
      </div>

      <div className="mt-3">
        <div className="block">
          <Label htmlFor="confirmPassword" value="Confirm Password" />
        </div>
        <TextInput
          required
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          ref={register({
            required: true,
            minLength: {
              value: 6,
              message: 'Password must have at least 6 characters',
            },
          })}
        />
      </div>
      <div className="mt-5">
        <Button
          pill={true}
          loadingText={'Loading'}
          loading={isLoading}
          type="submit"
          text="Next"
          icon="arrow_forward"
          variant="filled"
        />
      </div>
    </form>
  );
}

export default GetStartedPage;
