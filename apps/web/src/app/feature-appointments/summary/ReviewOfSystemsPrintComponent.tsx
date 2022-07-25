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
import React from 'react';
import { Query } from '@tensoremr/models';

const GET_REVIEW_OF_SYSTEMS = gql`
  query GetReviewOfSystems($page: PaginationInput!, $patientHistoryId: ID!) {
    patientHistory(id: $patientHistoryId) {
      reviewOfSystemsNote
    }

    reviewOfSystems(
      page: $page
      filter: { patientHistoryId: $patientHistoryId }
    ) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          systemSymptom {
            id
            title
            system {
              id
              title
            }
          }
          note
        }
      }
    }
  }
`;

export const ReviewOfSystemsPrintComponent: React.FC<{
  patientHistoryId: string;
}> = ({ patientHistoryId }) => {
  const { data, refetch } = useQuery<Query, any>(GET_REVIEW_OF_SYSTEMS, {
    variables: {
      page: { page: 0, size: 100 },
      patientHistoryId,
    },
  });

  return (
    <div>
      <div className="text-xl tracking-wider text-gray-800 font-light">
        Review of Systems
      </div>

      <hr className="mt-4" />

      <div className="mt-4">
        <ul>
          {data?.reviewOfSystems.edges.map((e) => (
            <li key={e?.node.id}>
              <span className="font-semibold">
                {e?.node.systemSymptom.system.title}:{' '}
              </span>
              <span>{e?.node.systemSymptom.title}</span>
            </li>
          ))}
        </ul>

        {data?.patientHistory.reviewOfSystemsNote && (
          <div className="mt-2">
            <p>{data?.patientHistory.reviewOfSystemsNote}</p>
          </div>
        )}
      </div>
    </div>
  );
};
