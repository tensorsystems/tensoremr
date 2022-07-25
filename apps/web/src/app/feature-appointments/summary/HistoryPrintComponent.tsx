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

import { gql, useQuery } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import React from 'react';
import { Query, QueryPatientHistoryArgs } from '@tensoremr/models';

const GET_HISTORY = gql`
  query GetHistory($id: ID!) {
    pastIllnesses(patientHistoryId: $id) {
      id
      title
      description
    }
    pastInjuries(patientHistoryId: $id) {
      id
      description
      injuryDate
    }
    pastHospitalizations(patientHistoryId: $id) {
      id
      reason
      provider
      from
      to
    }
    pastSurgeries(patientHistoryId: $id) {
      id
      description
      surgeryDate
    }
    lifestyles(patientHistoryId: $id) {
      id
      title
      description
      note
    }
    familyIllnesses(patientHistoryId: $id) {
      id
      title
      description
    }
  }
`;

interface Props {
  patientHistoryId: string;
  onError: (message: string) => void;
}

const HistoryPrintComponent: React.FC<Props> = ({
  onError,
  patientHistoryId,
}) => {
  const { data } = useQuery<Query, QueryPatientHistoryArgs>(GET_HISTORY, {
    variables: {
      id: patientHistoryId,
    },
    onError(error) {
      onError(error.message);
    },
  });

  const hasPastIllnesses =
    data?.pastIllnesses && data?.pastIllnesses.length > 0;
  const hasPastInjuries = data?.pastInjuries && data?.pastInjuries.length > 0;
  const hasPastHospitalizations =
    data?.pastHospitalizations && data?.pastHospitalizations.length > 0;
  const hasPastSurgeries =
    data?.pastSurgeries && data?.pastSurgeries.length > 0;
  const hasLifestyles = data?.lifestyles && data?.lifestyles.length > 0;
  const hasFamilyIllnesses =
    data?.familyIllnesses && data?.familyIllnesses.length > 0;

  const hasHistory =
    hasPastIllnesses ||
    hasPastInjuries ||
    hasPastHospitalizations ||
    hasPastSurgeries ||
    hasLifestyles ||
    hasFamilyIllnesses;

  if (hasHistory) {
    return (
      <div>
        <p className="text-xl tracking-wider text-gray-800 font-light">
          History
        </p>

        <hr className="mt-5 mb-5" />

        {hasPastIllnesses && (
          <div>
            <span className="font-semibold text-gray-800">
              Past Illnesses:{' '}
            </span>{' '}
            <span>
              {data?.pastIllnesses
                .map((e) => `${e?.title} ${e?.description}`)
                .join(', ')}
            </span>
          </div>
        )}

        {hasPastInjuries && (
          <div>
            <span className="font-semibold text-gray-800">Past Injuries: </span>{' '}
            <span>
              {data?.pastInjuries
                .map(
                  (e) =>
                    `${e?.description} on ${format(
                      parseISO(e?.injuryDate),
                      'MMM d, y'
                    )}`
                )
                .join(', ')}
            </span>
          </div>
        )}

        {hasPastHospitalizations && (
          <div>
            <span className="font-semibold text-gray-800">
              Past Hospitalizations:{' '}
            </span>{' '}
            <span>
              {data?.pastHospitalizations
                .map(
                  (e) =>
                    `${e?.reason} at ${e?.provider} from ${
                      e?.from && format(parseISO(e?.from), 'MMM d, y')
                    } to ${e?.to && format(parseISO(e?.to), 'MMM d, y')}`
                )
                .join(', ')}
            </span>
          </div>
        )}

        {hasPastSurgeries && (
          <div>
            <span className="font-semibold text-gray-800">
              Past Surgeries:{' '}
            </span>{' '}
            <span>
              {data?.pastSurgeries
                .map(
                  (e) =>
                    `${e?.description} on ${
                      e?.surgeryDate
                        ? format(parseISO(e?.surgeryDate), 'MMM d, y')
                        : 'date not stated'
                    }`
                )
                .join(', ')}
            </span>
          </div>
        )}

        {hasFamilyIllnesses && (
          <div>
            <span className="font-semibold text-gray-800">
              Family Illnesses:{' '}
            </span>{' '}
            <span>
              {data?.familyIllnesses
                .map((e) => `${e?.title} ${e?.description}`)
                .join(', ')}
            </span>
          </div>
        )}

        {hasLifestyles && (
          <div>
            <span className="font-semibold text-gray-800">Lifestyle: </span>{' '}
            <span>
              {data?.lifestyles
                .map((e) => `${e?.title} ${e?.description}`)
                .join(', ')}
            </span>
          </div>
        )}
      </div>
    );
  } else {
    return <div />;
  }
};

export default HistoryPrintComponent;
