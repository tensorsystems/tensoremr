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

import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';

import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  MedicalPrescriptionOrder,
  MutationUpdateMedicationPrescriptionOrderArgs,
  Query,
  QueryAppointmentArgs,
} from '@tensoremr/models';
import { MedicalPrescriptionPrint } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';

const GET_DATA = gql`
  query GetData(
    $patientChartId: ID!
    $userId: ID!
    $patientDiagnosesPage: PaginationInput!
    $patientDiagnosesFilter: PatientDiagnosisFilter!
  ) {
    user(id: $userId) {
      id
      firstName
      lastName
      signature {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
    }

    patientChart(id: $patientChartId) {
      appointmentId
    }

    patientDiagnoses(
      page: $patientDiagnosesPage
      filter: $patientDiagnosesFilter
    ) {
      totalCount
      edges {
        node {
          id
          fullDescription
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

const GET_APPOINTMENT = gql`
  query Appointment($id: ID!) {
    appointment(id: $id) {
      id
      patient {
        id
        firstName
        lastName
        gender
        dateOfBirth
        woreda
        city
        subCity
        phoneNo
      }
    }
  }
`;

const UPDATE_MEDICAL_PRESCRIPTION_ORDER = gql`
  mutation updateMedicationPrescriptionOrder(
    $input: MedicationPrescriptionUpdateInput!
  ) {
    updateMedicationPrescriptionOrder(input: $input) {
      id
    }
  }
`;

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  item: MedicalPrescriptionOrder;
}

export const CompleteMedicalPrescriptionOrder: React.FC<Props> = ({
  item,
  onCancel,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const [showPrintButton, setShowPrintButton] = useState<boolean>(false);
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const appointmentLazyQuery = useLazyQuery<Query, QueryAppointmentArgs>(
    GET_APPOINTMENT
  );

  const appointment = appointmentLazyQuery[1].data?.appointment;

  const { data } = useQuery<Query, any>(GET_DATA, {
    variables: {
      patientChartId: item.patientChartId,
      userId: item.orderedById,
      patientDiagnosesPage: { page: 0, size: 10 },
      patientDiagnosesFilter: { patientChartId: item.patientChartId },
    },
    onCompleted(data) {
      if (data.patientChart.appointmentId) {
        appointmentLazyQuery[0]({
          variables: {
            id: data.patientChart.appointmentId,
          },
        });
      }
    },
  });

  const [updateMedicalPrescriptionOrder] = useMutation<
    any,
    MutationUpdateMedicationPrescriptionOrderArgs
  >(UPDATE_MEDICAL_PRESCRIPTION_ORDER, {
    onCompleted(data) {
      onSuccess();
    },
    onError(error) {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const handleCompleted = () => {
    updateMedicalPrescriptionOrder({
      variables: {
        input: {
          id: item.id,
          status: 'COMPLETED',
        },
      },
    });
  };

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div>
        <div className="float-right">
          <button onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div>
          <p className="text-2xl font-extrabold tracking-wider text-teal-700">
            Prescription
          </p>

          {appointment && data?.user && item && (
            <MedicalPrescriptionPrint
              patient={appointment.patient}
              medicalPrescriptionOrder={item}
              user={data?.user}
              patientDiagnoses={data.patientDiagnoses.edges.map((e) => e?.node)}
            />
          )}

          <div className="flex space-x-5 mt-5">
            {item.status === 'ORDERED' && (
              <button
                type="submit"
                className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 focus:outline-none"
                onClick={() => handleCompleted()}
              >
                <span className="material-icons">done</span>
                <span className="ml-2">Complete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
