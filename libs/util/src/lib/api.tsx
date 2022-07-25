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

import { gql } from "@apollo/client";

export const BILLINGS = gql`
  query Billings($page: PaginationInput!, $searchTerm: String) {
    billings(page: $page, searchTerm: $searchTerm) {
      totalCount
      edges {
        node {
          id
          item
          code
          price
          credit
          remark
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

export const SUPPLIES = gql`
  query Supply($page: PaginationInput!, $searchTerm: String) {
    supplies(page: $page, searchTerm: $searchTerm) {
      totalCount
      edges {
        node {
          id
          title
          active
          billings {
            id
            item
            code
          }
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

export const FIND_TODAYS_CHECKED_IN_APPOINTMENTS = gql`
  query FindTodaysCheckedInAppointments(
    $page: PaginationInput!
    $searchTerm: String
  ) {
    findTodaysCheckedInAppointments(page: $page, searchTerm: $searchTerm) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id

          firstName
          lastName
        }
      }
    }
  }
`;

export const MEDICATION_PRESCRIPTIONS = gql`
  query SearchMedicalPrescriptions(
    $page: PaginationInput!
    $filter: MedicalPrescriptionFilter
  ) {
    searchMedicalPrescriptions(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          medication
          sig
          refill
          generic
          substitutionAllowed
          directionToPatient
          prescribedDate
          history
          status
        }
      }
    }
  }
`;

export const vitalSignsFragment = gql`
  fragment VitalSignsFragment on VitalSigns {
    id
    temperature
    pulse
    bloodPressureSystolic
    bloodPressureDiastolic
    respiratoryRate
    oxygenSaturation
    height
    weight
    bmi
    rightDistanceUncorrected
    leftDistanceUncorrected
    rightDistancePinhole
    leftDistancePinhole
    rightDistanceCorrected
    leftDistanceCorrected
    rightNearUncorrected
    leftNearUncorrected
    rightNearPinhole
    leftNearPinhole
    rightNearCorrected
    leftNearCorrected
    rightApplanation
    leftApplanation
    rightTonopen
    leftTonopen
    rightDigital
    leftDigital
    rightNoncontact
    leftNoncontact
  }
`;


export const SHOULD_PAY_FOR_CONSULTATION = gql`
  query ShouldPayForConsultation($patientId: ID!, $date: Time!) {
    payForConsultation(patientId: $patientId, date: $date)
  }
`;