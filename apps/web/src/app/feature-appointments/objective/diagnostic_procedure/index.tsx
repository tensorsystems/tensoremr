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

import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { DiagnosticProcedureComponent } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { DiagnosticProcedureTypes } from './DiagnosticProcedureTypes';
import {
  DiagnosticProcedureStatus,
  DiagnosticProcedureType,
  PatientChart,
  Query,
  QueryDiagnosticProcedureOrderArgs,
} from '@tensoremr/models';
import classnames from 'classnames';
import { OrderDiagnosticProcedureForm } from './OrderDiagnosticProcedureForm';

export const GET_DIAGNOSTIC_PROCEDURE_ORDER = gql`
  query DiagnosticProcedureOrder($patientChartId: ID!) {
    diagnosticProcedureOrder(patientChartId: $patientChartId) {
      status
      createdAt
      diagnosticProcedures {
        id
        orderNote
        generalText
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
        status
        patientChartId
        diagnosticProcedureTypeTitle
        diagnosticProcedureType {
          id
          title
        }
        images {
          id
          size
          hash
          fileName
          extension
          contentType
          createdAt
        }
        documents {
          id
          size
          hash
          fileName
          extension
          contentType
          createdAt
        }
        payments {
          id
          status
          invoiceNo
        }
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation DeleteDiagnosticProcedure($id: ID!) {
    deleteDiagnosticProcedure(id: $id)
  }
`;

export const DiagnosticProcedurePage: React.FC<{
  locked: boolean;
  patientId: string | undefined;
  appointmentId: string | undefined;
  patientChart: PatientChart;
  medicalDepartment: string | undefined | null;
}> = ({
  locked,
  patientId,
  appointmentId,
  patientChart,
  medicalDepartment,
}) => {
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

  const { data, refetch, error } = useQuery<
    Query,
    QueryDiagnosticProcedureOrderArgs
  >(GET_DIAGNOSTIC_PROCEDURE_ORDER, {
    variables: {
      patientChartId: patientChart.id,
    },
  });

  const [isOrderExpanded, setIsOrderExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (
      data &&
      data.diagnosticProcedureOrder.diagnosticProcedures.length > 0 &&
      data.diagnosticProcedureOrder.diagnosticProcedures.every((e) =>
        e?.payments.every((i) => i.status === 'PAID')
      )
    ) {
      setIsOrderExpanded(true);
    } else {
      setIsOrderExpanded(false);
    }
  }, [data]);

  const [cancelOrder] = useMutation<any, any>(CANCEL_ORDER, {
    onCompleted(data) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'Order cancelled successfully',
        variant: 'success',
      });

      refetch();
    },
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const handleProcedureClick = (item: DiagnosticProcedureType | undefined) => {
    if (patientChart?.id) {
      bottomSheetDispatch({
        type: 'show',
        snapPoint: 0,
        children: (
          <OrderDiagnosticProcedureForm
            patientId={patientId}
            patientChartId={patientChart.id}
            appointmentId={appointmentId}
            diagnosticProcedureType={item}
            onSuccess={() => {
              refetch();
              notifDispatch({
                type: 'show',
                notifTitle: 'Success',
                notifSubTitle: 'Procedure ordered successfully',
                variant: 'success',
              });
              bottomSheetDispatch({ type: 'hide' });
            }}
            onCancel={() => bottomSheetDispatch({ type: 'hide' })}
          />
        ),
      });
    }
  };

  return (
    <div className="flex space-x-6">
      <div className="w-1/3" hidden={isOrderExpanded}>
        <DiagnosticProcedureTypes
          locked={locked}
          onItemClick={handleProcedureClick}
        />
      </div>
      <div className="flex-1 bg-gray-50 rounded shadow-lg p-5">
        <div className="flex items-center space-x-4">
          <div>
            <button
              type="button"
              onClick={() => setIsOrderExpanded(!isOrderExpanded)}
            >
              {isOrderExpanded ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-2xl text-gray-600 font-bold">
            Diagnostic Procedures
          </p>
        </div>

        <hr className="mt-4 mb-4" />

        {((data?.diagnosticProcedureOrder.diagnosticProcedures.length ?? 0) ===
          0 ||
          error?.message === 'record not found') && (
          <div className="bg-gray-100 mt-5 flex h-44 rounded-sm shadow-inner">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-icons">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}

        {error?.message !== 'record not found' &&
          data?.diagnosticProcedureOrder.diagnosticProcedures.map((e, i) => (
            <div
              key={e?.id}
              className={classnames('rounded-lg shadow-lg py-3 px-3 bg-white', {
                'mt-5': i !== 0,
                'border-l-4 border-teal-600':
                  e?.status === DiagnosticProcedureStatus.Completed,
              })}
            >
              <div className="flex justify-between items-center">
                <p className="text-2xl tracking-wider text-gray-800 font-light">
                  {e?.diagnosticProcedureType.title}
                </p>
                {!e?.payments.every((e) => e.status === 'PAID') && (
                  <button
                    className="border border-red-600 text-red-800 px-2 text-sm py-1 rounded-lg flex space-x-1 items-center"
                    onClick={() => {
                      if (e?.id) {
                        cancelOrder({ variables: { id: e?.id } });
                      }
                    }}
                  >
                    <div className="material-icons">close</div>
                    <p>Cancel order</p>
                  </button>
                )}
              </div>

              {e.orderNote.length > 0 && (
                <div className="mt-4 flex space-x-2 items-center">
                  <span className="material-icons text-yellow-600">
                    bookmark
                  </span>
                  <input
                    disabled
                    type="text"
                    name="orderNote"
                    id="orderNote"
                    value={e.orderNote}
                    className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md bg-gray-100"
                  />
                </div>
              )}
              <div className="mt-8">
                <DiagnosticProcedureComponent
                  values={e}
                  readOnly={locked}
                  onRefersh={() => {
                    refetch();
                  }}
                  onSuccess={(message: string) => {
                    notifDispatch({
                      type: 'show',
                      notifTitle: 'Success',
                      notifSubTitle: message,
                      variant: 'success',
                    });
                  }}
                  onError={(message: string) => {
                    notifDispatch({
                      type: 'show',
                      notifTitle: 'Error',
                      notifSubTitle: message,
                      variant: 'failure',
                    });
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
