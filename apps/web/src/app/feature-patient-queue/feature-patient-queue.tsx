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

import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import cn from 'classnames';
import { UserCircleIcon, TrashIcon, RssIcon } from '@heroicons/react/outline';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Appointment,
  MutationDeleteFromQueueArgs,
  MutationMovePatientQueueArgs,
  MutationSavePatientQueueArgs,
  MutationSubscribeQueueArgs,
  MutationUnsubscribeQueueArgs,
  Query,
  QueryUserSubscriptionsArgs,
  QueueType,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import AddQueueForm from './AddQueueForm';
import { parseJwt } from '@tensoremr/util';
import _ from 'lodash';
import AddToQueueForm from './AddToQueueForm';

const GET_PATIENT_QUEUE = gql`
  query GetPatientQueues {
    patientQueues {
      id
      queueName
      queueType
      queue {
        id
        firstName
        lastName
        patientId
        providerName
      }
    }
  }
`;

const GET_USER_SUBSCRIPTIONS = gql`
  query GetUserSubscriptions($userId: ID!) {
    userSubscriptions(userId: $userId) {
      id
      userId
      subscriptions {
        id
        queueName
        queueType
      }
    }
  }
`;

const SAVE_PATIENT_QUEUE = gql`
  mutation SavePatientQueue($input: PatientQueueInput!) {
    savePatientQueue(input: $input) {
      queueName
      queueType
    }
  }
`;

const MOVE_PATIENT_QUEUE = gql`
  mutation MovePatientQueue(
    $appointmentId: ID!
    $sourceQueueId: ID!
    $destinationQueueId: ID!
  ) {
    movePatientQueue(
      appointmentId: $appointmentId
      sourceQueueId: $sourceQueueId
      destinationQueueId: $destinationQueueId
    ) {
      id
    }
  }
`;

const DELETE_FROM_QUEUE = gql`
  mutation DeleteFromQueue($patientQueueId: ID!, $appointmentId: ID!) {
    deleteFromQueue(
      patientQueueId: $patientQueueId
      appointmentId: $appointmentId
    ) {
      id
    }
  }
`;

const SUBSCRIBE_QUEUE = gql`
  mutation SubscribeQueue($userId: ID!, $patientQueueId: ID!) {
    subscribeQueue(userId: $userId, patientQueueId: $patientQueueId) {
      id
    }
  }
`;

const UNSUBSCRIBE_QUEUE = gql`
  mutation UnsubscribeQueue($userId: ID!, $patientQueueId: ID!) {
    unsubscribeQueue(userId: $userId, patientQueueId: $patientQueueId) {
      id
    }
  }
`;

export const PatientQueuePage: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const token = sessionStorage.getItem('accessToken');
  const userId = parseJwt(token)?.ID;

  const [addToQueue, setAddToQueue] = useState<Appointment>();

  const { data, refetch, loading } = useQuery<Query>(GET_PATIENT_QUEUE, {
    pollInterval: 10000,
  });

  useEffect(() => {
    refetch();
  }, []);

  const userSubscriptionsQuery = useQuery<Query, QueryUserSubscriptionsArgs>(
    GET_USER_SUBSCRIPTIONS,
    {
      variables: {
        userId,
      },
    }
  );

  const [state, setState] = useState<Array<any>>([]);

  const [savePatientQueue] = useMutation<any, MutationSavePatientQueueArgs>(
    SAVE_PATIENT_QUEUE,
    {
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

  const [movePatientQueue] = useMutation<any, MutationMovePatientQueueArgs>(
    MOVE_PATIENT_QUEUE,
    {
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

  const [deleteFromQueue] = useMutation<any, MutationDeleteFromQueueArgs>(
    DELETE_FROM_QUEUE,
    {
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
    }
  );

  const [subscribeQueue] = useMutation<any, MutationSubscribeQueueArgs>(
    SUBSCRIBE_QUEUE,
    {
      onCompleted(data) {
        refetch();
        userSubscriptionsQuery.refetch();
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

  const [unsubscribeQueue] = useMutation<any, MutationUnsubscribeQueueArgs>(
    UNSUBSCRIBE_QUEUE,
    {
      onCompleted(data) {
        refetch();
        userSubscriptionsQuery.refetch();
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
    if (data?.patientQueues) {
      const items: Array<any> = [];
      data?.patientQueues.forEach((patientQueue) => {
        const item = {
          id: patientQueue.id,
          queueName: patientQueue.queueName,
          queueType: patientQueue.queueType,
          queue: patientQueue.queue.map((q) => ({ ...q, id: q.id.toString() })),
        };

        items.push(item);
      });

      setState(items);
    }
  }, [data?.patientQueues]);

  const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: any,
    destination: any,
    sourceInx: number,
    destinationIdx: number,
    sourceId: any,
    destinationId: any
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);

    const [removed] = sourceClone.splice(sourceInx, 1);

    destClone.splice(destinationIdx, 0, removed);

    const result: any = {};
    result[sourceId] = sourceClone;
    result[destinationId] = destClone;

    return result;
  };

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    width: '100%',
    ...draggableStyle,
  });

  function onDragEnd(result: any) {
    const { source, destination } = result;

    if (loading) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: 'System was busy loading. Please try again. ',
        variant: 'failure',
      });
      return;
    }

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sId = +source.droppableId;
    const dId = +destination.droppableId;

    if (source.droppableId === 'addToQueue' && addToQueue) {
      const destinationIdx = state.findIndex((e) => e.id === dId);

      const appointment: Appointment = {
        ...addToQueue,
        id: addToQueue.id.toString(),
      };
      appointment.id = addToQueue.id.toString();

      const alreadExists = state[destinationIdx].queue.find(
        (e: any) => e.id === appointment.id
      );

      if (alreadExists) {
        notifDispatch({
          type: 'show',
          notifTitle: 'Error',
          notifSubTitle: 'Patient alread exists in this queue',
          variant: 'failure',
        });

        return;
      }

      const destinationQueue = state[destinationIdx].queue;
      destinationQueue.splice(destination.index, 0, appointment);

      const newState = [...state];
      newState[destinationIdx].queue = destinationQueue;

      const dQueue = newState[destinationIdx].queue.map((e: any) => e.id);

      saveQueue(
        newState[destinationIdx].queueName,
        newState[destinationIdx].queueType,
        dQueue
      );
      setState(newState);
      setAddToQueue(undefined);

      return;
    }

    if (sId === dId) {
      const sourceIdx = state.findIndex((e) => e.id === sId);

      const items = reorder(
        state[sourceIdx].queue,
        source.index,
        destination.index
      );

      const newState = [...state];
      newState[sourceIdx].queue = items;

      const queue = newState[sourceIdx].queue.map((e: any) => e.id);
      saveQueue(
        newState[sourceIdx].queueName,
        newState[sourceIdx].queueType,
        queue
      );
      setState(newState);
    } else {
      const sourceIdx = state.findIndex((e) => e.id === sId);
      const destinationIdx = state.findIndex((e) => e.id === dId);

      const appointment = state[sourceIdx].queue[source.index];
      const alreadExists = state[destinationIdx].queue.find(
        (e: any) => e.id === appointment.id
      );

      if (alreadExists) {
        notifDispatch({
          type: 'show',
          notifTitle: 'Error',
          notifSubTitle: 'Patient alread exists in this queue',
          variant: 'failure',
        });

        return;
      }

      const result = move(
        state[sourceIdx].queue,
        state[destinationIdx].queue,
        source.index,
        destination.index,
        source.droppableId,
        destination.droppableId
      );

      const newState = [...state];
      newState[sourceIdx].queue = result[source.droppableId];
      newState[destinationIdx].queue = result[destination.droppableId];

      movePatientQueue({
        variables: {
          appointmentId: appointment.id,
          sourceQueueId: source.droppableId,
          destinationQueueId: destination.droppableId,
        },
      }).then(() => {
        setState(newState);
      });
    }
  }

  const saveQueue = (queueName: string, queueType: any, queue: any) => {
    savePatientQueue({
      variables: {
        input: {
          queueName,
          queue,
          queueType,
        },
      },
    });
  };

  const handleQueueCreate = () => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <AddQueueForm
          onSuccess={() => {
            bottomSheetDispatch({ type: 'hide' });
            notifDispatch({
              type: 'show',
              notifTitle: 'Success',
              notifSubTitle: 'Patient queue has been added successfully',
              variant: 'success',
            });
            refetch();
          }}
          onError={(message) => {
            notifDispatch({
              type: 'show',
              notifTitle: 'Error',
              notifSubTitle: message,
              variant: 'failure',
            });
          }}
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
        />
      ),
    });
  };

  const handleQueueAdd = () => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <AddToQueueForm
          onSuccess={(appointment: Appointment) => {
            bottomSheetDispatch({ type: 'hide' });
            setAddToQueue(appointment);
          }}
          onError={(message) => {
            notifDispatch({
              type: 'show',
              notifTitle: 'Error',
              notifSubTitle: message,
              variant: 'failure',
            });
          }}
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
        />
      ),
    });
  };

  const handleSubscribe = (patientQueueId: string) => {
    subscribeQueue({
      variables: {
        userId,
        patientQueueId,
      },
    });
  };

  const handleUnsubscribe = (patientQueueId: string) => {
    unsubscribeQueue({
      variables: {
        userId,
        patientQueueId,
      },
    });
  };

  const handleDeleteFromQueue = (
    patientQueueId: string,
    appointmentId: string
  ) => {
    deleteFromQueue({
      variables: {
        patientQueueId,
        appointmentId,
      },
    });
  };

  const getQueueTypeHumanName = (queueType: any) => {
    switch (queueType) {
      case QueueType.User:
        return 'Users';
      case QueueType.Lab:
        return 'Labratory';
      case QueueType.Diagnostic:
        return 'Diagnostic Procedures';
      case QueueType.Surgical:
        return 'Surgical Procedures';
      case QueueType.Preexam:
        return 'Pre-Exam';
      case QueueType.Preoperation:
        return 'Pre-Operation';
      default:
        return 'Others';
    }
  };

  const getQueueTypeIcon = (queueType: any) => {
    switch (queueType) {
      case QueueType.User:
        return <span className="material-icons">person</span>;
      case QueueType.Lab:
        return <span className="material-icons">biotech</span>;
      case QueueType.Diagnostic:
        return (
          <span className="material-icons">airline_seat_recline_normal</span>
        );
      case QueueType.Surgical:
        return <span className="material-icons">airline_seat_flat</span>;
      case QueueType.Preexam:
        return <span className="material-icons">preview</span>;
      case QueueType.Preoperation:
        return <span className="material-icons">preview</span>;
      default:
        return <span />;
    }
  };

  const userSubscriptionIds =
    userSubscriptionsQuery.data?.userSubscriptions.subscriptions.map(
      (e) => e.id
    );

  const grouped = _.groupBy(state, 'queueType');

  return (
    <div className="h-full">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => {
            handleQueueCreate();
          }}
          className="px-4 py-3 bg-white rounded-md shadow-lg flex items-center space-x-2 hover:bg-gray-50"
        >
          <p className="material-icons text-gray-600">create_new_folder</p>
          <p>Create New Queue</p>
        </button>
        <button
          type="button"
          onClick={() => {
            handleQueueAdd();
          }}
          className="px-4 py-3 bg-white rounded-md shadow-lg flex items-center space-x-2 hover:bg-gray-50"
        >
          <p className="material-icons text-gray-600">group_add</p>
          <p>Add To Queue</p>
        </button>
      </div>

      <div className="mt-5">
        <DragDropContext onDragEnd={onDragEnd}>
          {addToQueue && (
            <div>
              <Droppable key={`addToQueue`} droppableId={`addToQueue`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn('p-4 shadow-lg w-full', {
                      'bg-blue-300': snapshot.isDraggingOver,
                      'bg-gray-50': !snapshot.isDraggingOver,
                    })}
                  >
                    <div className="mb-4 flex space-x-4 items-center justify-between">
                      <p className="font-semibold text-lg">Add To Queue</p>
                    </div>
                    <Draggable
                      key={addToQueue.id.toString()}
                      draggableId={addToQueue.id.toString()}
                      index={0}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          className={cn(
                            'shadow-lg rounded-md select-none p-4 mt-2 ',
                            {
                              'bg-green-300': snapshot.isDragging,
                              'bg-white': !snapshot.isDragging,
                            }
                          )}
                        >
                          <div className="flex justify-between">
                            <div className="flex space-x-2 items-center">
                              <UserCircleIcon className="h-6 w-6 text-gray-500" />
                              <div>
                                <p className="text-gray-800">{`${addToQueue.firstName} ${addToQueue.lastName}`}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAddToQueue(undefined);
                              }}
                            >
                              <TrashIcon className="h-6 w-6 text-red-400" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}
          {Object.entries(grouped).map(([key, value]) => (
            <div key={key} className="mt-5 p-5 bg-indigo-50 shadow-md">
              <div className="flex space-x-2 items-center text-gray-700 tracking-wide">
                {getQueueTypeIcon(key)}
                <p className="text-2xl">
                  {getQueueTypeHumanName(key).toUpperCase()}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-6 overflow-x-scroll mt-4">
                {value.map((el) => (
                  <Droppable key={el.id} droppableId={`${el.id}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn('p-4 shadow-lg w-full', {
                          'bg-blue-300': snapshot.isDraggingOver,
                          'bg-gray-50': !snapshot.isDraggingOver,
                        })}
                      >
                        <div className="mb-4 flex space-x-4 items-center justify-between">
                          <p className="font-semibold text-lg">
                            {el.queueName}
                          </p>
                          {userSubscriptionIds &&
                          userSubscriptionIds.includes(el.id) ? (
                            <button
                              type="button"
                              onClick={() => handleUnsubscribe(el.id)}
                              className="flex space-x-1 items-center bg-teal-200 hover:bg-red-400 hover:text-white px-2 py-1 rounded-md shadow-md"
                            >
                              <RssIcon className="h-4 w-4" />
                              <p>Unsubscribe</p>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSubscribe(el.id)}
                              className="flex space-x-1 items-center bg-gray-100 hover:bg-green-400 hover:text-white p-1 rounded-md shadow-md"
                            >
                              <RssIcon className="h-4 w-4 text-gray-500" />
                              <p>Subscribe</p>
                            </button>
                          )}
                        </div>
                        {el.queue.map((item: any, index: number) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                                className={cn(
                                  'shadow-lg rounded-md select-none p-4 mt-2',
                                  {
                                    'bg-green-300': snapshot.isDragging,
                                    'bg-white': !snapshot.isDragging,
                                  }
                                )}
                              >
                                <div className="flex justify-between">
                                  <div className="flex space-x-2 items-center">
                                    <UserCircleIcon className="h-7 w-7 text-gray-500" />
                                    <div className="mt-1">
                                      <div>
                                        <span className="text-gray-800">{`${item.firstName} ${item.lastName}`}</span>
                                        <span className="text-gray-400">{` | ${item.patientId}`}</span>
                                      </div>
                                      <p className="text-xs text-indigo-500">{`Dr. ${item.providerName}`}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (item.id)
                                        handleDeleteFromQueue(el.id, item.id);
                                    }}
                                  >
                                    <TrashIcon className="h-6 w-6 text-red-400" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};
