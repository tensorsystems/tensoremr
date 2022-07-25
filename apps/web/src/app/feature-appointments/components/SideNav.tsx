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

import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavItem } from '@tensoremr/ui-components';

interface Props {
  soapType: 'regular' | 'surgical' | 'treatment';
  medicalDepartment: 'General Medicine' | 'Ophthalmology';
  userType: string;
  locked?: boolean;
  matchUrl: string;
  location: string;
}

export const SideNav: React.FC<Props> = ({
  soapType,
  medicalDepartment,
  userType,
  locked,
  matchUrl,
  location,
}) => {
  const { search } = useLocation();

  return (
    <div className="bg-white rounded-lg py-2 px-2 shadow-lg">
      <NavItem
        route={`patient-dashboard${search}`}
        label="Patient Dashboard"
        icon="dashboard"
        matchUrl={matchUrl}
        location={location}
        subItem={false}
      />

      <hr className="mt-1" />

      <NavItem
        route="subjective"
        label="Subjective"
        status={locked ? 'locked' : 'pending_actions'}
        matchUrl={matchUrl}
        location={location}
        subItem={false}
        disabled={true}
      />

      <NavItem
        route={`history${search}`}
        label="History"
        icon="history"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        status={'locked'}
        disabled={userType === 'Receptionist'}
      />

      {soapType === 'regular' && (
        <NavItem
          route={`chief-complaints${search}`}
          label="Chief Complaints"
          icon="format_list_bulleted"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'regular' && medicalDepartment === 'General Medicine' && (
        <NavItem
          route={`ros${search}`}
          label="Review of Systems"
          icon="accessibility"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      <NavItem
        route={`past-medications-allergies${search}`}
        label="Past Med & Allergies"
        icon="local_pharmacy"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        disabled={userType === 'Receptionist'}
      />

      <NavItem
        route="objective"
        label="Objective"
        status={locked ? 'locked' : 'pending_actions'}
        matchUrl={matchUrl}
        location={location}
        subItem={false}
        disabled={true}
      />

      <NavItem
        route={`vital-signs${search}`}
        label="Vital Signs"
        icon="show_chart"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        disabled={userType === 'Receptionist'}
      />

      {soapType === 'regular' && (
        <NavItem
          route={`examination${search}`}
          label="Physical Examination"
          icon="find_in_page"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'regular' && (
        <NavItem
          route={`diagnostics${search}`}
          label="Diagnostic Procedure"
          icon="airline_seat_recline_normal"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'regular' && (
        <NavItem
          route={`labratory${search}`}
          label="Labratory"
          icon="biotech"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'surgical' && (
        <NavItem
          route={`pre-op${search}`}
          label="Pre-Operation"
          icon="format_list_numbered"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'surgical' && (
        <NavItem
          route={`pre-anesthetic${search}`}
          label="Preanesthetic Evaluation"
          icon="verified"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'surgical' && (
        <NavItem
          route={`intra-op${search}`}
          label="Intra-Operation"
          icon="airline_seat_flat"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'treatment' && (
        <NavItem
          route={`tx-objective${search}`}
          label="Treatment"
          icon="healing"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      <NavItem
        route="assessment"
        label="Assessment"
        status={locked ? 'locked' : 'pending_actions'}
        matchUrl={matchUrl}
        location={location}
        subItem={false}
        disabled={true}
      />

      <NavItem
        route={`diagnosis${search}`}
        label="Diagnosis"
        icon="fact_check"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        disabled={userType === 'Receptionist'}
      />

      <NavItem
        route={`differential-diagnosis${search}`}
        label="Differential Diagnosis"
        icon="live_help"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        disabled={userType === 'Receptionist'}
      />

      <NavItem
        route="plan"
        label="Plan"
        status={locked ? 'locked' : 'pending_actions'}
        matchUrl={matchUrl}
        location={location}
        subItem={false}
        disabled={true}
      />

      {soapType === 'regular' && medicalDepartment === 'Ophthalmology' && (
        <NavItem
          route={`surgery${search}`}
          label="Surgery"
          icon="airline_seat_flat"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      {soapType === 'regular' && (
        <NavItem
          route={`tx-plan${search}`}
          label="Treatments"
          icon="healing"
          matchUrl={matchUrl}
          location={location}
          subItem={true}
          disabled={userType === 'Receptionist'}
        />
      )}

      <NavItem
        route={`rx${search}`}
        label="eRx"
        icon="local_pharmacy"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        disabled={userType === 'Receptionist'}
      />

      <NavItem
        route={`follow-up${search}`}
        label="Follow-Ups"
        icon="next_plan"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        disabled={userType === 'Receptionist'}
      />

      <NavItem
        route={`referral${search}`}
        label="Referral"
        icon="send"
        matchUrl={matchUrl}
        location={location}
        subItem={true}
        disabled={userType === 'Receptionist'}
      />

      <hr className="mt-1" />

      <NavItem
        route={`medical-certificate${search}`}
        label="Medical Certificate"
        icon="receipt_long"
        status={'locked'}
        matchUrl={matchUrl}
        location={location}
        subItem={false}
        disabled={userType === 'Receptionist'}
      />

      <NavItem
        route={`summary${search}`}
        label="Summary"
        icon="card_membership"
        status={'locked'}
        matchUrl={matchUrl}
        location={location}
        subItem={false}
        disabled={userType === 'Receptionist'}
      />
    </div>
  );
};
