/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import React, { useState, useRef } from 'react';
import { Prompt } from 'react-router-dom';
import circleImage from './circle.png';
// @ts-ignore
import { SketchField, Tools } from 'react-sketch2';
import { useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, PrintFileHeader } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import {
  Appointment,
  PatientChartUpdateInput,
  MutationUpdatePatientChartArgs,
  Query,
} from '@tensoremr/models';
import { format, parseISO } from 'date-fns';
import { AddAmendmentForm } from './AddAmendmentForm';
import { useReactToPrint } from 'react-to-print';
import { getPatientAge } from '@tensoremr/util';
import { PositiveFindingsPrint } from './PositiveFindingsPrint';
import { ReviewOfSystemsPrintComponent } from './ReviewOfSystemsPrintComponent';
import HistoryPrintComponent from './HistoryPrintComponent';
import _ from 'lodash';

const UPDATE_PATIENT_CHART = gql`
  mutation UpdatePatientChart($input: PatientChartUpdateInput!) {
    updatePatientChart(input: $input) {
      id
      rightSummarySketch
      leftSummarySketch
    }
  }
`;

export const GET_DATA = gql`
  query GetData($filter: AmendmentFilter, $appointmentId: ID!) {
    amendments(filter: $filter) {
      id
      note
      createdAt
    }

    getProgressNotes(appointmentId: $appointmentId) {
      appointments {
        id
        patientChart {
          id
          summaryNote
          locked
        }
      }
    }
  }
`;

export const SummaryPage: React.FC<{
  locked: boolean;
  appointment: Appointment;
}> = ({ locked, appointment }) => {
  const bottomSheetDispatch = useBottomSheetDispatch();

  const printSectionsForm = useForm({
    defaultValues: {
      showHistory: true,
      showChiefComplaints: true,
      showVitalSigns: true,
      showPhysicalExamination: true,
      showDiagnosticProcedures: false,
      showLabratory: false,
      showDiagnosis: true,
      showDifferentialDiagnosis: false,
      showSurgery: false,
      showTreatment: false,
      showPrescriptions: false,
    },
  });

  const { data, refetch } = useQuery<Query, any>(GET_DATA, {
    variables: {
      filter: {
        patientChartId: appointment?.patientChart.id,
      },
      appointmentId: appointment.id,
    },
  });

  const notifDispatch = useNotificationDispatch();

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [showPrintButton, setShowPrintButton] = useState<boolean>(false);

  const [modified, setModified] = useState<boolean>(false);

  const [selectedColor] = useState('#000000');
  const [selectedLineWeight] = useState(3);

  const rightSummarySketch = useRef<any>(null);
  const leftSummarySketch = useRef<any>(null);

  const { register, getValues, setValue } = useForm<PatientChartUpdateInput>({
    defaultValues: {
      id: appointment.patientChart.id,
      summaryNote: appointment.patientChart.summaryNote,
      leftSummarySketch: appointment.patientChart.leftSummarySketch,
      rightSummarySketch: appointment.patientChart.rightSummarySketch,
    },
  });

  const [updatePatientChart, { loading }] = useMutation<
    any,
    MutationUpdatePatientChartArgs
  >(UPDATE_PATIENT_CHART, {
    onCompleted() {
      setModified(false);
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

  const onSave = () => {
    if (locked) {
      return;
    }

    if (appointment?.patientChart.id !== undefined) {
      const currentValues = getValues();

      const input = {
        ...currentValues,
        id: appointment.patientChart.id,
      };

      currentValues.id = appointment.patientChart.id;

      if (rightSummarySketch.current !== null) {
        input.rightSummarySketch = JSON.stringify(
          rightSummarySketch.current.toJSON()
        );
      }

      if (leftSummarySketch.current !== null) {
        input.leftSummarySketch = JSON.stringify(
          leftSummarySketch.current.toJSON()
        );
      }

      updatePatientChart({ variables: { input } });
    }
  };

  const handleInputChange = () => {
    setModified(true);
  };

  const {
    showHistory,
    showChiefComplaints,
    showVitalSigns,
    showPhysicalExamination,
    showDiagnosticProcedures,
    showLabratory,
    showDiagnosis,
    showDifferentialDiagnosis,
    showSurgery,
    showTreatment,
    showPrescriptions,
  } = printSectionsForm.watch();

  const lastProgressNote =
    data?.getProgressNotes.appointments[
      data?.getProgressNotes.appointments.length - 1
    ];

  return (
    <div className="bg-gray-600">
      <div className="w-full p-6">
        <Prompt
          when={modified}
          message="This page has unsaved data. Please click cancel and try again"
        />

        {locked && (
          <div className="bg-yellow-50 border-4 border-yellow-400">
            <div className="bg-yellow-400 p-1">
              <div className="flex text-sm items-center space-x-2">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>This patient chart has been locked</span>
              </div>
            </div>
            <div className="p-4">
              <p>You may add amendments</p>
            </div>
          </div>
        )}
        <div className="mt-5 bg-white p-4">
          <button
            type="button"
            onClick={handlePrint}
            className="flex space-x-2 items-center text-gray-600 hover:bg-teal-200 hover:text-teal-600 rounded-md px-4 py-2"
          >
            <span className="material-icons ">print</span>
            <p className="text-lg font-light">Print</p>
          </button>
          <hr className="mt-2" />
          <div className=" grid grid-cols-3 gap-3 mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showHistory"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">History</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showChiefComplaints"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">Chief Complaint</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showVitalSigns"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">Vital signs</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showPhysicalExamination"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">Physical Examination</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showDiagnosticProcedures"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">Diagnostic Procedures</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showLabratory"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">Labratory</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showDiagnosis"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">Diagnosis</span>
            </label>

            {appointment.visitType.title === 'Surgery' && (
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showSurgery"
                  ref={printSectionsForm.register}
                />
                <span className="ml-2">Surgery</span>
              </label>
            )}

            {appointment.visitType.title === 'Treatment' && (
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="showTreatment"
                  ref={printSectionsForm.register}
                />
                <span className="ml-2">Treatment</span>
              </label>
            )}

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="showPrescriptions"
                ref={printSectionsForm.register}
              />
              <span className="ml-2">Prescriptions</span>
            </label>
          </div>
        </div>

        {appointment?.patientChart.id && (
          <div
            className="mt-5"
            onMouseEnter={() => setShowPrintButton(true)}
            onMouseLeave={() => setShowPrintButton(false)}
          >
            <div className="bg-white p-6" ref={componentRef}>
              <PrintFileHeader
                // @ts-ignore
                qrUrl={`http://${process.env['NX_APP_SERVER_URL']}/#/appointments/${appointment.id}/patient-dashboard`}
              />

              <hr className="border border-solid border-teal-500 bg-teal-400 mt-5" />

              <p className="text-3xl text-gray-700 text-center mt-5">
                Visit Summary
              </p>

              <hr className="mt-5" />

              <div className="grid grid-rows-3 grid-flow-col mt-2">
                <div>
                  <span className="font-semibold">Patient:</span>{' '}
                  <span>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</span>
                </div>
                <div>
                  <span className="font-semibold">Age:</span>{' '}
                  <span>
                    {appointment &&
                      getPatientAge(appointment?.patient.dateOfBirth)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Gender:</span>{' '}
                  <span>{appointment.patient.gender}</span>
                </div>
                <div>
                  <span className="font-semibold">Provider:</span>{' '}
                  <span>{`Dr. ${appointment.providerName}`}</span>
                </div>
                <div>
                  <span className="font-semibold">Checked-In:</span>{' '}
                  <span>
                    {appointment &&
                      format(parseISO(appointment?.checkedInTime), 'Lo MMMM y')}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Visit:</span>{' '}
                  <span>{appointment.visitType.title}</span>
                </div>
                <div>
                  <span className="font-semibold">Electronic ID:</span>{' '}
                  <span>{appointment.patient.id}</span>
                </div>
              </div>

              <hr className="mt-2" />

              {showHistory && (
                <div className="mt-5">
                  {appointment.patient.patientHistory.id && (
                    <HistoryPrintComponent
                      patientHistoryId={appointment.patient.patientHistory.id}
                      onError={(message) => {
                        notifDispatch({
                          type: 'showNotification',
                          notifTitle: 'Error',
                          notifSubTitle: message,
                          variant: 'failure',
                        });
                      }}
                    />
                  )}
                </div>
              )}

              {showHistory && (
                <div className="mt-5">
                  <ReviewOfSystemsPrintComponent
                    patientHistoryId={appointment.patient.patientHistory.id}
                  />
                </div>
              )}

              <div className="mt-5">
                <PositiveFindingsPrint
                  locked={locked}
                  patientChartId={appointment?.patientChart.id}
                  showHistory={showHistory}
                  showChiefComplaints={showChiefComplaints}
                  showVitalSigns={showVitalSigns}
                  showPhysicalExamination={showPhysicalExamination}
                  showDiagnosticProcedures={showDiagnosticProcedures}
                  showLabratory={showLabratory}
                  showDiagnosis={showDiagnosis}
                  showDifferentialDiagnosis={showDifferentialDiagnosis}
                  showSurgery={showSurgery}
                  showTreatment={showTreatment}
                  showPrescriptions={showPrescriptions}
                />
              </div>

              <div className="mt-5">
                <div className="page-break" />
                <div className="mt-4">
                  <p className="text-xl tracking-wider text-gray-800 font-light">
                    Summary Notes
                  </p>
                  <hr className="my-5" />

                  {appointment.medicalDepartment === 'Ophthalmology' && (
                    <div className="mt-2">
                      <div className="grid grid-cols-2 justify-items-center mt-10">
                        <div className="col-span-1">OD</div>
                        <div className="col-span-1">OS</div>
                        <div className="col-span-1">
                          <div className="relative">
                            <div className="static top-0 left-0">
                              <img
                                className="w-60 h-52"
                                src={circleImage}
                                alt="Right Retina"
                              />
                            </div>
                            <div className="absolute top-0 left-0">
                              <SketchField
                                ref={rightSummarySketch}
                                tool={Tools.Pencil}
                                width="15rem"
                                height="13rem"
                                lineColor={selectedColor}
                                lineWidth={selectedLineWeight}
                                value={
                                  appointment?.patientChart.rightSummarySketch
                                }
                                onChange={() => {
                                  if (
                                    appointment?.patientChart.rightSummarySketch
                                  ) {
                                    if (
                                      !_.isEqual(
                                        rightSummarySketch.current.toJSON(),
                                        JSON.parse(
                                          appointment?.patientChart
                                            .rightSummarySketch
                                        )
                                      )
                                    ) {
                                      handleInputChange();
                                    }
                                  } else {
                                    if (
                                      rightSummarySketch.current.toJSON()
                                        .objects.length > 0
                                    ) {
                                      handleInputChange();
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="relative">
                            <div className="static top-0 left-0">
                              <img
                                className="w-60 h-52"
                                src={circleImage}
                                alt="Right Retina"
                              />
                            </div>
                            <div className="absolute top-0 left-0">
                              <SketchField
                                ref={leftSummarySketch}
                                tool={Tools.Pencil}
                                width="15rem"
                                height="13rem"
                                lineColor={selectedColor}
                                lineWidth={selectedLineWeight}
                                value={
                                  appointment?.patientChart.leftSummarySketch
                                }
                                onChange={() => {
                                  if (
                                    appointment?.patientChart.leftSummarySketch
                                  ) {
                                    if (
                                      !_.isEqual(
                                        leftSummarySketch.current.toJSON(),
                                        JSON.parse(
                                          appointment?.patientChart
                                            .leftSummarySketch
                                        )
                                      )
                                    ) {
                                      handleInputChange();
                                    }
                                  } else {
                                    if (
                                      leftSummarySketch.current.toJSON().objects
                                        .length > 0
                                    ) {
                                      handleInputChange();
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <button
                            className="text-gray-500 text-sm"
                            onClick={() => {
                              setValue('rightSummarySketch', '');
                              rightSummarySketch.current.clear();
                            }}
                            disabled={locked}
                          >
                            Clear
                          </button>
                        </div>
                        <div className="col-span-1">
                          <button
                            className="text-gray-500 text-sm"
                            disabled={locked}
                            onClick={() => {
                              setValue('leftSummarySketch', '');
                              leftSummarySketch.current.clear();
                            }}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-5">
                    <textarea
                      rows={10}
                      ref={register}
                      name="summaryNote"
                      className="mt-3 p-4 block w-full sm:text-md bg-gray-100 border border-gray-200 rounded-md"
                      disabled={locked}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mt-4">
                    <Button
                      pill={true}
                      loading={loading}
                      loadingText={'Saving'}
                      type="button"
                      text="Save"
                      icon="save"
                      variant="filled"
                      disabled={!modified}
                      onClick={() => onSave()}
                    />
                  </div>
                </div>
              </div>

              {locked && (
                <div className="px-5 py-5 rounded-sm mt-5">
                  <div className="flex justify-between items-center">
                    <p className="text-2xl tracking-wider text-gray-800 font-light">
                      Amendments
                    </p>
                    <button
                      className="border border-teal-800 text-teal-800 px-3 py-1 rounded-lg flex space-x-1 items-center"
                      onClick={() => {
                        bottomSheetDispatch({
                          type: 'show',
                          snapPoint: 0,
                          children: (
                            <AddAmendmentForm
                              patientChartId={appointment?.patientChart.id}
                              onSuccess={() => {
                                refetch();
                                notifDispatch({
                                  type: 'showNotification',
                                  notifTitle: 'Success',
                                  notifSubTitle: 'Amendement added',
                                  variant: 'success',
                                });
                                bottomSheetDispatch({ type: 'hide' });
                              }}
                              onError={(message) => {
                                notifDispatch({
                                  type: 'showNotification',
                                  notifTitle: 'Error',
                                  notifSubTitle: message,
                                  variant: 'failure',
                                });
                              }}
                              onCancel={() =>
                                bottomSheetDispatch({ type: 'hide' })
                              }
                            />
                          ),
                        });
                      }}
                    >
                      <div className="material-icons">add</div>
                      <p>Add Amendment</p>
                    </button>
                  </div>

                  {data?.amendments.length === 0 && (
                    <div className="bg-gray-50 mt-5 h-32 flex rounded-sm shadow-inner">
                      <div className="m-auto flex space-x-1 text-gray-500">
                        <div className="material-icons">inbox</div>
                        <p className="text-center">Nothing here yet</p>
                      </div>
                    </div>
                  )}

                  {(data?.amendments.length ?? 0) > 0 && (
                    <div className="mt-4">
                      <table className="table-auto divide-y divide-gray-200 mt-4 w-full shadow-lg rounded-lg">
                        <thead className="bg-teal-700">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                            >
                              Note
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                            >
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {data?.amendments.map((e) => (
                            <tr key={e?.id}>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {e?.note}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {format(parseISO(e?.createdAt), 'MMM d, y')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {lastProgressNote && lastProgressNote.patientChart.summaryNote && (
          <div className="mt-5">
            <button
              type="button"
              className="flex space-x-2 items-center text-blue-600 bg-blue-50 p-2 rounded-md shadow-md transform hover:scale-105"
              onClick={() => {
                setValue(
                  'summaryNote',
                  lastProgressNote.patientChart.summaryNote
                );
                handleInputChange();
              }}
            >
              <span className="material-icons">content_copy</span>
              <p>Copy Summary From Previous Chart</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
