import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import React from 'react';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import _ from 'lodash';

const mockData = [
  {
    id: '1',
    resourceType: 'practitioner',
    resource: 'Dr. Tiliksew Teshome',
    serviceType: 'Ophthalmology',
    speciality: 'Medical Ophthalmology',
    from: '2022-11-05T00:00:00',
    to: '2022-12-05T02:00:00',
    recurring: true,
  },
  {
    id: '2',
    resourceType: 'practitioner',
    resource: 'Dr. Zelalem Eshetu',
    serviceType: 'Ophthalmology',
    speciality: 'Medical Ophthalmology',
    from: '2022-11-05T00:00:00',
    to: '2022-12-05T02:00:00',
    recurring: false,
  },
  {
    id: '3',
    resourceType: 'room',
    resource: 'Exam Room 1',
    serviceType: 'Ophthalmology',
    speciality: 'Medical Ophthalmology',
    from: '2022-11-05T00:00:00',
    to: '2022-12-05T02:00:00',
    recurring: true,
  },
];

export default function SchedulesAdminTable() {
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
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
        {mockData.map((e, i) => (
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
              <td className="px-6 py-4">Feb 25, 2022</td>

              <td className="px-6 py-4">Mar 25, 2022</td>
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
                    validRange={{
                      start: e.from,
                      end: e.to,
                    }}
                    initialView="dayGridMonth"
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

  if (resourceType === 'practitioner') {
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

  if (resourceType === 'room') {
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

  if (resourceType === 'device') {
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
