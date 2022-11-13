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

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CalendarIcon,
  CalculatorIcon,
  ExclamationIcon,
} from '@heroicons/react/outline';
import { Menu } from '@headlessui/react';
import {
  AddressRecord,
  ContactPointsRecord,
  ContactsRecord,
  FileUpload,
  Page,
  PatientContactsRecord,
  PatientsRecord,
} from '@tensoremr/models';
import { useHistory, useLocation } from 'react-router-dom';
import {
  IFileUploader,
  AppointmentFormContainer,
  Button,
  MenuComponent,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useEffect } from 'react';
import { newPatientCache } from '@tensoremr/cache';
import PocketBaseClient from '../pocketbase-client';
import { format, parseISO, subMonths, subYears } from 'date-fns';
import { ClientResponseError, Record } from 'pocketbase';
import { pocketbaseErrorMessage } from '../util';
import { useQuery } from '@tanstack/react-query';
import cn from 'classnames';

interface Props {
  onAddPage: (page: Page) => void;
}

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export const PatientDemographyForm: React.FC<Props> = ({ onAddPage }) => {
  const history = useHistory();
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const query = useRouterQuery();
  const updateMrn = query.get('mrn');

  // State
  const [updateId, setUpdateId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ageInput, setAgeInput] = useState<'default' | 'manual' | 'months'>(
    'default'
  );
  const [scheduleOnSave, setScheduleSave] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Array<IFileUploader>>([]);
  const [paperRecordDocument, setPaperRecordDocument] = useState<
    Array<IFileUploader>
  >([]);
  const [similarPatients, setSimilarPatients] = useState<Array<Record>>([]);
  const [ignoreSimilarPatients, setIgnoreSimilarPatients] =
    useState<boolean>(false);

  const [telecomsCount, setTelecomsCount] = useState<number>(1);
  const [addressesCount, setAddressesCount] = useState<number>(1);
  const [contactsCount, setContactsCount] = useState<number>(1);

  // Query
  const gendersQuery = useQuery(['genders'], () =>
    PocketBaseClient.records.getFullList('codings', 100, {
      filter: `system='http://hl7.org/fhir/administrative-gender'`,
    })
  );

  const martialStatusQuery = useQuery(['martialStatus'], () =>
    PocketBaseClient.records.getFullList('codings', 100, {
      filter: `system='http://terminology.hl7.org/CodeSystem/v3-MaritalStatus'`,
    })
  );

  const contactRelationshipsQuery = useQuery(['contactRelationships'], () =>
    PocketBaseClient.records.getFullList('codings', 100, {
      filter: `system='http://terminology.hl7.org/CodeSystem/v2-0131'`,
    })
  );

  const fetchUpdatePatient = async (updateId: string) => {
    try {
      const result = await PocketBaseClient.records.getList('patients', 1, 1, {
        mrn: updateId,
      });

      const data = result.items[0];

      setUpdateId(data.id);

      setValue('nameTitle', data.nameTitle);
      setValue('firstName', data.firstName);
      setValue('middleName', data.middleName);
      setValue('lastName', data.lastName);
      setValue('gender', data.gender);
      setValue('phoneNumber', data.phoneNumber);
      setValue('phoneNumber2', data.phoneNumber2);
      setValue('homePhoneNumber', data.homePhoneNumber);
      setValue('email', data.email);
      setValue('birthDate', format(parseISO(data.birthDate), 'yyyy-MM-dd'));
      setValue('identificationNo', data.identificationNo);
      setValue('identificationType', data.identificationType);
      setValue('country', data.country);
      setValue('city', data.city);
      setValue('subCity', data.subCity);
      setValue('state', data.state);
      setValue('zone', data.zone);
      setValue('emergencyContactName', data.emergencyContactName);
      setValue(
        'emergencyContactRelationship',
        data.emergencyContactRelationship
      );
      setValue('emergencyContactPhone', data.emergencyContactPhone);
      setValue('emergencyContactMemo', data.emergencyContactMemo);
      setValue('memo', data.memo);
      setValue('status', data.status);
      setValue('occupation', data.occupation);
      setValue('martialStatus', data.martialStatus);
      setValue('streetAddress', data.streetAddress);
      setValue('streetAddress2', data.streetAddress2);
      setValue('postalZipCode', data.postalZipCode);
      setValue('houseNumber', data.houseNumber);
      setValue('mrn', data.mrn);
    } catch (error) {
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

  useEffect(() => {
    if (updateMrn) {
      fetchUpdatePatient(updateMrn);
    }
  }, [updateMrn]);

  const values = watch();

  useEffect(() => {
    newPatientCache(values);
  }, [values]);

  const resetAll = () => {
    reset();
    setAgeInput('default');
    setDocuments([]);
    setPaperRecordDocument([]);
    setScheduleSave(false);
  };

  const findSimilarPatients = async (data: any) => {
    try {
      const similarPatients = await PocketBaseClient.records.getList(
        'patients',
        0,
        10,
        {
          filter: `firstName~"${data.firstName}" && lastName~"${data.lastName}"`,
        }
      );

      return similarPatients.items;
    } catch (error) {
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

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    // if (!ignoreSimilarPatients && !updateId) {
    //   const result = await findSimilarPatients(data);
    //   if (result) {
    //     setSimilarPatients(result);
    //     if (result.length > 0) {
    //       setIsLoading(false);
    //       return;
    //     }
    //   }
    // }

    // const firstName =
    //   data.firstName.charAt(0).toUpperCase() +
    //   data.firstName.slice(1).toLowerCase();

    // const lastName =
    //   data.lastName.charAt(0).toUpperCase() +
    //   data.lastName.slice(1).toLowerCase();

    // data.firstName = firstName;
    // data.lastName = lastName;

    if (ageInput === 'manual') {
      data.birthDate = subYears(new Date(), data.birthDate as number);
    } else if (ageInput === 'months') {
      data.birthDate = subMonths(new Date(), data.birthDate as number);
    }

    data.status = 'active';

    try {
      // Gender
      const genderDisplay = gendersQuery.data?.find(
        (e) => e.id === data.gender
      )?.display;

      if (genderDisplay) {
        data.genderDisplay = genderDisplay;
      } else {
        throw new Error('Something went wrong');
      }

      // Martial Status
      const martialStatusDisplay = martialStatusQuery.data?.find(
        (e) => e.id === data.martialStatus
      )?.display;
      if (martialStatusDisplay) {
        data.martialStatusDisplay = martialStatusDisplay;
      }

      let result;
      if (!updateId) {
        data.mrn = parseInt(
          window.crypto.getRandomValues(new Uint8Array(3)).join('')
        );

        // Save telecoms
        const telecomRequests: Array<Promise<Record>> = [];
        data.telecom.forEach((tel: any) => {
          const input: ContactPointsRecord = {
            system: tel.system,
            value: tel.value,
            use: tel.use,
            rank: tel.rank,
          };

          telecomRequests.push(
            PocketBaseClient.records.create('contact_points', input, {
              $autoCancel: false,
            })
          );
        });

        const telecomResults = await Promise.all(telecomRequests);

        if (telecomRequests) {
          data.telecom = telecomResults.map((e) => e.id);
        }

        // Save addresses
        const addressRequests: Array<Promise<Record>> = [];
        data.address.forEach((addr: any) => {
          const input: AddressRecord = {
            ...addr,
          };

          addressRequests.push(
            PocketBaseClient.records.create('address', input, {
              $autoCancel: false,
            })
          );
        });

        const addressResults = await Promise.all(addressRequests);
        if (addressResults) {
          data.address = addressResults.map((e) => e.id);
        }

        // Save contacts
        const contactRequests: Array<Promise<Record>> = [];

        for (const contact of data.contact) {
          const contactName = await PocketBaseClient.records.create(
            'human_names',
            {
              family: contact.familyName,
              given: contact.givenName,
            }
          );

          const contactTelecom = await PocketBaseClient.records.create(
            'contact_points',
            {
              system: contact.telecomSystem,
              value: contact.telecomValue,
              use: contact.telecomUse,
            }
          );

          const contactAddress = await PocketBaseClient.records.create(
            'address',
            {
              use: contact.addressUse,
              type: contact.addressType,
              text: contact.addressText,
              line: contact.addressLine,
              line2: contact.addressLine2,
              city: contact.addressCity,
              district: contact.addressDistrict,
              state: contact.addressState,
              postalCode: contact.addressPostalCode,
              country: contact.addressCountry,
            }
          );

          const input: PatientContactsRecord = {
            relationship: contact.relationship,
            name: contactName.id,
            telecom: contactTelecom.id,
            address: contactAddress.id,
          };

          contactRequests.push(
            PocketBaseClient.records.create('patient_contacts', input, {
              $autoCancel: false,
            })
          );
        }

        const contactResults = await Promise.all(contactRequests);
        if (contactResults) {
          data.contact = contactResults.map((e) => e.id);
        }

        result = await PocketBaseClient.records.create('patients', {
          ...data,
        });
      } else {
        result = await PocketBaseClient.records.update('patients', updateId, {
          ...data,
        });
      }

      if (result.id) {
        const patient = result.export();

        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: `Patient ${patient.namePrefix} ${patient.nameGiven} ${patient.nameFamily} has been saved successfully`,
          variant: 'success',
        });

        resetAll();

        if (scheduleOnSave) {
          bottomSheetDispatch({
            type: 'show',
            snapPoint: 1000,
            children: (
              <AppointmentFormContainer
                patientId={patient?.id}
                onSuccess={() => null}
                onCancel={() => {
                  bottomSheetDispatch({ type: 'hide' });
                }}
                onFailure={(message) =>
                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Error',
                    notifSubTitle: message,
                    variant: 'failure',
                  })
                }
              />
            ),
          });
        } else {
          const page: Page = {
            title: `Patient - ${patient?.firstName} ${patient?.lastName}`,
            cancellable: true,
            route: `/patients/${patient?.id}/appointments`,
            icon: 'group',
          };

          onAddPage(page);
          history.replace(`/patients/${patient?.id}/appointments`);
        }
      } else {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: 'Something went wrong',
          variant: 'failure',
        });
      }
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.isAbort) {
          console.error('Aborted');
        }
        if (!error.isAbort) {
          notifDispatch({
            type: 'showNotification',
            notifTitle: 'Error',
            notifSubTitle: pocketbaseErrorMessage(error) ?? '',
            variant: 'failure',
          });
        }
      } else if (error instanceof Error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-gray-50 p-4 rounded-md shadow-lg">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  General Info
                </h3>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 shadow-md">
              <div className="shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-2">
                      <label
                        htmlFor="nameGiven"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Given name <span className="text-red-600">*</span>
                      </label>
                      <input
                        required
                        id="nameGiven"
                        type="text"
                        {...register('nameGiven', { required: true })}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="nameFamily"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Family name <span className="text-red-600">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        id="nameFamily"
                        {...register('nameFamily', { required: true })}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="namePrefix"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name prefix
                      </label>
                      <input
                        type="text"
                        id="namePrefix"
                        {...register('namePrefix')}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="birthDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <span>
                          {ageInput === 'default' && 'Date of Birth'}
                          {ageInput === 'manual' && 'Age In Years'}
                          {ageInput === 'months' && 'Age In Months'}
                        </span>{' '}
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="flex mt-1">
                        <input
                          required
                          autoComplete="off"
                          type={ageInput === 'default' ? 'date' : 'number'}
                          {...register('birthDate', { required: true })}
                          onWheel={(event) => event.currentTarget.blur()}
                          className="p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md rounded-r-none "
                        />
                        <MenuComponent
                          title={'Options'}
                          color={'bg-gray-500 text-white hover:bg-gray-600'}
                          rounded={'rounded-md rounded-l-none'}
                          menus={
                            <div className="px-1 py-1">
                              <Menu.Item>
                                <button
                                  className={`${
                                    ageInput === 'default'
                                      ? 'bg-teal-500 text-white'
                                      : 'text-gray-900'
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                  onClick={() => setAgeInput('default')}
                                >
                                  <CalendarIcon
                                    className="w-5 h-5 mr-2 text-teal-700"
                                    aria-hidden="true"
                                  />
                                  Date of Birth
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    ageInput === 'manual'
                                      ? 'bg-teal-500 text-white'
                                      : 'text-gray-900'
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                  onClick={() => setAgeInput('manual')}
                                >
                                  <CalculatorIcon
                                    className="w-5 h-5 mr-2 text-teal-700"
                                    aria-hidden="true"
                                  />
                                  Enter Age In Years
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  className={`${
                                    ageInput === 'months'
                                      ? 'bg-teal-500 text-white'
                                      : 'text-gray-900'
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                  onClick={() => setAgeInput('months')}
                                >
                                  <CalculatorIcon
                                    className="w-5 h-5 mr-2 text-teal-700"
                                    aria-hidden="true"
                                  />
                                  Enter Age In Months
                                </button>
                              </Menu.Item>
                            </div>
                          }
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender <span className="text-red-600">*</span>
                      </label>
                      <select
                        required
                        id="gender"
                        {...register('gender', { required: true })}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option></option>
                        {gendersQuery.data?.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.display}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="martialStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Martial Status
                      </label>
                      <select
                        id="martialStatus"
                        {...register('martialStatus')}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option></option>
                        {martialStatusQuery.data?.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.display}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="deceased"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Deceased
                      </label>
                      <select
                        id="deceased"
                        {...register('deceased')}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value={'false'}>No</option>
                        <option value={'true'}>Yes</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Comment
                      </label>
                      <input
                        id="comment"
                        type="text"
                        {...register('comment')}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 flex space-x-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Telecom
                </h3>
                <button
                  type="button"
                  className="material-icons"
                  onClick={() => setTelecomsCount(telecomsCount + 1)}
                >
                  add
                </button>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 ">
              {Array(telecomsCount)
                .fill(telecomsCount)
                .map((e, index) => (
                  <div
                    key={index}
                    className={cn('overflow-scroll shadow-md', {
                      'mt-4': index !== 0,
                    })}
                  >
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <p className="text-sm text-gray-600">{`Telecom ${
                        index + 1
                      }`}</p>
                      <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="col-span-6">
                          <label
                            htmlFor="system"
                            className="block text-sm font-medium text-gray-700"
                          >
                            System <span className="text-red-600">*</span>
                          </label>
                          <select
                            id="system"
                            required
                            {...register(`telecom.${index}.system`, {
                              required: true,
                            })}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="phone">Phone</option>
                            <option value="fax">Fax</option>
                            <option value="email">Email</option>
                            <option value="pager">Pager</option>
                            <option value="url">URL</option>
                            <option value="sms">SMS</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="value"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Value <span className="text-red-600">*</span>
                          </label>
                          <input
                            required
                            id="value"
                            type="text"
                            {...register(`telecom.${index}.value`, {
                              required: true,
                            })}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="use"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Use
                          </label>
                          <select
                            id="use"
                            {...register(`telecom.${index}.use`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="rank"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Rank
                          </label>
                          <select
                            id="rank"
                            {...register(`telecom.${index}.rank`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 flex space-x-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Address
                </h3>
                <button
                  type="button"
                  className="material-icons"
                  onClick={() => setAddressesCount(addressesCount + 1)}
                >
                  add
                </button>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {Array(addressesCount)
                .fill(addressesCount)
                .map((e, index) => (
                  <div
                    key={index}
                    className={cn('overflow-scroll shadow-md', {
                      'mt-4': index !== 0,
                    })}
                  >
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <p className="text-sm text-gray-600">{`Address ${
                        index + 1
                      }`}</p>
                      <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Type
                          </label>
                          <select
                            id="addressType"
                            {...register(`address.${index}.type`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="postal">Postal</option>
                            <option value="physical">Physical</option>
                            <option value="both">Both</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressUse"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Use
                          </label>
                          <select
                            id="addressUse"
                            {...register(`address.${index}.use`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressText"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Text
                          </label>
                          <input
                            id="addressText"
                            type="text"
                            {...register(`address.${index}.text`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressLine"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Line
                          </label>
                          <input
                            id="addressLine"
                            type="text"
                            {...register(`address.${index}.line`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressLine2"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Line 2
                          </label>
                          <input
                            id="addressLine2"
                            type="text"
                            {...register(`address.${index}.line2`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressCity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <input
                            id="addressCity"
                            type="text"
                            {...register(`address.${index}.city`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressDistrict"
                            className="block text-sm font-medium text-gray-700"
                          >
                            District
                          </label>
                          <input
                            id="addressDistrict"
                            type="text"
                            {...register(`address.${index}.district`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressState"
                            className="block text-sm font-medium text-gray-700"
                          >
                            State
                          </label>
                          <input
                            id="addressState"
                            type="text"
                            {...register(`address.${index}.state`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressPostalCode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Postal Code
                          </label>
                          <input
                            id="addressPostalCode"
                            type="text"
                            {...register(`address.${index}.postalCode`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressCountry"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country
                          </label>
                          <input
                            id="addressCountry"
                            type="text"
                            {...register(`address.${index}.country`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 flex space-x-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Contacts
                </h3>
                <button
                  type="button"
                  className="material-icons"
                  onClick={() => setContactsCount(contactsCount + 1)}
                >
                  add
                </button>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 shadow-md">
              {Array(contactsCount)
                .fill(contactsCount)
                .map((e, index) => (
                  <div
                    key={index}
                    className={cn('overflow-scroll shadow-md', {
                      'mt-4': index !== 0,
                    })}
                  >
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <p className="text-sm text-gray-600">{`Contact ${
                        index + 1
                      }`}</p>
                      <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="relationship"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Relationship
                          </label>
                          <select
                            id="relationship"
                            {...register(`contact.${index}.relationship`)}
                            className="mt-1 block w-full py-[6px] px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option></option>
                            {contactRelationshipsQuery.data?.map((e) => (
                              <option value={e?.id} key={e?.id}>
                                {e?.display}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactGivenName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Given Name
                          </label>
                          <input
                            id="text"
                            type="text"
                            {...register(`contact.${index}.givenName`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactFamilyName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Family Name
                          </label>
                          <input
                            id="text"
                            type="text"
                            {...register(`contact.${index}.familyName`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactTelecomSystem"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Telecom System
                          </label>
                          <select
                            id="contactTelecomSystem"
                            {...register(`contact.${index}.telecomSystem`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="phone">Phone</option>
                            <option value="fax">Fax</option>
                            <option value="email">Email</option>
                            <option value="pager">Pager</option>
                            <option value="url">URL</option>
                            <option value="sms">SMS</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactTelecomValue"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Telecom Value
                          </label>
                          <input
                            id="contactTelecomValue"
                            type="text"
                            {...register(`contact.${index}.telecomValue`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactTelecomValue"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Telecom Use
                          </label>
                          <select
                            id="contactTelecomValue"
                            {...register(`contact.${index}.telecomUse`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Type
                          </label>
                          <select
                            id="contactAddressType"
                            {...register(`contact.${index}.addressType`)}
                            className="mt-1 block w-full py-[6px] px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="postal">Postal</option>
                            <option value="physical">Physical</option>
                            <option value="both">Both</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressUse"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Use
                          </label>
                          <select
                            id="contactAddressUse"
                            {...register(`contact.${index}.addressUse`)}
                            className="mt-1 block w-full py-[6px] px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressText"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address
                          </label>
                          <input
                            id="contactAddressText"
                            type="text"
                            {...register(`contact.${index}.addressText`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressLine"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Line
                          </label>
                          <input
                            id="contactAddressLine"
                            type="text"
                            {...register(`contact.${index}.addressLine`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressLine2"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Line 2
                          </label>
                          <input
                            id="contactAddressLine2"
                            type="text"
                            {...register(`contact.${index}.addressLine2`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressCity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <input
                            id="contactAddressCity"
                            type="text"
                            {...register(`contact.${index}.addressCity`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressDistrict"
                            className="block text-sm font-medium text-gray-700"
                          >
                            District
                          </label>
                          <input
                            id="contactAddressDistrict"
                            type="text"
                            {...register(`contact.${index}.addressDistrict`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressState"
                            className="block text-sm font-medium text-gray-700"
                          >
                            State
                          </label>
                          <input
                            id="contactAddressState"
                            type="text"
                            {...register(`contact.${index}.addressState`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressPostalCode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Postal Code
                          </label>
                          <input
                            id="contactAddressPostalCode"
                            type="text"
                            {...register(`contact.${index}.addressPostalCode`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressCountry"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country
                          </label>
                          <input
                            id="contactAddressCountry"
                            type="text"
                            {...register(`contact.${index}.addressCountry`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1"></div>

          <div className="mt-5 md:mt-0 md:col-span-2 flex space-x-6">
            <div className="py-3 bg-gray-50 w-full">
              <div
                hidden={ignoreSimilarPatients || similarPatients.length === 0}
                className="mb-4 bg-yellow-100 p-3 rounded-md shadow-sm"
              >
                <div className="flex space-x-2 items-center  ml-4">
                  <ExclamationIcon className="w-4 h-4" />
                  <p className="text-sm text-yellow-500 font-semibold">
                    Similar Patients Found
                  </p>
                </div>
                <div className="mt-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="">
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          MRN
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Phone Number
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Date of Birth
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {similarPatients.map((e) => (
                        <tr key={e.id} className="hover:bg-yellow-200">
                          <td className="px-6 py-2 text-sm text-yellow-800 underline cursor-pointer">
                            {e.mrn}
                          </td>
                          <td className="px-6 py-2 text-sm text-yellow-800">
                            {`${e.firstName} ${e.lastName}`}
                          </td>
                          <td className="px-6 py-2 text-sm text-yellow-800">
                            {e.phoneNumber}
                          </td>
                          <td className="px-6 py-2 text-sm text-yellow-800">
                            {e.birthDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="ml-6 mt-2 underline">
                    <button
                      type="button"
                      onClick={() => {
                        setIgnoreSimilarPatients(true);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 rounded-sm px-4 text-yellow-200 shadow-sm"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              </div>

              <Button
                pill={true}
                loading={isLoading}
                loadingText={'Saving'}
                type="submit"
                text={'Save'}
                icon="save"
                variant="filled"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
