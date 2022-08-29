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
  Diagnosis,
  MutationDeleteFavoriteDiagnosisArgs,
  MutationSaveDiagnosisArgs,
  MutationSaveFavoriteDiagnosisArgs,
  PaginationInput,
  Query,
  QueryDiagnosesArgs,
} from '@tensoremr/models';
import {
  BookmarkIcon as BookmarkSolidIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/solid';
import {
  BookmarkIcon as BookmarkOutlineIcon,
  StarIcon as StarOutlineIcon,
} from '@heroicons/react/outline';

const GET_DATA = gql`
  query GetData(
    $page: PaginationInput!
    $searchTerm: String!
    $favorites: Boolean
  ) {
    diagnoses(page: $page, searchTerm: $searchTerm, favorites: $favorites) {
      totalCount
      edges {
        node {
          id
          categoryCode
          diagnosisCode
          fullCode
          abbreviatedDescription
          fullDescription
          categoryTitle
        }
      }
      pageInfo {
        totalPages
      }
    }
    favoriteDiagnosis {
      id
      diagnosisId
    }
  }
`;

const SAVE_FAVORITE_DIAGNOSIS = gql`
  mutation SaveFavoriteDiagnosis($diagnosisId: ID!) {
    saveFavoriteDiagnosis(diagnosisId: $diagnosisId) {
      id
    }
  }
`;

const DELETE_FAVORITE_DIAGNOSIS = gql`
  mutation DeleteFavoriteDiagnosis($id: ID!) {
    deleteFavoriteDiagnosis(id: $id)
  }
`;

const SAVE_DIAGNOSIS = gql`
  mutation SaveDiagnosis($input: DiagnosisInput!) {
    saveDiagnosis(input: $input) {
      id
    }
  }
`;

export const DiagnosisList: React.FC<{
  locked: boolean;
  onItemClick: (diagnosisId: string, location: string) => void;
  medicalDepartment: string | undefined | null;
}> = ({ locked, onItemClick, medicalDepartment }) => {
  const notifDispatch = useNotificationDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 15,
  });

  const [showAdd, setShowAdd] = useState<boolean>(false);

  const [diagnosisLocation, setDiagnosisLocation] = useState<Array<any>>([]);

  const [showFavorites, setShowFavorites] = useState<boolean>(true);

  const { data, refetch } = useQuery<Query, QueryDiagnosesArgs>(GET_DATA, {
    variables: {
      page: paginationInput,
      searchTerm: searchTerm,
      favorites: showFavorites,
    },
  });

  useEffect(() => {
    refetch();
  }, [searchTerm]);

  useEffect(() => {
    refetch();
  }, [showFavorites]);

  useEffect(() => {
    if (searchTerm.length > 0 && data?.diagnoses.edges.length === 0) {
      setShowAdd(true);
    } else {
      setShowAdd(false);
    }
  }, [searchTerm, data?.diagnoses]);

  const [favoriteIds, setFavoriteIds] = useState<Array<any>>([]);
  useEffect(() => {
    if (data) {
      const ids = data.favoriteDiagnosis.map((e) => e?.diagnosisId) ?? [];
      setFavoriteIds(ids);
    }
  }, [data]);

  const [saveFavoriteDiagnosis] = useMutation<
    any,
    MutationSaveFavoriteDiagnosisArgs
  >(SAVE_FAVORITE_DIAGNOSIS, {
    onCompleted(data) {
      refetch();
    },
    update: (cache, mutationResult) => {
      const diagnosis = mutationResult.data.saveFavoriteDiagnosis;

      const data = cache.readQuery<Query>({
        query: GET_DATA,
      });

      if (data !== null) {
        cache.writeQuery({
          query: GET_DATA,
          data: {
            favoriteDiagnosis: [...data.favoriteDiagnosis, diagnosis],
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

  const [deleteFavoriteDiagnosis] = useMutation<
    any,
    MutationDeleteFavoriteDiagnosisArgs
  >(DELETE_FAVORITE_DIAGNOSIS, {
    onCompleted(data) {
      refetch();
    },
    update: (cache, mutationResult) => {
      const favoriteDiagnosisId = mutationResult.data.deleteFavoriteDiagnosis;

      const data = cache.readQuery<Query>({
        query: GET_DATA,
      });

      if (data !== null) {
        const favoriteDiagnosis = data.favoriteDiagnosis.filter(
          (e) => e?.id !== favoriteDiagnosisId
        );

        cache.writeQuery({
          query: GET_DATA,
          data: {
            favoriteDiagnosis: favoriteDiagnosis,
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

  const [saveDiagnosis] = useMutation<any, MutationSaveDiagnosisArgs>(
    SAVE_DIAGNOSIS,
    {
      onCompleted(data) {
        refetch();

        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: 'Diagnosis saved',
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
    }
  );

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

  const handleItemClick = (diagnosis: Diagnosis | undefined) => {
    if (diagnosis !== undefined) {
      const location = diagnosisLocation.find(
        (i) => i.diagnosisId === diagnosis.id
      )?.location;

      let loc = 'OU';

      if (location) {
        loc = location;
      }

      onItemClick(diagnosis.id, loc);
    }
  };

  const handleFavoriteClick = (item: Diagnosis | undefined) => {
    if (item) {
      if (favoriteIds.includes(item.id)) {
        const favoriteDiagnosisId = data?.favoriteDiagnosis.find(
          (e) => e?.diagnosisId === item.id
        )?.id;

        if (favoriteDiagnosisId)
          deleteFavoriteDiagnosis({
            variables: { id: favoriteDiagnosisId },
          });
      } else {
        saveFavoriteDiagnosis({
          variables: { diagnosisId: item.id },
        });
      }
    }
  };

  const handleDiagnosisAdd = () => {
    const diagnosis = searchTerm.trim();
    saveDiagnosis({
      variables: {
        input: {
          fullDescription: diagnosis,
        },
      },
    });
  };

  return (
    <div className="overflow-x-scroll rounded-lg shadow-xl">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={medicalDepartment === 'Ophthalmology' ? 4 : 3}
              className="px-4 py-2 bg-teal-700 text-left text-xs text-gray-50 uppercase tracking-wider"
            >
              <div className="flex justify-between items-center">
                <p>Diagnosis list</p>
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
            <th colSpan={medicalDepartment === 'Ophthalmology' ? 4 : 3}>
              <div className="flex space-x-1">
                <input
                  type="search"
                  name="search"
                  id="diagnosis-search"
                  placeholder="Search"
                  className="w-full sm:text-md border-none"
                  onChange={(evt) => setSearchTerm(evt.target.value)}
                />

                {showAdd && (
                  <button
                    type="button"
                    className="px-3 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 flex flex-shrink"
                    onClick={() => handleDiagnosisAdd()}
                  >
                    <p className="material-icons">add</p>
                    <p>Add</p>
                  </button>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-2">
          {data?.diagnoses.edges.map((e) => (
            <tr
              key={e?.node.id}
              className="hover:bg-gray-100 border-t cursor-pointer"
            >
              <td className="pl-4 pt-1">
                <button
                  type="button"
                  onClick={() => !locked && handleFavoriteClick(e?.node)}
                >
                  {favoriteIds.includes(e?.node.id) ? (
                    <StarSolidIcon className="h-5 w-5 text-teal-500" />
                  ) : (
                    <StarOutlineIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </td>
              <td
                className="pl-4 px-4 py-5 text-sm font-light text-gray-900"
                onClick={() => !locked && handleItemClick(e?.node)}
              >
                {e?.node.fullDescription}
              </td>
              {medicalDepartment === 'Ophthalmology' && (
                <td className="px-4 py-5 text-sm text-gray-900">
                  <select
                    name="location"
                    disabled={locked}
                    className="border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(evt) => {
                      const locationIndex = diagnosisLocation.findIndex(
                        (i) => i.diagnosisId === e?.node.id
                      );

                      if (locationIndex === -1) {
                        setDiagnosisLocation([
                          {
                            diagnosisId: e?.node.id,
                            location: evt.target.value,
                          },
                          ...diagnosisLocation,
                        ]);
                      } else {
                        setDiagnosisLocation([
                          ...diagnosisLocation.slice(0, locationIndex),
                          Object.assign({}, diagnosisLocation[locationIndex], {
                            location: evt.target.value,
                          }),
                        ]);
                      }
                    }}
                  >
                    <option value={'OU'}>OU</option>
                    <option value={'OD'}>OD</option>
                    <option value={'OS'}>OS</option>
                  </select>
                </td>
              )}
              <td className="px-3">
                <span
                  onClick={() => !locked && handleItemClick(e?.node)}
                  className="material-icons text-teal-700 transform hover:scale-110"
                >
                  keyboard_arrow_right
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        totalCount={data?.diagnoses?.edges?.length ?? 0}
        onNext={handleNextClick}
        onPrevious={handlePreviousClick}
      />
    </div>
  );
};
