/* eslint-disable-next-line */
import { Label, Select, TextInput } from 'flowbite-react';
import Logo from '../img/logo_dark.png';
import {
  OfficeBuildingIcon,
  GlobeIcon,
  MapIcon,
  PhoneIcon,
  MailIcon,
  LibraryIcon,
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
import { PocketBaseClient } from '../pocketbase-client';
import { Record, User } from 'pocketbase';
import { useForm } from 'react-hook-form';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  AddressRecord,
  ContactPointsRecord,
  HumanNamesRecord,
  OrganizationRecord,
  ProfilesRecord,
} from '../../types/pocketbase-types';
import { useState } from 'react';

export function GetStartedPage() {
  const match = useRouteMatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();

  const { register, handleSubmit } = useForm();
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

            <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                      register={register}
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
                    <AdminAccountForm register={register} />
                  </Transition>
                </Route>
                <Route path={`${match.path}`}>
                  <Redirect to={`${match.path}/organization`} />
                </Route>
              </Switch>

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
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrganizationDetailsFormProps {
  organizationTypes: Array<Record> | undefined;
  register: any;
}

function OrganizationDetailsForm(props: OrganizationDetailsFormProps) {
  const { organizationTypes, register } = props;

  return (
    <div>
      <div className="grid grid-cols-2 mt-5 gap-x-6 gap-y-2">
        <div>
          <div className="block">
            <Label htmlFor="name" value="Organization Name" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            id="name"
            name="name"
            type="text"
            ref={register({ required: true })}
            required
            placeholder="ABC Hospital"
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="type" value="Organization Type" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <Select
            required
            id="type"
            name="type"
            icon={LibraryIcon}
            ref={register({ required: true })}
          >
            {organizationTypes?.map((type) => (
              <option value={type.id} key={type.id}>
                {type.display}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="block">
            <Label htmlFor="contactNumber" value="Contact Number" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="contactNumber"
            type="tel"
            name="contactNumber"
            placeholder="0911111111"
            icon={PhoneIcon}
            ref={register({ required: true })}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="email" value="Contact Email" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="email"
            type="email"
            name="email"
            placeholder="info@organization.org"
            icon={MailIcon}
            ref={register({ required: true })}
          />
        </div>
      </div>

      <hr className="my-5" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div>
          <div className="block">
            <Label htmlFor="country" value="Country" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="country"
            name="country"
            type="text"
            placeholder="Country"
            icon={GlobeIcon}
            ref={register({ required: true })}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="state" value="State" />
          </div>
          <TextInput
            id="state"
            name="state"
            type="text"
            placeholder="State"
            icon={MapIcon}
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="district" value="District" />
          </div>
          <TextInput
            id="district"
            name="district"
            type="text"
            placeholder="District"
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="city" value="City" />
          </div>
          <TextInput
            id="city"
            name="city"
            type="text"
            placeholder="City"
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="streetAddress" value="Street Address" />
          </div>
          <TextInput
            id="district"
            name="streetAddress"
            type="text"
            icon={OfficeBuildingIcon}
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="streetAddress2" value="Street Address 2" />
          </div>
          <TextInput
            id="streetAddress2"
            name="streetAddress2"
            type="text"
            icon={OfficeBuildingIcon}
            ref={register}
          />
        </div>
      </div>
    </div>
  );
}

interface AdminAccountFormProps {
  register: any;
}

function AdminAccountForm(props: AdminAccountFormProps) {
  const { register } = props;

  return (
    <div>
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
    </div>
  );
}

export default GetStartedPage;
