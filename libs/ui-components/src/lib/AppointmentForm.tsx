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

import React from 'react';

import { Billing, Room, User, VisitType } from '@tensoremr/models';
import classnames from 'classnames';

interface AppointmentFormProps {
  error: any;
  patientId: string;
  patientName: string;
  isCheckedIn: boolean;
  bookingLeft?: number;
  scheduledToday?: number;
  shouldPayForConsultation: boolean;
  providerStatus: null | 'AVAILABLE' | 'OVERBOOKED' | 'FULLY_BOOKED';
  providers: User[] | undefined;
  rooms: (Room | undefined)[] | undefined;
  visitTypes: (VisitType | undefined)[] | undefined;
  consultationBillings: Billing[] | undefined;
  register: any;
  onSubmit: any;
  onCheckInTimeChange: () => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  error,
  patientId,
  patientName,
  isCheckedIn,
  bookingLeft,
  scheduledToday,
  shouldPayForConsultation,
  providerStatus,
  providers,
  rooms,
  visitTypes,
  consultationBillings,
  register,
  onCheckInTimeChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="container mx-auto w-1/2">
      <form onSubmit={onSubmit}>
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

        <p className="text-xl font-extrabold text-gray-800">
          {`Scheduling ${patientName}`}
        </p>

        <p className="text-gray-500">{patientId}</p>

        <div className="mt-8">
          <div className="mt-4">
            <label
              htmlFor="emergency"
              className="block text-sm font-medium text-gray-700"
            >
              Emergency
            </label>
            <select
              required
              id="emergency"
              name="emergency"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="checkInTime"
              className="block text-sm font-medium text-gray-700"
            >
              Check-In time
            </label>
            <input
              required
              type="datetime-local"
              name="checkInTime"
              id="checkInTime"
              ref={register({ required: true })}
              onChange={() => onCheckInTimeChange()}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="provider"
              className="block text-sm font-medium text-gray-700"
            >
              Provider
            </label>
            <select
              id="userId"
              name="userId"
              required
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={undefined}></option>
              {providers?.map((e) => (
                <option
                  key={e?.id}
                  value={e?.id}
                >{`Dr. ${e?.firstName} ${e?.lastName}`}</option>
              ))}
            </select>
          </div>

          {providerStatus !== null && (
            <div className="mt-2">
              {providerStatus === 'AVAILABLE' && (
                <p className="text-green-600 font-semibold">
                  {`${scheduledToday} scheduled on this day, ${bookingLeft} left`}
                </p>
              )}

              {providerStatus === 'OVERBOOKED' && (
                <p className="text-yellow-500 font-semibold">
                  {`Provider is overbooked with ${scheduledToday} patients`}
                </p>
              )}

              {providerStatus === 'FULLY_BOOKED' && (
                <p className="text-red-500 font-semibold">
                  {`Provider is fully booked with ${scheduledToday} patients`}
                </p>
              )}
            </div>
          )}

          <div className="mt-4">
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-gray-700"
            >
              Room
            </label>
            <select
              id="roomId"
              name="roomId"
              required
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {rooms?.map((e) => (
                <option key={e?.id} value={e?.id}>
                  {e?.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="visitTypeId"
              className="block text-sm font-medium text-gray-700"
            >
              Visit Type
            </label>
            <select
              id="visitTypeId"
              name="visitTypeId"
              required
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {visitTypes
                ?.filter(
                  (e) => e?.title !== 'Surgery' && e?.title !== 'Treatment'
                )
                .map((e: any) => (
                  <option key={e?.id} value={e?.id}>
                    {e?.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="medicalDepartment"
              className="block text-sm font-medium text-gray-700"
            >
              Medical Department
            </label>
            <select
              required
              id="medicalDepartment"
              name="medicalDepartment"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="General Medicine">General Medicine</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>

          {shouldPayForConsultation && (
            <div className="mt-4">
              <div>
                <label
                  htmlFor="billingId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Billing
                </label>
                <select
                  id="billingId"
                  name="billingId"
                  ref={register({ required: true })}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {consultationBillings?.map((e) => (
                    <option key={e?.id} value={e?.id}>
                      {`${e?.item} (${e?.code}) - ETB ${e?.price}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="invoiceNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Consultation Invoice
                </label>
                <input
                  id="invoiceNo"
                  name="invoiceNo"
                  ref={register({ required: true })}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          )}

          <div className="py-3 mt-2 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={providerStatus === 'FULLY_BOOKED' || isCheckedIn}
              className={classnames(
                'inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none',
                {
                  'bg-gray-400':
                    providerStatus === 'FULLY_BOOKED' || isCheckedIn,
                  'bg-teal-600 hover:bg-teal-700':
                    providerStatus !== 'FULLY_BOOKED' && !isCheckedIn,
                }
              )}
            >
              <span className="ml-2">Schedule</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
