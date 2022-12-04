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
import React, { useEffect, useState } from 'react';
import { TablePagination } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  ChiefComplaintType,
  MutationDeleteFavoriteChiefComplaintArgs,
  MutationSaveChiefComplaintTypeArgs,
  MutationSaveFavoriteChiefComplaintArgs,
  PaginationInput,
  Query,
  QueryChiefComplaintTypesArgs,
} from '@tensoremr/models';
import {
  BookmarkIcon as BookmarkSolidIcon,
  StarIcon as StarSolidIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import {
  BookmarkIcon as BookmarkOutlineIcon,
  StarIcon as StarOutlineIcon,
} from '@heroicons/react/outline';

const GET_DATA = gql`
  query GetData(
    $page: PaginationInput!
    $searchTerm: String
    $favorites: Boolean
  ) {
    chiefComplaintTypes(
      page: $page
      searchTerm: $searchTerm
      favorites: $favorites
    ) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }
    favoriteChiefComplaints {
      id
      chiefComplaintTypeId
    }
  }
`;

const SAVE_CHIEF_COMPLAINT_TYPE = gql`
  mutation SaveChiefComplaintType($input: ChiefComplaintTypeInput!) {
    saveChiefComplaintType(input: $input) {
      id
    }
  }
`;

const SAVE_FAVORITE_CHIEF_COMPLAINT_TYPE = gql`
  mutation SaveFavoriteChiefComplaintType($chiefComplaintTypeId: ID!) {
    saveFavoriteChiefComplaint(chiefComplaintTypeId: $chiefComplaintTypeId) {
      id
    }
  }
`;

const DELETE_FAVORITE_CHIEF_COMPLAINT_TYPE = gql`
  mutation DeleteFavoriteChiefComplaintType($id: ID!) {
    deleteFavoriteChiefComplaint(id: $id)
  }
`;

export const ChiefComplaintTypes: React.FC<{
  locked: boolean;
  onItemClick: (title: string) => void;
}> = ({ locked, onItemClick }) => {
  const notifDispatch = useNotificationDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const [showFavorites, setShowFavorites] = useState<boolean>(true);
  const [favoriteIds, setFavoriteIds] = useState<Array<any>>([]);

  const { data, refetch } = useQuery<Query, QueryChiefComplaintTypesArgs>(
    GET_DATA,
    {
      variables: {
        page: paginationInput,
        searchTerm: searchTerm.length > 3 ? searchTerm : undefined,
        favorites: showFavorites,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [showFavorites]);

  useEffect(() => {
    if (searchTerm.length > 0 && data?.chiefComplaintTypes.totalCount === 0) {
      setShowAdd(true);
    } else {
      setShowAdd(false);
    }
  }, [searchTerm, data?.chiefComplaintTypes]);

  useEffect(() => {
    if (data) {
      const ids =
        data.favoriteChiefComplaints.map((e) => e?.chiefComplaintTypeId) ?? [];

      setFavoriteIds(ids);
    }
  }, [data]);

  const [saveFavoriteChiefComplaint] = useMutation<
    any,
    MutationSaveFavoriteChiefComplaintArgs
  >(SAVE_FAVORITE_CHIEF_COMPLAINT_TYPE, {
    onCompleted(data) {
      refetch();
    },
    update: (cache, mutationResult) => {
      const chiefComplaintType = mutationResult.data.saveFavoriteChiefComplaint;

      const data = cache.readQuery<Query>({
        query: GET_DATA,
      });

      if (data !== null) {
        cache.writeQuery({
          query: GET_DATA,
          data: {
            favoriteChiefComplaints: [
              ...data.favoriteChiefComplaints,
              chiefComplaintType,
            ],
          },
        });
      }
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

  const [saveChiefComplaintType] = useMutation<
    any,
    MutationSaveChiefComplaintTypeArgs
  >(SAVE_CHIEF_COMPLAINT_TYPE, {
    onCompleted(data) {
      refetch();
      setSearchTerm('');

      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Success',
        notifSubTitle: 'Chief complaint type saved',
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

  const [deleteFavoriteChiefComplaint] = useMutation<
    any,
    MutationDeleteFavoriteChiefComplaintArgs
  >(DELETE_FAVORITE_CHIEF_COMPLAINT_TYPE, {
    onCompleted(data) {
      refetch();
    },
    update: (cache, mutationResult) => {
      const favoriteChiefComplaintTypeId =
        mutationResult.data.deleteFavoriteChiefComplaint;

      const data = cache.readQuery<Query>({
        query: GET_DATA,
      });

      if (data !== null) {
        const favoriteChiefComplaints = data.favoriteChiefComplaints.filter(
          (e) => e?.id !== favoriteChiefComplaintTypeId
        );

        cache.writeQuery({
          query: GET_DATA,
          data: {
            favoriteChiefComplaints: favoriteChiefComplaints,
          },
        });
      }
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

  useEffect(() => {
    refetch();
  }, [paginationInput, searchTerm]);

  const handleNextClick = () => {
    setPaginationInput({
      ...paginationInput,
      page: paginationInput.page + 1,
    });
  };

  const handlePreviousClick = () => {
    if (paginationInput.page > 1) {
      setPaginationInput({
        ...paginationInput,
        page: paginationInput.page - 1,
      });
    }
  };

  const handleItemClick = (title: string | undefined) => {
    if (title !== undefined) {
      onItemClick(title);
    }
  };

  const handleFavoriteClick = (item: ChiefComplaintType | undefined) => {
    if (item) {
      if (favoriteIds.includes(item.id)) {
        const favoriteChiefComplaintId = data?.favoriteChiefComplaints.find(
          (e) => e?.chiefComplaintTypeId === item.id
        )?.id;

        if (favoriteChiefComplaintId)
          deleteFavoriteChiefComplaint({
            variables: { id: favoriteChiefComplaintId },
          });
      } else {
        saveFavoriteChiefComplaint({
          variables: { chiefComplaintTypeId: item.id },
        });
      }
    }
  };

  const handleChiefComplaintTypeAdd = () => {
    const chiefComplaintType = searchTerm.trim();
    saveChiefComplaintType({
      variables: {
        input: {
          title: chiefComplaintType,
        },
      },
    });
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
              <div className="flex justify-between items-center">
                <p>Chief complaint list</p>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowFavorites(!showFavorites)}
                  >
                    {showFavorites ? (
                      <BookmarkSolidIcon className="h-5 w-5 text-white" />
                    ) : (
                      <BookmarkOutlineIcon className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <th colSpan={3}>
              <div className="flex space-x-1">
                <input
                  type="search"
                  name="search"
                  placeholder="Search"
                  value={searchTerm}
                  className="w-full sm:text-md border-none outline-none focus:outline-none focus:ring-0 flex-1"
                  onChange={(evt) => setSearchTerm(evt.target.value)}
                />

                {showAdd && (
                  <button
                    type="button"
                    className="px-3 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 flex"
                    onClick={() => handleChiefComplaintTypeAdd()}
                  >
                    <p className="material-icons">add</p>
                    <p>Add</p>
                  </button>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-1">
          {data?.chiefComplaintTypes.edges.map((e) => (
            <tr key={e?.node.id} className="hover:bg-gray-100 border-t">
              <td className="pl-4 pt-1">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => handleFavoriteClick(e?.node)}
                >
                  {favoriteIds.includes(e?.node.id) ? (
                    <StarSolidIcon className="h-5 w-5 text-teal-500" />
                  ) : (
                    <StarOutlineIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </td>
              <td
                className="px-6 py-5 text-sm text-gray-900"
                onClick={() => !locked && handleItemClick(e?.node.title)}
              >
                {e?.node.title}
              </td>
              <td
                className="p-2 cursor-pointer"
                onClick={() => !locked && handleItemClick(e?.node.title)}
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        totalCount={data?.chiefComplaintTypes?.edges?.length ?? 0}
        onNext={handleNextClick}
        onPrevious={handlePreviousClick}
      />
    </div>
  );
};
