import React from 'react';
import '@fullcalendar/react/dist/vdom';
import FullCalendar, { formatDate, DateInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { PlusIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import _ from 'lodash';
import { format, parseISO } from 'date-fns';

export interface Schedule {
  id: string;
  resourceType: string;
  resource: string;
  serviceType: string;
  speciality: string;
  startPeriod: string;
  endPeriod: string;
  recurring: boolean;
}

interface Props {
  schedules?: Schedule[];
  onAdd: () => void;
}

export default function SchedulesAdminTable(props: Props) {
  const { schedules, onAdd } = props;

  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th
            scope="col"
            colSpan={6}
            className="px-6 py-3 bg-teal-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            <div className="flex items-center space-x-2">
              <p className="material-icons">schedule</p>
              <p>Schedules</p>
            </div>
          </th>
          <th
            scope="col"
            className="px-6 py-3 bg-teal-700 text-gray-100 text-right"
          >
            <button
              onClick={onAdd}
              className="uppercase bg-teal-800 hover:bg-teal-600 py-1 px-2 rounded-md text-sm"
            >
              <div className="flex items-center space-x-1">
                <div>
                  <PlusIcon className="h-6 w-6" />
                </div>
                <div className="font-semibold">Add</div>
              </div>
            </button>
          </th>
        </tr>
        <tr className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wider">
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs  uppercase tracking-wider"
          >
            Resource
          </th>
          <th scope="col" className="px-6 py-3">
            Service Type
          </th>
          <th scope="col" className="px-6 py-3">
            Speciality
          </th>
          <th scope="col" className="px-6 py-3">
            From
          </th>

          <th scope="col" className="px-6 py-3">
            To
          </th>
          <th scope="col" className="px-6 py-3"></th>
          <th
            scope="col"
            className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
          ></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {schedules?.map((e, i) => (
          <React.Fragment key={e?.id}>
            <tr
              className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
              onClick={() => {
                if (expandedIdx === i) {
                  setExpandedIdx(-1);
                } else {
                  setExpandedIdx(i);
                }
              }}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <ResourceIcon resourceType={e.resourceType} />
                  </div>
                  <div className="ml-4">
                    <div>{_.startCase(e.resourceType)}</div>
                    <div className="text-gray-500">{e.resource}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{e.serviceType}</td>
              <td className="px-6 py-4">{e.speciality}</td>
              <td className="px-6 py-4">
                {format(parseISO(e.startPeriod), 'LLL d, y')}
              </td>

              <td className="px-6 py-4">
                {format(parseISO(e.endPeriod), 'LLL d, y')}
              </td>
              <td>
                {e.recurring && (
                  <span className="material-icons text-center text-cyan-600">
                    autorenew
                  </span>
                )}
              </td>

              <td className="px-6 py-4 flex items-center justify-center">
                <span className="material-icons">
                  {expandedIdx === i ? 'expand_less' : 'expand_more'}
                </span>
              </td>
            </tr>
            <Transition.Root
              show={expandedIdx === i}
              as={React.Fragment}
              enter="ease-in duration-700"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-out duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <tr>
                <td
                  colSpan={7}
                  className="px-20 py-4 text-sm bg-teal-50 border shadow-lg rounded-md rounded-b"
                >
                  <p className="mb-4 text-lg font-light text-yellow-600">
                    Edit Slots
                  </p>
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                      left: 'prev,next',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    initialView="dayGridMonth"
                    validRange={{
                      start: e.startPeriod,
                      end: e.endPeriod,
                    }}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                  />
                </td>
              </tr>
            </Transition.Root>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

interface ResourceIconProps {
  resourceType: string;
}

function ResourceIcon(props: ResourceIconProps) {
  const { resourceType } = props;

  const resource = resourceType.toLowerCase();

  if (resource === 'practitioner') {
    return (
      <span
        className="material-icons text-gray-500"
        style={{
          fontSize: '36px',
        }}
      >
        account_circle
      </span>
    );
  }

  if (resource === 'room') {
    return (
      <span
        className="material-icons text-gray-500"
        style={{
          fontSize: '36px',
        }}
      >
        meeting_room
      </span>
    );
  }

  if (resource === 'device') {
    return (
      <span
        className="material-icons text-gray-500"
        style={{
          fontSize: '36px',
        }}
      >
        computer
      </span>
    );
  }

  return (
    <span
      className="material-icons text-gray-500"
      style={{
        fontSize: '36px',
      }}
    >
      schedule
    </span>
  );
}
