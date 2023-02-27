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

import { Page } from '@tensoremr/models';

export const HomePages: Array<Page> = [
  {
    title: 'Home',
    cancellable: false,
    route: '/',
    match: ['/'],
    icon: 'md-home'
  },
  {
    title: 'Patient Queue',
    cancellable: true,
    route: '/patient-queue',
    match: ['/patient-queue'],
    icon: 'md-alarm'
  },
  {
    title: 'New patient',
    route: '/patients/create',
    cancellable: true,
    match: ['/patients/create'],
    icon: 'md-person_add'
  },
  {
    title: 'Patients',
    route: '/patients',
    cancellable: true,
    match: ['/patients', '/patients/:patientId'],
    icon: 'md-group'
  },
  {
    title: 'Appointments',
    route: '/appointments',
    cancellable: true,
    icon: 'md-schedule'
  },
  {
    title: 'Schedules',
    route: '/schedules',
    cancellable: true,
    match: [
      '/schedules',
    ],
    icon: 'md-event'
  },
  {
    title: 'Messages',
    route: '/chats',
    cancellable: true,
    match: ['/chats'],
    icon: 'md-messages'
  },
  {
    title: 'Lab orders',
    route: '/lab-orders?status=ORDERED',
    cancellable: true,
    match: ['/lab-orders'],
    icon: 'md-biotech'
  },
  {
    title: 'Treatment orders',
    route: '/treatment-orders?status=ORDERED',
    cancellable: true,
    match: ['/treatment-orders'],
    icon: 'md-healing'
  },
  {
    title: 'Encounters',
    route: '/encounters',
    cancellable: true,
    match: ['/encounters'],
    icon: 'md-supervisor_account'
  },
  {
    title: 'Tasks',
    route: '/tasks',
    cancellable: true,
    match: ['/tasks'],
    icon: 'md-task_alt'
  },
  {
    title: 'Care Teams',
    route: '/care-teams',
    cancellable: true,
    match: ['/care-teams'],
    icon: 'md-groups'
  },
  {
    title: 'Diagnostic orders',
    route: '/diagnostic-orders?status=ORDERED',
    cancellable: true,
    match: ['/diagnostic-orders'],
    icon: 'md-airline_seat_recline_normal'
  },
  {
    title: 'Surgical orders',
    route: '/surgical-orders?status=ORDERED',
    cancellable: true,
    match: ['/surgical-orders'],
    icon: 'md-airline_seat_flat'
  },
  {
    title: 'Follow-Up orders',
    route: '/followup-orders?status=ORDERED',
    cancellable: true,
    match: ['/followup-orders'],
    icon: 'md-next_plan'
  },
  {
    title: 'Referrals',
    route: '/referrals',
    cancellable: true,
    match: ['/referrals'],
    icon: 'md-send'
  },
  {
    title: 'Admin',
    route: '/admin',
    cancellable: true,
    match: ['/admin'],
    icon: 'md-admin_panel_settings'
  },
];
