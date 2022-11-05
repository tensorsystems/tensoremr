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

import { useQuery } from '@tanstack/react-query';
import { ReferencesRecord } from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { Button } from '@tensoremr/ui-components';
import { Checkbox, Label, Radio } from 'flowbite-react';
import { ClientResponseError } from 'pocketbase';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import PocketBaseClient from '../../pocketbase-client';
import { pocketbaseErrorMessage } from '../../util';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

type ResourceType =
  | 'practitioner'
  | 'patient'
  | 'device'
  | 'healthcareService'
  | 'room';

interface Schedule {
  resourceType: ResourceType;
  practitioner?: string;
  serviceType: string;
  specialty: string;
  startPeriod: Date;
  endPeriod: Date;
  recurring: boolean;
}

export const AddScheduleForm = (props: Props) => {
  const { onSuccess, onCancel } = props;

  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, getValues } = useForm<Schedule>({
    defaultValues: {
      resourceType: 'practitioner',
      recurring: false,
    },
  });

  // State
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [practiceCodes, setPracticeCodes] = useState<any[]>([]);
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [resourceType, setResourceType] =
    useState<ResourceType>('practitioner');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const serviceTypeQuery = useQuery(['serviceType'], () =>
    PocketBaseClient.records.getList('codings', 1, 500, {
      filter: `system='http://terminology.hl7.org/CodeSystem/service-type'`,
    })
  );

  const practiceCodesQuery = useQuery(['practiceCodes'], () =>
    PocketBaseClient.records.getList('codings', 1, 500, {
      filter: `system='http://hl7.org/fhir/ValueSet/c80-practice-codes'`,
    })
  );

  const practitionerQuery = useQuery(['practitioners'], () =>
    PocketBaseClient.records.getList('profiles', 1, 500, {
      filter: `role='Physician'`,
    })
  );

  useEffect(() => {
    register('practitioner', { required: true });
    register('serviceType', { required: true });
    register('specialty', { required: true });
    register('recurring');
  }, [register]);

  useEffect(() => {
    if (serviceTypeQuery.data) {
      const items = serviceTypeQuery.data.items.map((e) => ({
        value: e.id,
        label: e.display,
      }));

      setServiceTypes(items);
    }
  }, [serviceTypeQuery.data]);

  useEffect(() => {
    if (practiceCodesQuery.data) {
      const items = practiceCodesQuery.data.items.map((e) => ({
        value: e.id,
        label: e.display,
      }));

      setPracticeCodes(items);
    }
  }, [practiceCodesQuery.data]);

  useEffect(() => {
    if (practitionerQuery.data) {
      const items = practitionerQuery.data.items.map((e) => ({
        value: e.id,
        label: `${e.namePrefix} ${e.givenName} ${e.familyName}`,
      }));

      setPractitioners(items);
    }
  }, [practitionerQuery.data]);

  const onSubmit = async (input: Schedule) => {
    setIsLoading(true);

    console.log('Input', input);

    try {
      let reference = '';

      if (resourceType === 'practitioner' && input.practitioner) {
        reference = input.practitioner;
      }

      if (reference.length === 0) {
        throw new Error('Something went wrong');
      }

      const actor: ReferencesRecord = {
        reference: reference,
        display: resourceType,
        type: resourceType,
      };

      const actorResult = await PocketBaseClient.records.create(
        'references',
        actor
      );

      const schedule: any = {
        active: true,
        serviceType: input.serviceType,
        specialty: input.specialty,
        actor: actorResult.id,
        start: input.startPeriod,
        end: input.endPeriod,
        recurring: input.recurring,
      };

      await PocketBaseClient.records.create('schedules', schedule);

      onSuccess();
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

    setIsLoading(false);
  };

  const handleResourceTypeChange = () => {
    const values = getValues();

    setResourceType(values.resourceType);
  };

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div className="w-1/2">
        <div className="float-right">
          <button onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-gray-500"
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-2xl font-extrabold tracking-wider text-teal-600">
            Add Schedule
          </p>

          <div className="mt-4 border rounded-md shadow-sm">
            <div className="w-full bg-gray-100 p-2">
              <fieldset>
                <legend>Resource Type</legend>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Radio
                      id="practitioner"
                      name="resourceType"
                      value="practitioner"
                      ref={register({ required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="practitioner">Practitioner</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="patient"
                      name="resourceType"
                      value="patient"
                      ref={register({ required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="patient">Patient</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Radio
                      id="device"
                      name="resourceType"
                      value="device"
                      ref={register({ required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="device">Device</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="healthcareService"
                      name="resourceType"
                      value="healthcareService"
                      ref={register({ required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="healthcareService">
                      Healthcare Service
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="location"
                      name="resourceType"
                      value="location"
                      ref={register({ required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="location">Room</Label>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="p-3">
              {resourceType === 'practitioner' && (
                <Select
                  placeholder="Select practitioner"
                  options={practitioners}
                  name="practitioner"
                  onChange={(evt) => {
                    setValue('practitioner', evt.value);
                  }}
                />
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 ">Service Type</label>
            <Select
              placeholder="Service to be performed"
              options={serviceTypes}
              className="mt-1"
              onChange={(evt) => {
                setValue('serviceType', evt.value);
              }}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 ">Specialty</label>
            <Select
              placeholder="Specialty of practitioner"
              options={practiceCodes}
              className="mt-1"
              onChange={(evt) => {
                setValue('specialty', evt.value);
              }}
            />
          </div>

          <div className="mt-5 flex space-x-6">
            <div className="w-full">
              <label
                htmlFor="start"
                className="block  font-medium text-gray-700"
              >
                Start Period
              </label>
              <input
                required
                type="date"
                name="startPeriod"
                id="startPeriod"
                ref={register({ required: true })}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="w-full">
              <label htmlFor="end" className="block  font-medium text-gray-700">
                End Period
              </label>
              <input
                required
                type="date"
                name="endPeriod"
                id="endPeriod"
                ref={register({ required: true })}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Checkbox
              id="recurring"
              name="recurring"
              onChange={(evt) => {
                setValue('recurring', evt.target.checked);
              }}
            />
            <Label htmlFor="recurring">Recurring Schedule</Label>
          </div>

          <div className="mt-4">
            <Button
              loading={false}
              loadingText={'Saving'}
              type="submit"
              text="Save"
              icon="save"
              variant="filled"
              disabled={false}
              onClick={() => null}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
