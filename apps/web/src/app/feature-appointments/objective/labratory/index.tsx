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
import { LabTypesComponent } from './LabTypes';
import classnames from 'classnames';
import { LabComponent } from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  LabStatus,
  LabType,
  PatientChart,
  Query,
  QueryLabOrderArgs,
} from '@tensoremr/models';
import { OrderLabForm } from './OrderLabForm';

const GET_LAB_ORDER = gql`
  query LabOrder($patientChartId: ID!) {
    labOrder(patientChartId: $patientChartId) {
      status
      createdAt
      labs {
        id
        orderNote
        generalText
        status
        labType {
          id
          title
        }
        cbcWbcActive
        cbcWbcResults
        cbcWbcDate
        cbcHgbActive
        cbcHgbResults
        cbcHgbDate
        cbcHctActive
        cbcHctResults
        cbcHctDate
        cbcEsrActive
        cbcEsrResults
        cbcEsrDate
        cbcBloodGroupActive
        cbcBloodGroupResults
        cbcBloodGroupDate
        cbcRhActive
        cbcRhResults
        cbcRhDate
        cbcBloodFilmActive
        cbcBloodFilmResults
        cbcBloodFilmDate
        cbcPltActive
        cbcPltResults
        cbcPltDate
        liverCoagulationPtActive
        liverCoagulationPtResults
        liverCoagulationPtDate
        liverCoagulationPttActive
        liverCoagulationPttResults
        liverCoagulationPttDate
        liverCoagulationInrActive
        liverCoagulationInrResults
        liverCoagulationInrDate
        liverAstsgotActive
        liverAstsgotResults
        liverAstsgotDate
        liverAltsgptActive
        liverAltsgptResults
        liverAltsgptDate
        liverAlpActive
        liverAlpResults
        liverAlpDate
        renalCrActive
        renalCrResults
        renalCrDate
        renalBunActive
        renalBunResults
        renalBunDate
        thyroidFreeT3Active
        thyroidFreeT3Results
        thyroidFreeT3Date
        thyroidTotalT4Active
        thyroidTotalT4Results
        thyroidTotalT4Date
        thyroidTshActive
        thyroidTshResults
        thyroidTshDate
        electrolytesNaPlusActive
        electrolytesNaPlusResults
        electrolytesNaPlusDate
        electrolytesKPlusActive
        electrolytesKPlusResults
        electrolytesKPlusDate
        electrolytesClMinusActive
        electrolytesClMinusResults
        electrolytesClMinusDate
        electrolytesCa2PlusActive
        electrolytesCa2PlusResults
        electrolytesCa2PlusDate
        electrolytesMg2PlusActive
        electrolytesMg2PlusResults
        electrolytesMg2PlusDate
        electrolytesPMinusActive
        electrolytesPMinusResults
        electrolytesPMinusDate
        stoolConsistencyActive
        stoolConsistencyResults
        stoolConsistencyDate
        stoolOpActive
        stoolOpResults
        stoolOpDate
        stoolConcentrationActive
        stoolConcentrationResults
        stoolConcentrationDate
        stoolOccultBloodActive
        stoolOccultBloodResults
        stoolOccultBloodDate
        microscopyEpitCellsActive
        microscopyEpitCellsResults
        microscopyEpitCellsDate
        microscopyWbcActive
        microscopyWbcResults
        microscopyWbcDate
        microscopyRbcActive
        microscopyRbcResults
        microscopyRbcDate
        microscopyCastsActive
        microscopyCastsResults
        microscopyCastsDate
        microscopyCrystalsActive
        microscopyCrystalsResults
        microscopyCrystalsDate
        microscopyBacteriaActive
        microscopyBacteriaResults
        microscopyBacteriaDate
        microscopyHcgActive
        microscopyHcgResults
        microscopyHcgDate
        urinalysisColorActive
        urinalysisColorResults
        urinalysisColorDate
        urinalysisAppearanceActive
        urinalysisAppearanceResults
        urinalysisAppearanceDate
        urinalysisPhActive
        urinalysisPhResults
        urinalysisPhDate
        urinalysisSgActive
        urinalysisSgResults
        urinalysisSgDate
        urinalysisProteinActive
        urinalysisProteinResults
        urinalysisProteinDate
        urinalysisGlucoseActive
        urinalysisGlucoseResults
        urinalysisGlucoseDate
        urinalysisLeukocyteActive
        urinalysisLeukocyteResults
        urinalysisLeukocyteDate
        urinalysisKetoneActive
        urinalysisKetoneResults
        urinalysisKetoneDate
        urinalysisBilirubinActive
        urinalysisBilirubinResults
        urinalysisBilirubinDate
        urinalysisUrobilingenActive
        urinalysisUrobilingenResults
        urinalysisUrobilingenDate
        urinalysisBloodActive
        urinalysisBloodResults
        urinalysisBloodDate
        serologyVdrlActive
        serologyVdrlResults
        serologyVdrlDate
        serologyWidalHActive
        serologyWidalHResults
        serologyWidalHDate
        serologyWidalOActive
        serologyWidalOResults
        serologyWidalODate
        serologyWeilFelixActive
        serologyWeilFelixResults
        serologyWeilFelixDate
        serologyHbsAgActive
        serologyHbsAgResults
        serologyHbsAgDate
        serologyHcvAbActive
        serologyHcvAbResults
        serologyHcvAbDate
        serologyAsoActive
        serologyAsoResults
        serologyAsoDate
        serologyRfActive
        serologyRfResults
        serologyRfDate
        serologyHpayloryAgActive
        serologyHpayloryAgResults
        serologyHpayloryAgDate
        serologyHpyloryAbActive
        serologyHpyloryAbResults
        serologyHpyloryAbDate
        bacterologySampleActive
        bacterologySampleResults
        bacterologySampleDate
        bacterologyKohActive
        bacterologyKohResults
        bacterologyKohDate
        bacterologyGramStainActive
        bacterologyGramStainResults
        bacterologyGramStainDate
        bacterologyWetFilmActive
        bacterologyWetFilmResults
        bacterologyWetFilmDate
        bacterologyAfb1Active
        bacterologyAfb1Results
        bacterologyAfb1Date
        bacterologyAfb2Active
        bacterologyAfb2Results
        bacterologyAfb2Date
        bacterologyAfb3Active
        bacterologyAfb3Results
        bacterologyAfb3Date
        bacterologyCultureActive
        bacterologyCultureResults
        bacterologyCultureDate
        chemistryFbsRbsActive
        chemistryFbsRbsResults
        chemistryFbsRbsDate
        chemistrySgotActive
        chemistrySgotResults
        chemistrySgotDate
        chemistrySgptActive
        chemistrySgptResults
        chemistrySgptDate
        chemistryAlkalinePhosphatesActive
        chemistryAlkalinePhosphatesResults
        chemistryAlkalinePhosphatesDate
        chemistryBilirubinTotalActive
        chemistryBilirubinTotalResults
        chemistryBilirubinTotalDate
        chemistryBilirubinDirectActive
        chemistryBilirubinDirectResults
        chemistryBilirubinDirectDate
        chemistryUreaActive
        chemistryUreaResults
        chemistryUreaDate
        chemistryBunActive
        chemistryBunResults
        chemistryBunDate
        chemistryCreatnineActive
        chemistryCreatnineResults
        chemistryCreatnineDate
        chemistryUricAcidActive
        chemistryUricAcidResults
        chemistryUricAcidDate
        chemistryTotalProteinActive
        chemistryTotalProteinResults
        chemistryTotalProteinDate
        chemistryTriglyceridesActive
        chemistryTriglyceridesResults
        chemistryTriglyceridesDate
        chemistryCholestrolActive
        chemistryCholestrolResults
        chemistryCholestrolDate
        chemistryHdlActive
        chemistryHdlResults
        chemistryHdlDate
        chemistryLdlActive
        chemistryLdlResults
        chemistryLdlDate
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
        }
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation DeleteLab($id: ID!) {
    deleteLab(id: $id)
  }
`;

export const LabPage: React.FC<{
  locked: boolean;
  patientId: string | undefined;
  patientChart: PatientChart;
  appointmentId: string | undefined;
}> = ({ locked, patientChart, appointmentId, patientId }) => {
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

  const { data, refetch, error } = useQuery<Query, QueryLabOrderArgs>(
    GET_LAB_ORDER,
    {
      variables: {
        patientChartId: patientChart.id,
      },
    }
  );

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

  const [isOrderExpanded, setIsOrderExpanded] = useState<boolean>(false);
  useEffect(() => {
    if (
      data &&
      data.labOrder.labs.length > 0 &&
      data.labOrder.labs.every((e) =>
        e?.payments.every((i) => i.status === 'PAID')
      )
    ) {
      setIsOrderExpanded(true);
    } else {
      setIsOrderExpanded(false);
    }
  }, [data]);

  const handleProcedureClick = (item: LabType | undefined) => {
    if (patientChart?.id) {
      bottomSheetDispatch({
        type: 'show',
        snapPoint: 0,
        children: (
          <OrderLabForm
            patientId={patientId}
            patientChartId={patientChart.id}
            appointmentId={appointmentId}
            labType={item}
            onSuccess={() => {
              refetch();
              notifDispatch({
                type: 'show',
                notifTitle: 'Success',
                notifSubTitle: 'Lab ordered successfully',
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
        <LabTypesComponent locked={locked} onItemClick={handleProcedureClick} />
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
          <p className="text-2xl text-gray-600 font-bold">Labs</p>
        </div>

        <hr className="mt-4 mb-4" />

        {((data?.labOrder.labs.length ?? 0) === 0 ||
          error?.message === 'record not found') && (
          <div className="bg-gray-100 mt-5 flex h-44 rounded-sm shadow-inner">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-icons">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}

        {error?.message !== 'record not found' &&
          data?.labOrder.labs.map((e, i) => (
            <div
              key={e?.id}
              className={classnames('rounded-lg shadow-lg py-3 px-3 bg-white', {
                'mt-5': i !== 0,
                'border-l-2 border-teal-600': e?.status === LabStatus.Completed,
              })}
            >
              <div className="flex justify-between items-center">
                <p className="text-2xl tracking-wider text-gray-800 font-light">
                  {e?.labType.title}
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

              <div className="mt-5">
                <LabComponent
                  values={e}
                  readOnly={locked}
                  onRefresh={() => {
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
