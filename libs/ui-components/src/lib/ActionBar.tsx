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

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { gql, useQuery } from '@apollo/client';
import { Query } from '@tensoremr/models';
import { fromJS, List, Map } from 'immutable';
import { parseJwt } from '@tensoremr/util';

export const GET_NOTIFS = gql`
  query GetNotifs {
    notifs {
      diagnosticProcedureOrders
      labOrders
      treatmentOrders
      surgicalOrders
      referralOrders
      followUpOrders
      paymentWaivers
    }
  }
`;

const ACCESS_TOKEN = gql`
  query AccessToken {
    accessToken @client
  }
`;

interface Props {
  onPageSelect: (route: string) => void;
}

export const Actionbar: React.FC<Props> = ({ onPageSelect }) => {
  const actions: any = fromJS([
    Map({
      title: 'Home',
      cancellable: false,
      route: '/',
      match: ['/'],
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    }),
    Map({
      title: 'Patient Queue',
      cancellable: true,
      route: '/patient-queue',
      match: ['/patient-queue'],
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    }),
    Map({
      title: 'Messages',
      route: '/chats',
      cancellable: true,
      match: ['/chats'],
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    }),
  ]);

  const [pages, setPages] = useState<List<any>>(actions);

  const handleClick = (route: string) => {
    onPageSelect(route);
  };

  const { data } = useQuery<Query>(GET_NOTIFS, {
    pollInterval: 10000,
  });

  const accessTokenQuery = useQuery(ACCESS_TOKEN);

  useEffect(() => {
    const token = accessTokenQuery.data?.accessToken;
    if (token) {
      const claim = parseJwt(token);

      let newPages: List<any> = pages;

      const newPatientsIdx = newPages.findIndex((e) => {
        return e?.get('title') === 'New patient';
      });

      const appointmentsIdx = newPages.findIndex((e) => {
        return e?.get('title') === 'Appointments';
      });

      const patientsIdx = newPages.findIndex((e) => {
        return e?.get('title') === 'Patients';
      });

      const diagnosticIdx = newPages.findIndex((e) => {
        return e?.get('title') === 'Diagnostic orders';
      });
      const labIdx = newPages.findIndex(
        (e) => e?.get('title') === 'Lab orders'
      );
      const treatmentIdx = newPages.findIndex(
        (e) => e?.get('title') === 'Treatment orders'
      );
      const surgicalIdx = newPages.findIndex(
        (e) => e?.get('title') === 'Surgical orders'
      );

      const followupIdx = newPages.findIndex(
        (e) => e?.get('title') === 'Follow-Up orders'
      );

      const referralIdx = newPages.findIndex(
        (e) => e?.get('title') === 'Referrals'
      );

      const adminIdx = newPages.findIndex((e) => e?.get('title') === 'Admin');

      if (claim.UserType.includes('Receptionist')) {
        if (newPatientsIdx === -1) {
          newPages = newPages.push(
            fromJS({
              title: 'New patient',
              route: '/new-patient',
              cancellable: true,
              match: ['/new-patient'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              ),
            })
          );
        }

        if (patientsIdx !== -1) {
          newPages = newPages.push(
            fromJS({
              title: 'Patients',
              route: '/patients',
              cancellable: true,
              match: ['/patients', '/patients/:patientId'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              ),
            })
          );
        }

        if (diagnosticIdx === -1) {
          newPages = newPages.push(
            fromJS({
              title: 'Diagnostic orders',
              route: '/diagnostic-orders?status=ORDERED',
              cancellable: true,
              match: ['/diagnostic-orders'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                  />
                </svg>
              ),
            })
          );
        }

        if (labIdx === -1) {
          newPages = newPages.push(
            fromJS({
              title: 'Lab orders',
              route: '/lab-orders?status=ORDERED',
              cancellable: true,
              match: ['/lab-orders'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              ),
            })
          );
        }

        if (treatmentIdx === -1) {
          newPages = newPages.push(
            fromJS({
              title: 'Treatment orders',
              route: '/treatment-orders?status=ORDERED',
              cancellable: true,
              match: ['/treatment-orders'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                  />
                </svg>
              ),
            })
          );
        }

        if (surgicalIdx === -1) {
          newPages = newPages.push(
            fromJS({
              title: 'Surgical orders',
              route: '/surgical-orders?status=ORDERED',
              cancellable: true,
              match: ['/surgical-orders'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                  />
                </svg>
              ),
            })
          );
        }

        if (followupIdx === -1) {
          newPages = newPages.push(
            fromJS({
              title: 'Follow-Up orders',
              route: '/followup-orders?status=ORDERED',
              cancellable: true,
              match: ['/followup-orders'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                  />
                </svg>
              ),
            })
          );
        }

        if (referralIdx === -1) {
          newPages = newPages.push(
            fromJS({
              title: 'Referrals',
              route: '/referrals',
              cancellable: true,
              match: ['/referrals'],
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                  />
                </svg>
              ),
            })
          );
        }
      }

      if (
        (claim.UserType.includes('Receptionist') ||
          claim.UserType.includes('Admin') ||
          claim.UserType.includes('Nurse') ||
          claim.UserType.includes('Physician')) &&
        appointmentsIdx === -1
      ) {
        newPages = newPages.push(
          fromJS({
            title: 'Appointments',
            route: '/appointments',
            cancellable: true,
            match: [
              '/appointments',
              '/appointments/:appointmentId',
              '/appointments/:appointmentId/patient-details',
              '/appointments/:appointmentId/history',
              '/appointments/:appointmentId/chief-complaints',
              '/appointments/:appointmentId/past-medications-allergies',
              '/appointments/:appointmentId/vital-signs',
              '/appointments/:appointmentId/examination',
              '/appointments/:appointmentId/diagnostics',
              '/appointments/:appointmentId/labratory',
              '/appointments/:appointmentId/pre-op',
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
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ),
          })
        );
      }

      if (adminIdx === -1 && claim.UserType.includes('Admin')) {
        newPages = newPages.push(
          fromJS({
            title: 'Admin',
            route: '/admin',
            cancellable: true,
            match: [
              '/admin',
              '/admin/organization-details',
              '/admin/lookups',
              '/admin/user-admin',
              '/admin/payment-waiver',
              '/admin/patient-encounter-limit',
              '/admin/billings',
              '/admin/hpi',
              '/admin/diagnostic-procedures',
              '/admin/surgical-procedures',
              '/admin/treatment-types',
              '/admin/labratory-types',
              '/admin/supplies',
              '/admin/pharmacies',
              '/admin/eyewear-shops',
            ],
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
                />
              </svg>
            ),
          })
        );
      }

      if (data?.notifs) {
        newPages = newPages.withMutations((ctx) => {
          if (diagnosticIdx !== -1) {
            ctx.setIn(
              [diagnosticIdx, 'notifs'],
              data.notifs.diagnosticProcedureOrders
            );
          }

          if (labIdx !== -1) {
            ctx.setIn([labIdx, 'notifs'], data.notifs.labOrders);
          }

          if (treatmentIdx !== -1) {
            ctx.setIn([treatmentIdx, 'notifs'], data.notifs.treatmentOrders);
          }

          if (surgicalIdx !== -1) {
            ctx.setIn([surgicalIdx, 'notifs'], data.notifs.surgicalOrders);
          }

          if (followupIdx !== -1) {
            ctx.setIn([followupIdx, 'notifs'], data.notifs.followUpOrders);
          }

          if (referralIdx !== -1) {
            ctx.setIn([referralIdx, 'notifs'], data.notifs.referralOrders);
          }

          if (adminIdx !== -1) {
            ctx.setIn([adminIdx, 'notifs'], data.notifs.paymentWaivers);
          }
        });
      }

      setPages(newPages);
    }
  }, [accessTokenQuery.data, data, pages]);

  return (
    <div className="bg-gray-200">
      <header className="bg-white shadow">
        <div className="mx-auto py-2 px-4 sm:px-6 lg:px-8">
          <div className="gap-2 w-full flex flex-wrap -m-1 my-1">
            {pages.toJS().map((e: any, i) => (
              <Link
                key={e.route}
                to={e.route}
                onClick={() => handleClick(e.route)}
              >
                <Chip key={i} action={e} />
              </Link>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};

const Chip: React.FC<{
  action: { title: string; icon: JSX.Element; notifs?: number };
}> = ({ action }) => {
  return (
    <button
      className={classnames(
        'flex space-x-2 items-center bg-gray-200 h-8 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 transform hover:scale-105',
        {
          'px-3': !action.notifs,
          'px-2': action.notifs,
        }
      )}
    >
      <div className="flex space-x-1 items-center">
        <div>{action.icon}</div>
        <div>{action.title}</div>
      </div>
      {action.notifs !== undefined && action.notifs !== 0 && (
        <div className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center shadow-inner">
          {action.notifs}
        </div>
      )}
    </button>
  );
};
