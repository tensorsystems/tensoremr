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

import { useQuery, useLazyQuery, gql, useMutation } from '@apollo/client';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ChiefComplaint,
  Maybe,
  HpiComponentEdge,
  QueryHpiComponentTypesArgs,
  QueryHpiComponentsArgs,
  Query,
  HpiComponent,
  MutationSaveHpiComponentArgs,
} from '@tensoremr/models';
import ReactLoading from 'react-loading';
import { useNotificationDispatch } from '@tensoremr/notification';
import ReactTooltip from 'react-tooltip';

const GET_HPI_COMPONENT_TYPES = gql`
  query HpiComponentTypes($page: PaginationInput!) {
    hpiComponentTypes(page: $page) {
      edges {
        node {
          id
          title
          description
        }
      }
    }
  }
`;

const GET_HPI_COMPONENTS = gql`
  query HpiComponents($page: PaginationInput!, $filter: HpiFilter) {
    hpiComponents(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

const SAVE_HPI_COMPONENT = gql`
  mutation SaveHpiComponent($input: HpiComponentInput!) {
    saveHpiComponent(input: $input) {
      id
    }
  }
`;

interface Props {
  values: ChiefComplaint | undefined;
  onChange: (
    values: Maybe<HpiComponentEdge>[] | undefined,
    hpiComponentTypeId: string | undefined
  ) => void;
}

export const ChiefComplaintHpi: React.FC<Props> = ({ values, onChange }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, getValues } = useForm<any>({
    defaultValues: {
      id: values?.id,
      hpiComponentIds: values?.hpiComponents.map((e) => e?.id.toString()),
    },
  });

  const [searchValue, setSearchValue] = useState('');
  const [openIndex, setOpenIndex] = useState(-1);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [hpiComponents, setHpiComponents] = useState<
    Array<HpiComponent | undefined>
  >([]);

  const { data } = useQuery<Query, QueryHpiComponentTypesArgs>(
    GET_HPI_COMPONENT_TYPES,
    {
      variables: { page: { page: 0, size: 100 } },
    }
  );

  const hpiComponentLazyQuery = useLazyQuery<Query, QueryHpiComponentsArgs>(
    GET_HPI_COMPONENTS
  );

  const [saveHpiComponent] = useMutation<any, MutationSaveHpiComponentArgs>(
    SAVE_HPI_COMPONENT,
    {
      onCompleted(data) {
        hpiComponentLazyQuery[1].refetch && hpiComponentLazyQuery[1].refetch();
        setSearchValue('');

        notifDispatch({
          type: 'show',
          notifTitle: 'Success',
          notifSubTitle: 'HPI component saved successfully',
          variant: 'success',
        });
      },
      onError(error) {
        notifDispatch({
          type: 'show',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  useEffect(() => {
    let isMounted = true;

    if (openIndex !== -1 && data !== undefined && isMounted) {
      const hpiComponentType = data.hpiComponentTypes.edges[openIndex];

      hpiComponentLazyQuery[0]({
        variables: {
          page: { page: 0, size: 100 },
          filter: { hpiComponentTypeId: hpiComponentType?.node.id },
        },
      });
    }

    return () => {
      isMounted = false;
    };
  }, [openIndex, data]);

  useEffect(() => {
    if (hpiComponentLazyQuery[1].data?.hpiComponents) {
      const result = hpiComponentLazyQuery[1].data?.hpiComponents.edges
        .map((e) => e?.node)
        .filter((e) =>
          searchValue.length > 0
            ? e?.title
                .toLocaleLowerCase()
                .includes(searchValue.toLocaleLowerCase())
            : e
        );

      setHpiComponents(result);
    }
  }, [hpiComponentLazyQuery[1].data, searchValue]);

  useEffect(() => {
    if (searchValue.length > 0 && hpiComponents.length === 0) {
      setShowAddButton(true);
    } else {
      setShowAddButton(false);
    }
  }, [searchValue, hpiComponents]);

  const handleOpen = (index: number) => {
    setOpenIndex(index);
  };

  const handleSaveHpiComponent = () => {
    const hpiComponent = searchValue.trim();
    const hpiComponentType = data?.hpiComponentTypes.edges[openIndex];

    if (hpiComponentType?.node.id) {
      saveHpiComponent({
        variables: {
          input: {
            title: hpiComponent,
            hpiComponentTypeId: hpiComponentType?.node.id,
          },
        },
      });
    }
  };

  return (
    <div className="p-1 bg-gray-50 shadow-inner rounded-lg">
      <form>
        {data?.hpiComponentTypes.edges.map((hpiComponentType, i) => (
          <div
            key={i}
            className={classnames({
              'border-b': i !== data?.hpiComponentTypes.edges.length - 1,
            })}
          >
            <div
              className={classnames({
                'border-l-2 border-transparent': i !== openIndex,
                'border-l-2 bg-gray-100 border-teal-500 p-2': i === openIndex,
              })}
            >
              <div
                className="flex justify-between p-3 cursor-pointer select-none"
                onClick={() => {
                  setSearchValue('');
                  if (i === openIndex) {
                    handleOpen(-1);
                  } else {
                    handleOpen(i);
                  }
                }}
              >
                <div>
                  <div
                    className={classnames({
                      'text-gray-700': i !== openIndex,
                      'text-teal-500': i === openIndex,
                    })}
                  >
                    <a data-tip data-for={hpiComponentType?.node.title}>
                      {hpiComponentType?.node.title}
                    </a>
                    {/* @ts-ignore */}
                    <ReactTooltip id={hpiComponentType?.node.title} type="info">
                      {hpiComponentType?.node.description}
                    </ReactTooltip>
                  </div>
                </div>
                <div
                  className={classnames(
                    'rounded-full border w-7 h-7 flex items-center justify-center',
                    {
                      'border-gray-300': i !== openIndex,
                      'border-teal-500 bg-teal-500': i === openIndex,
                    }
                  )}
                >
                  {i === openIndex ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className={'w-5 text-gray-400'}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                {i === openIndex && (
                  <div className="mt-3 ml-4">
                    {hpiComponentLazyQuery[1].loading ? (
                      <div className="p-6">
                        {/* @ts-ignore */}
                        <ReactLoading
                          type="spin"
                          color="teal"
                          height="5%"
                          width="5%"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex space-x-1 mb-2">
                          <input
                            type="search"
                            className="p-2 bg-gray-100 text-gray-500 text-sm border-none"
                            placeholder="Search"
                            value={searchValue}
                            onChange={(evt) => setSearchValue(evt.target.value)}
                          />

                          {showAddButton && (
                            <button
                              type="button"
                              className="items-center  text-teal-700 hover:bg-teal-50 flex"
                              onClick={() => handleSaveHpiComponent()}
                            >
                              <p className="material-icons">add</p>
                              <p>Add</p>
                            </button>
                          )}
                        </div>

                        {hpiComponents.map((hpiComponent) => (
                          <div key={hpiComponent?.id} className="p-2">
                            <input
                              type="checkbox"
                              id={hpiComponent?.id}
                              name="hpiComponentIds"
                              value={hpiComponent?.id}
                              ref={register}
                              onChange={() => {
                                const hpiComponents =
                                  hpiComponentLazyQuery[1].data?.hpiComponents.edges.filter(
                                    (e) =>
                                      getValues('hpiComponentIds')?.includes(
                                        e?.node.id.toString()
                                      )
                                  );

                                onChange(
                                  hpiComponents,
                                  hpiComponentType?.node.id
                                );
                              }}
                            />
                            <label
                              className="ml-3 text-gray-800 font-light"
                              htmlFor="hpiComponentIds"
                            >
                              {hpiComponent?.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};
