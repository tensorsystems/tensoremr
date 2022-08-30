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

import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { TablePagination } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  FavoriteMedication,
  MutationDeleteFavoriteMedicationArgs,
  FavoriteMedicationConnection,
} from '@tensoremr/models';

const DELETE_FAVORITE_MEDICATION = gql`
  mutation DeleteFavoriteMedication($id: ID!) {
    deleteFavoriteMedication(id: $id)
  }
`;

export const FavoriteMedicationList: React.FC<{
  locked: boolean;
  userFavoriteMedications: FavoriteMedicationConnection | undefined;
  onItemClick: (item: FavoriteMedication) => void;
  refetch: () => void;
  handleNextClick: () => void;
  handlePreviousClick: () => void;
  setSearchTerm: (searchTerm: string) => void;
}> = ({
  locked,
  userFavoriteMedications,
  onItemClick,
  refetch,
  handleNextClick,
  handlePreviousClick,
  setSearchTerm,
}) => {
  const notifDispatch = useNotificationDispatch();

  const [deleteFavoriteMedication] = useMutation<
    any,
    MutationDeleteFavoriteMedicationArgs
  >(DELETE_FAVORITE_MEDICATION, {
    onCompleted(data) {
      refetch();

      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Success',
        notifSubTitle: 'Favorite medication removed',
        variant: 'success',
      });
    },
    onError(error) {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const handleItemClick = (item: FavoriteMedication | undefined) => {
    if (item !== undefined) {
      onItemClick(item);
    }
  };

  const handleItemDelete = (id: string | undefined) => {
    if (id !== undefined) {
      deleteFavoriteMedication({ variables: { id } });
    }
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-xl">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={3}
              className="px-4 py-2 bg-teal-700 text-left text-xs text-gray-50 uppercase tracking-wider"
            >
              Favorite medications
            </th>
          </tr>
          <tr>
            <th colSpan={3}>
              <input
                type="search"
                name="search"
                placeholder="Search"
                autoComplete="off"
                className="w-full sm:text-md border-none"
                onChange={(evt) => setSearchTerm(evt.target.value.trim())}
              />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-1">
          {userFavoriteMedications?.edges.map((e) => (
            <tr
              key={e?.node.id}
              className="hover:bg-gray-100 border-t cursor-pointer"
            >
              <td
                className="pl-5 text-gray-500 md-12"
                onClick={() => handleItemDelete(e?.node.id)}
              >
                <span className="material-icons">delete</span>
              </td>
              <td
                className="px-6 py-5 text-sm text-gray-700"
                onClick={() => !locked && handleItemClick(e?.node)}
              >
                {e?.node.medication}
              </td>
              <td
                className="p-2"
                onClick={() => !locked && handleItemClick(e?.node)}
              >
                <span className="material-icons">keyboard_arrow_right</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        totalCount={userFavoriteMedications?.totalCount ?? 0}
        onNext={handleNextClick}
        onPrevious={handlePreviousClick}
      />
    </div>
  );
};
