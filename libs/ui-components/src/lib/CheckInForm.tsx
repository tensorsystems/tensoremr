/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import {
  Destination,
  MutationCheckInPatientArgs,
  Query,
  QueryAppointmentArgs,
} from '@tensoremr/models';
import { format, isToday, parseISO } from 'date-fns';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';

const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      id
      checkInTime
      credit
      userId
      providerName
      visitType {
        id
        title
      }
      room {
        id
        title
      }
      appointmentStatus {
        id
        title
      }
      patient {
        id
        firstName
        lastName
        phoneNo
      }
    }
  }
`;

const CHECK_IN_PATIENT = gql`
  mutation CheckInPatient($appointmentId: ID!, $destination: Destination!) {
    checkInPatient(appointmentId: $appointmentId, destination: $destination) {
      id
    }
  }
`;

export const CheckInForm: React.FC<{
  appointmentId: string;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
  onCancel: () => void;
  onReschedule: (
    appointmentId: string | undefined,
    patientId: string | undefined
  ) => void;
}> = ({ appointmentId, onSuccess, onFailure, onCancel, onReschedule }) => {
  const { register, handleSubmit } = useForm();

  const { data, loading } = useQuery<Query, QueryAppointmentArgs>(
    GET_APPOINTMENT,
    {
      variables: {
        id: appointmentId,
      },
    }
  );

  const [save] = useMutation<any, MutationCheckInPatientArgs>(
    CHECK_IN_PATIENT,
    {
      onCompleted(data) {
        onSuccess(`Patient is successfully checked in`);
      },
      onError(error) {
        onFailure(error.message);
      },
    }
  );

  const handleCheckIn = (input: any) => {
    if (data?.appointment?.id !== undefined) {
      save({
        variables: {
          appointmentId: data?.appointment?.id,
          destination: input.destination,
        },
      });
    }
  };

  if (loading || !data?.appointment) {
    return (
      <div className="container mx-auto justify-start">
        <div>
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

          <div className="flex justify-center mt-10 h-screen">
            {/* @ts-ignore */}
            <ReactLoading
              type={'spinningBubbles'}
              color={'gray'}
              height={70}
              width={70}
              className="inline-block"
            />
          </div>
        </div>
      </div>
    );
  }

  const checkInTime = parseISO(data?.appointment?.checkInTime);

  return (
    <div className="container mx-auto w-1/2  justify-start">
      <div>
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
        <div>
          <p className="font-extrabold text-5xl text-gray-900">{`${data?.appointment?.patient?.firstName} ${data?.appointment?.patient?.lastName}`}</p>
          <div className="mt-1">
            {isToday(checkInTime) ? (
              <div>
                <span className="tracking-wide text-gray-600 mt-5">
                  Scheduled for today at
                </span>
                <span className="font-bold"> {format(checkInTime, 'p')}</span>
              </div>
            ) : (
              <div>
                <span className="tracking-wide text-gray-600 mt-5">
                  Scheduled for
                </span>
                <span> {format(checkInTime, 'Lo MMMM y')}</span>
              </div>
            )}
          </div>
          <span className="tracking-wide text-gray-600">{`${data?.appointment?.visitType.title} with `}</span>
          <span className="tracking-wide text-gray-700 font-semibold">
            {data?.appointment?.providerName}
          </span>
        </div>

        <form onSubmit={handleSubmit(handleCheckIn)}>
          <div className="mt-5 w-auto">
            <div className="flex items-center space-x-2">
              <span className="material-icons md-near_me"></span>
              <span className="text-gray-700">Send patient to</span>
            </div>

            {data?.appointment.visitType.title === 'Surgery' ? (
              <div className="border border-gray-300 p-2 rounded-md mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="destination"
                    value={Destination.Preoperation}
                    ref={register({ required: true })}
                  />
                  <span className="ml-2">Pre-Operation</span>
                </label>
              </div>
            ) : (
              <div className="border border-gray-300 p-2 rounded-md mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="destination"
                    value={Destination.Preexam}
                    ref={register({ required: true })}
                  />
                  <span className="ml-2">Pre-Exam</span>
                </label>
              </div>
            )}

            <div className="border border-gray-300 p-2 rounded-md mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="destination"
                  value={Destination.Physician}
                  ref={register({ required: true })}
                />
                <span className="ml-2">Physician</span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="border border-green-200 bg-green-50 hover:bg-green-100 p-3 rounded-md mt-4 flex-1 text-green-800"
              >
                Check-In Now
              </button>

              <button
                type="button"
                className="border border-red-200 bg-red-50 hover:bg-red-100 p-3 rounded-md mt-4 flex-1 text-red-800"
                onClick={() =>
                  onReschedule(
                    data?.appointment?.id,
                    data?.appointment?.patient?.id
                  )
                }
              >
                Reschedule
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
