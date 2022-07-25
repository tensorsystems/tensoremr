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

import { gql, useQuery } from '@apollo/client';
import React from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { Query, QueryGetPatientOrderCountArgs } from '@tensoremr/models';
import { NavItem } from '@tensoremr/ui-components';
import { PatientDiagnosticOrders } from '../PatientDiagnosticOrders';
import { PatientFollowUpOrders } from '../PatientFollowUpOrders';
import { PatientLabratoryOrders } from '../PatientLabratoryOrders';
import { PatientReferralOrders } from '../PatientReferralOrders';
import { PatientSurgicalOrders } from '../PatientSurgicalOrders';
import { PatientTreatmentOrders } from '../PatientTreatmentOrders';

const GET_COUNT = gql`
  query GetCount($patientId: ID!) {
    getPatientOrderCount(patientId: $patientId) {
      diagnosticProcedureOrders
      labOrders
      treatmentOrders
      surgicalOrders
      referralOrders
      followUpOrders
    }
  }
`;

interface Props {
  patientId: string;
}

const PatientOrders: React.FC<Props> = ({ patientId }) => {
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const { data } = useQuery<Query, QueryGetPatientOrderCountArgs>(GET_COUNT, {
    variables: {
      patientId,
    },
  });

  return (
    <div className="flex">
      <div className="bg-white rounded-lg py-2 px-4 shadow-lg">
        <NavItem
          route="diagnostic-orders"
          label="Digranostic procedures"
          icon="airline_seat_recline_normal"
          completed={false}
          subItem={false}
          matchUrl={match.url}
          location={`${history.location.pathname}${location.search}`}
          notifs={
            data?.getPatientOrderCount.diagnosticProcedureOrders ?? undefined
          }
        />

        <NavItem
          route="labratory-orders"
          label="Labratory"
          icon="biotech"
          completed={false}
          subItem={false}
          matchUrl={match.url}
          location={`${history.location.pathname}${location.search}`}
          notifs={data?.getPatientOrderCount.labOrders ?? undefined}
        />

        <NavItem
          route="surgery-orders"
          label="Surgery"
          icon="airline_seat_flat"
          completed={false}
          subItem={false}
          matchUrl={match.url}
          location={`${history.location.pathname}${location.search}`}
          notifs={data?.getPatientOrderCount.surgicalOrders ?? undefined}
        />

        <NavItem
          route="treatment-orders"
          label="Treatments"
          icon="healing"
          completed={false}
          subItem={false}
          matchUrl={match.url}
          location={`${history.location.pathname}${location.search}`}
          notifs={data?.getPatientOrderCount.treatmentOrders ?? undefined}
        />

        <NavItem
          route="followup-orders"
          label="Follow-Ups"
          icon="next_plan"
          completed={false}
          subItem={false}
          matchUrl={match.url}
          location={`${history.location.pathname}${location.search}`}
          notifs={data?.getPatientOrderCount.followUpOrders ?? undefined}
        />

        <NavItem
          route="referral-orders"
          label="Referrals"
          icon="send"
          completed={false}
          subItem={false}
          matchUrl={match.url}
          location={`${history.location.pathname}${location.search}`}
          notifs={data?.getPatientOrderCount.referralOrders ?? undefined}
        />
      </div>
      <div className="px-6 py-1 flex-1">
        <Switch>
          <Route path={`${match.path}/diagnostic-orders`}>
            <PatientDiagnosticOrders patientId={patientId} />
          </Route>
          <Route path={`${match.path}/labratory-orders`}>
            <PatientLabratoryOrders patientId={patientId} />
          </Route>
          <Route path={`${match.path}/surgery-orders`}>
            <PatientSurgicalOrders patientId={patientId} />
          </Route>
          <Route path={`${match.path}/treatment-orders`}>
            <PatientTreatmentOrders patientId={patientId} />
          </Route>
          <Route path={`${match.path}/followup-orders`}>
            <PatientFollowUpOrders patientId={patientId} />
          </Route>
          <Route path={`${match.path}/referral-orders`}>
            <PatientReferralOrders patientId={patientId} />
          </Route>
          <Route path={`${match.path}`}>
            <PatientDiagnosticOrders patientId={patientId} />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default PatientOrders;
