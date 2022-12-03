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
import { useForm } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import {
  DiagnosticProcedure,
  EyewearPrescriptionOrder,
  MutationUpdateEyewearPrescriptionOrderArgs,
  Query,
  QueryAppointmentArgs,
} from '@tensoremr/models';
import { EyewearPrescriptionPrint } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';

const GET_DATA = gql`
  query GetData($patientChartId: ID!, $userId: ID!) {
    eyewearPrescriptionOrder(patientChartId: $patientChartId) {
      id
      eyewearShopId
      firstName
      lastName
      phoneNo
      userName
      createdAt
      eyewearPrescriptions {
        id
        glass
        plastic
        singleVision
        photoChromatic
        polarized
        polarizedClip
        glareFree
        scratchResistant
        bifocal
        progressive
        twoSeparateGlasses
        highIndex
        tint
        blueCut
        prescribedDate
        history
        status
      }
    }

    refraction(patientChartId: $patientChartId) {
      id
      rightDistanceSubjectiveSph
      leftDistanceSubjectiveSph
      rightDistanceSubjectiveCyl
      leftDistanceSubjectiveCyl
      rightDistanceSubjectiveAxis
      leftDistanceSubjectiveAxis
      rightNearSubjectiveSph
      leftNearSubjectiveSph
      rightNearSubjectiveCyl
      leftNearSubjectiveCyl
      rightNearSubjectiveAxis
      leftNearSubjectiveAxis
      rightDistanceObjectiveSph
      leftDistanceObjectiveSph
      rightDistanceObjectiveCyl
      leftDistanceObjectiveCyl
      rightDistanceObjectiveAxis
      leftDistanceObjectiveAxis
      rightNearObjectiveSph
      leftNearObjectiveSph
      rightNearObjectiveCyl
      leftNearObjectiveCyl
      rightNearObjectiveAxis
      leftNearObjectiveAxis
      rightDistanceFinalSph
      leftDistanceFinalSph
      rightDistanceFinalCyl
      leftDistanceFinalCyl
      rightDistanceFinalAxis
      leftDistanceFinalAxis
      rightNearFinalSph
      leftNearFinalSph
      rightNearFinalCyl
      leftNearFinalCyl
      rightNearFinalAxis
      leftNearFinalAxis
      rightVisualAcuity
      leftVisualAcuity
      farPd
      nearPd
    }

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
      userTypes {
        id
        title
      }
    }

    patientChart(id: $patientChartId) {
      appointmentId
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

const UPDATE_EYEWEAR_PRESCRIPTION_ORDER = gql`
  mutation UpdateEyewearPrescriptionOrder(
    $input: EyewearPrescriptionOrderUpdateInput!
  ) {
    updateEyewearPrescriptionOrder(input: $input) {
      id
    }
  }
`;

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  item: EyewearPrescriptionOrder;
}

export const CompleteEyewearPrescriptionOrder: React.FC<Props> = ({
  onCancel,
  onSuccess,
  item,
}) => {
  const notifDispatch = useNotificationDispatch();
  const refractionForm = useForm<DiagnosticProcedure>();
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

  const [updateEyewearPrescriptionOrder] = useMutation<
    any,
    MutationUpdateEyewearPrescriptionOrderArgs
  >(UPDATE_EYEWEAR_PRESCRIPTION_ORDER, {
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
    updateEyewearPrescriptionOrder({
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

          {appointment && data?.user && data?.eyewearPrescriptionOrder && (
            <EyewearPrescriptionPrint
              patient={appointment.patient}
              user={data.user}
              refraction={data.refraction}
              eyewearPrescriptionOrder={data?.eyewearPrescriptionOrder}
            />
          )}
        </div>
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
  );
};
