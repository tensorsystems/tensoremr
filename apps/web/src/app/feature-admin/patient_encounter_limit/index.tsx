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
import React, { useState } from 'react';
import {
  Mutation,
  MutationUpdatePatientEncounterLimitArgs,
  PaginationInput,
  Query,
  QueryPatientEncounterLimitsArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import cn from 'classnames';

export const PATIENT_ENCOUNTER_LIMITS = gql`
  query PatientEncounterLimits($page: PaginationInput!) {
    patientEncounterLimits(page: $page) {
      totalCount
      edges {
        node {
          id
          user {
            id
            firstName
            lastName
          }
          mondayLimit
          tuesdayLimit
          wednesdayLimit
          thursdayLimit
          fridayLimit
          saturdayLimit
          sundayLimit
          overbook
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

const UPDATE_PATIENT_ENCOUNTER_LIMIT = gql`
  mutation UpdatePatientEncounterLimit(
    $input: PatientEncounterLimitUpdateInput!
  ) {
    updatePatientEncounterLimit(input: $input) {
      id
    }
  }
`;

export const PatientEncounterLimitPage: React.FC = () => {
  const notifDispatch = useNotificationDispatch();

  const [paginationInput] = useState<PaginationInput>({
    page: 1,
    size: 1000,
  });

  const { data, refetch } = useQuery<Query, QueryPatientEncounterLimitsArgs>(
    PATIENT_ENCOUNTER_LIMITS,
    {
      variables: { page: paginationInput },
    }
  );

  const [updatePatientEncounterLimit] = useMutation<
    Mutation,
    MutationUpdatePatientEncounterLimitArgs
  >(UPDATE_PATIENT_ENCOUNTER_LIMIT, {
    onCompleted(data) {
      refetch();
    },
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const handleChange = (
    id: string | undefined,
    target: string,
    value: number
  ) => {
    if (id) {
      updatePatientEncounterLimit({
        variables: {
          input: {
            id: id,
            [target]: value,
          },
        },
      });
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-8 divide-x divide-y shadow-md">
        <div className="bg-gray-100"></div>
        <div className="bg-white text-center">Monday</div>
        <div className="bg-white text-center">Tuesday</div>
        <div className="bg-white text-center">Wednesday</div>
        <div className="bg-white text-center">Thursday</div>
        <div className="bg-white text-center">Friday</div>
        <div className="bg-white text-center">Saturday</div>
        <div className="bg-white text-center">Sunday</div>
        {data?.patientEncounterLimits.edges.map((e, i) => (
          <div
            key={e?.node.id}
            className={cn('col-span-8 grid grid-cols-8 divide-x divide-y', {
              'bg-white': i % 2 === 0,
              'bg-gray-100': i % 2 !== 0,
            })}
          >
            <div className="text-center py-3 text-sm text-gray-800">{`Dr. ${e?.node.user.firstName} ${e?.node.user.lastName}`}</div>
            <div className="py-2 px-2">
              <Form
                limit={e?.node.mondayLimit}
                onChange={(value) =>
                  handleChange(e?.node.id, 'mondayLimit', value)
                }
              />
            </div>
            <div className="py-2 px-2">
              <Form
                limit={e?.node.tuesdayLimit}
                onChange={(value) =>
                  handleChange(e?.node.id, 'tuesdayLimit', value)
                }
              />
            </div>
            <div className="py-2 px-2">
              <Form
                limit={e?.node.wednesdayLimit}
                onChange={(value) =>
                  handleChange(e?.node.id, 'wednesdayLimit', value)
                }
              />
            </div>
            <div className="py-2 px-2">
              <Form
                limit={e?.node.thursdayLimit}
                onChange={(value) =>
                  handleChange(e?.node.id, 'thursdayLimit', value)
                }
              />
            </div>
            <div className="py-2 px-2">
              <Form
                limit={e?.node.fridayLimit}
                onChange={(value) =>
                  handleChange(e?.node.id, 'fridayLimit', value)
                }
              />
            </div>
            <div className="py-2 px-2">
              <Form
                limit={e?.node.saturdayLimit}
                onChange={(value) =>
                  handleChange(e?.node.id, 'saturdayLimit', value)
                }
              />
            </div>
            <div className="py-2 px-2">
              <Form
                limit={e?.node.sundayLimit}
                onChange={(value) =>
                  handleChange(e?.node.id, 'sundayLimit', value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface FormProps {
  limit: number | undefined;
  onChange: (value: number) => void;
}

function Form(props: FormProps) {
  return (
    <div className="flex w-full items-stretch">
      <div className="flex-1 px-4">
        <input
          required
          defaultValue={props.limit}
          type="number"
          name="dailyLimit"
          className="h-6 w-full border-gray-300 border rounded-md text-center text-gray-700"
          onChange={(evt) => props.onChange(parseInt(evt.target.value))}
        />
      </div>
    </div>
  );
}
