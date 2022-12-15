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
    icon: 'home'
  },
  {
    title: 'Patient Queue',
    cancellable: true,
    route: '/patient-queue',
    match: ['/patient-queue'],
    icon: 'alarm'
  },
  {
    title: 'New patient',
    route: '/patients/create',
    cancellable: true,
    match: ['/patients/create'],
    icon: 'person_add'
  },
  {
    title: 'Patients',
    route: '/patients',
    cancellable: true,
    match: ['/patients', '/patients/:patientId'],
    icon: 'group'
  },
  {
    title: 'Appointments',
    route: '/appointments',
    cancellable: true,
    match: [
      '/appointments',
      '/appointments/:appointmentId',
      '/appointments/:appointmentId/patient-dashboard',
      '/appointments/:appointmentId/history',
      '/appointments/:appointmentId/chief-complaints',
      '/appointments/:appointmentId/past-medications-allergies',
      '/appointments/:appointmentId/vital-signs',
      '/appointments/:appointmentId/examination',
      '/appointments/:appointmentId/diagnostics',
      '/appointments/:appointmentId/labratory',
      '/appointments/:appointmentId/pre-op',
      '/appointments/:appointmentId/pre-anesthetic',
      '/appointments/:appointmentId/intra-op',
      '/appointments/:appointmentId/tx-objective',
      '/appointments/:appointmentId/diagnosis',
      '/appointments/:appointmentId/differential-diagnosis',
      '/appointments/:appointmentId/surgery',
      '/appointments/:appointmentId/tx-plan',
      '/appointments/:appointmentId/rx',
      '/appointments/:appointmentId/referral',
      '/appointments/:appointmentId/summary',
    ],
    icon: 'schedule'
  },
  {
    title: 'Messages',
    route: '/chats',
    cancellable: true,
    match: ['/chats'],
    icon: 'messages'
  },
  {
    title: 'Lab orders',
    route: '/lab-orders?status=ORDERED',
    cancellable: true,
    match: ['/lab-orders'],
    icon: 'biotech'
  },
  {
    title: 'Treatment orders',
    route: '/treatment-orders?status=ORDERED',
    cancellable: true,
    match: ['/treatment-orders'],
    icon: 'healing'
  },
  {
    title: 'Diagnostic orders',
    route: '/diagnostic-orders?status=ORDERED',
    cancellable: true,
    match: ['/diagnostic-orders'],
    icon: 'airline_seat_recline_normal'
  },
  {
    title: 'Surgical orders',
    route: '/surgical-orders?status=ORDERED',
    cancellable: true,
    match: ['/surgical-orders'],
    icon: 'airline_seat_flat'
  },
  {
    title: 'Follow-Up orders',
    route: '/followup-orders?status=ORDERED',
    cancellable: true,
    match: ['/followup-orders'],
    icon: 'next_plan'
  },
  {
    title: 'Referrals',
    route: '/referrals',
    cancellable: true,
    match: ['/referrals'],
    icon: 'send'
  },
  {
    title: 'Admin',
    route: '/admin',
    cancellable: true,
    match: ['/admin'],
    icon: 'admin_panel_settings'
  },
];
