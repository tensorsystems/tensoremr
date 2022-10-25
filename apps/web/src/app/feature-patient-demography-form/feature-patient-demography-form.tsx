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
import {  FileUpload, Page } from '@tensoremr/models';
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
import { PocketBaseClient } from '../pocketbase-client';
import { format, parseISO, subMonths, subYears } from 'date-fns';
import _ from 'lodash';
import { Record } from 'pocketbase';
import { PatientsRecord } from '../../types/pocketbase-types';

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const query = useRouterQuery();
  const updateMrn = query.get('mrn');

  const [updateId, setUpdateId] = useState<string>();

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<PatientsRecord>();

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
      setValue('dateOfBirth', format(parseISO(data.dateOfBirth), 'yyyy-MM-dd'));
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
    } catch (e) {
      console.log(e);
      handleError(e);
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
    } catch (e: any) {
      console.log(e.data);
      handleError(e);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    if (!ignoreSimilarPatients && !updateId) {
      const result = await findSimilarPatients(data);
      if (result) {
        setSimilarPatients(result);
        if (result.length > 0) {
          setIsLoading(false);
          return;
        }
      }
    }

    if (
      paperRecordDocument.length > 0 &&
      paperRecordDocument[0].fileObject !== undefined
    ) {
      const file: FileUpload = {
        file: paperRecordDocument[0].fileObject,
        name: paperRecordDocument[0].name,
      };

      data.paperRecordDocument = file;
    }

    if (documents.length > 0) {
      const files: Array<FileUpload> = documents
        .filter((e) => e.fileObject !== undefined)
        .map((e) => ({
          file: e.fileObject,
          name: e.name,
        }));

      data.documents = files;
    }

    const firstName =
      data.firstName.charAt(0).toUpperCase() +
      data.firstName.slice(1).toLowerCase();

    const lastName =
      data.lastName.charAt(0).toUpperCase() +
      data.lastName.slice(1).toLowerCase();

    data.firstName = firstName;
    data.lastName = lastName;

    if (ageInput === 'manual') {
      data.dateOfBirth = subYears(new Date(), data.dateOfBirth as number);
    } else if (ageInput === 'months') {
      data.dateOfBirth = subMonths(new Date(), data.dateOfBirth as number);
    }

    data.status = 'active';

    setIsLoading(false);

    try {
      let result;
      if (!updateId) {
        data.mrn = parseInt(
          window.crypto.getRandomValues(new Uint8Array(3)).join('')
        );

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
          notifSubTitle: `Patient ${patient.firstName} ${patient.lastName} has been saved successfully`,
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
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ),
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
    } catch (e: any) {
      const error = e?.data.data;

      if (error) {
        for (const key in error) {
          if (key) {
            notifDispatch({
              type: 'showNotification',
              notifTitle: 'Error',
              notifSubTitle: key + ' ' + error[key].message.toLowerCase(),
              variant: 'failure',
            });
          }
        }
      }
    }
  };

  const handleError = (error: any) => {
    const errorData = error?.data.data;
    if (!_.isEmpty(errorData)) {
      for (const key in error) {
        if (key) {
          notifDispatch({
            type: 'showNotification',
            notifTitle: 'Error',
            notifSubTitle: key + ' ' + error[key].message.toLowerCase(),
            variant: 'failure',
          });
        }
      }
    } else {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error?.message,
        variant: 'failure',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-gray-50 p-4 rounded-md shadow-lg">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Demographic
                </h3>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 shadow-md">
              <div className="shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        ref={register({ required: true })}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="middleName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Middle name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        id="middleName"
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        ref={register({ required: true })}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="dateOfBirth"
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
                          name="dateOfBirth"
                          type={ageInput === 'default' ? 'date' : 'number'}
                          ref={register({ required: true })}
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
                        id="gender"
                        name="gender"
                        required
                        ref={register({ required: true })}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="identificationNo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Identification number
                      </label>
                      <input
                        type="text"
                        name="identificationNo"
                        id="identificationNo"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="martialStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Martial Status
                      </label>
                      <input
                        type="text"
                        name="martialStatus"
                        id="martialStatus"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="occupation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        id="occupation"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="memo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Memo
                      </label>
                      <input
                        type="text"
                        name="memo"
                        id="memo"
                        ref={register}
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
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Contact information
                </h3>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 shadow-md">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cell phone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        required
                        ref={register({ required: true })}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="phoneNumber2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cell phone 2
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber2"
                        id="phoneNumber2"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="homePhoneNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Home Phone
                      </label>
                      <input
                        type="tel"
                        name="homePhoneNumber"
                        id="homePhoneNumber"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="country"
                        required
                        ref={register({ required: true })}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        ref={register({ required: true })}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="zone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Zone
                      </label>
                      <input
                        type="text"
                        name="zone"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="streetAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="streetAddress2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street Address 2
                      </label>
                      <input
                        type="text"
                        name="streetAddress2"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="subCity"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Sub-City
                      </label>
                      <input
                        type="text"
                        name="subCity"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="houseNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        House No
                      </label>
                      <input
                        type="text"
                        name="houseNumber"
                        id="houseNumber"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-12">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        ref={register({ required: true })}
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
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Emergency contact
                </h3>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="emergencyContactName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full name
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        id="emergencyContactName"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="emergencyContactRelationship"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Relationship to patient
                      </label>
                      <input
                        type="text"
                        name="emergencyContactRelationship"
                        id="emergencyContactRelationship"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="emergencyContactPhone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact number
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        id="emergencyContactPhone"
                        ref={register}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="emergencyContactMemo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Memo
                      </label>
                      <input
                        type="text"
                        name="emergencyContactMemo"
                        id="emergencyContactMemo"
                        ref={register}
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
                            {e.dateOfBirth}
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
