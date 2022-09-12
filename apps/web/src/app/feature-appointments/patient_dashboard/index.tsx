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

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import classnames from 'classnames';
import { format, isSameDay, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  AccordionItem,
  IFileUploader,
  FileUploader,
  HistoryTypeComponent,
  PositiveFindings,
  DiagnosticProcedureComponent,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { AllPatientDocuments } from './AllPatientDocuments';
import {
  Appointment,
  Query,
  QueryGetPatientDiagnosticProgressArgs,
  QueryGetVitalSignsProgressArgs,
} from '@tensoremr/models';
import { getFileUrl, getPatientAge } from '@tensoremr/util';
import cn from 'classnames';
import { ProgressComponent } from './ProgressComponent';
import ProgressVitalSigns from './ProgressVitalSigns';
import { vitalSignsFragment } from '@tensoremr/util';
import ReactLoading from 'react-loading';
import { useLocation } from 'react-router-dom';

const GET_DATA = gql`
  query GetData($patientHistoryId: ID!, $patientId: ID!) {
    pastIllnesses(patientHistoryId: $patientHistoryId) {
      id
      title
      description
    }
    pastInjuries(patientHistoryId: $patientHistoryId) {
      id
      description
      injuryDate
    }
    pastHospitalizations(patientHistoryId: $patientHistoryId) {
      id
      reason
      provider
      from
      to
    }
    pastSurgeries(patientHistoryId: $patientHistoryId) {
      id
      description
      surgeryDate
    }
    lifestyles(patientHistoryId: $patientHistoryId) {
      id
      title
      description
      note
    }
    familyIllnesses(patientHistoryId: $patientHistoryId) {
      id
      title
      description
    }
    patientHistory(id: $patientHistoryId) {
      reviewOfSystemsNote
    }
    reviewOfSystems(
      page: { page: 0, size: 1000 }
      filter: { patientHistoryId: $patientHistoryId }
    ) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          systemSymptom {
            id
            title
            system {
              id
              title
            }
          }
          note
        }
      }
    }

    getPatientFiles(patientId: $patientId) {
      id
      contentType
      fileName
      extension
      hash
      size
    }

    getPatientDiagnosticProcedureTitles(patientId: $patientId)
  }
`;

const GET_ALL_PATIENT_PROGRESS = gql`
  query GetAllProgress($appointmentId: ID!, $includeAll: Boolean!) {
    getProgressNotes(appointmentId: $appointmentId) {
      appointments {
        id
        providerName
        checkInTime
        patient {
          id
          firstName
          lastName
        }
        visitType {
          id
          title
        }
        patientChart @include(if: $includeAll) {
          id
          summaryNote
          locked
          diagnoses {
            id
            differential
            location
            categoryCode
            diagnosisCode
            fullCode
            fullDescription
          }
          diagnosisNote
          differentialDiagnosisNote

          vitalSigns {
            ...VitalSignsFragment
          }

          medicalPrescriptionOrder {
            id
            medicalPrescriptions {
              id
              medication
              synonym
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

          labOrder {
            id
            labs {
              id
              labTypeTitle
            }
          }

          diagnosticProcedureOrder {
            id
            diagnosticProcedures {
              id
              diagnosticProcedureTypeTitle
            }
          }

          surgicalProcedure {
            id
            surgicalProcedureTypeTitle
            additionalNotes
          }

          treatment {
            id
            treatmentTypeTitle
          }

          treatmentOrder {
            id
            treatments {
              id
              treatmentTypeTitle
            }
          }

          surgicalOrder {
            id
            surgicalProcedures {
              id
              surgicalProcedureTypeTitle
            }
          }

          referralOrder {
            id
            referrals {
              id
              referredToName
            }
          }

          followUpOrder {
            id
            followUps {
              id
              receptionNote
            }
          }
        }
      }
    }
  }
  ${vitalSignsFragment}
`;

const GET_VITAL_SIGNS_PROGRESS = gql`
  query GetProgression($patientId: ID!) {
    getVitalSignsProgress(patientId: $patientId) {
      appointments {
        id
        patientChart {
          vitalSigns {
            ...VitalSignsFragment
          }
        }
      }
    }
  }
  ${vitalSignsFragment}
`;

const GET_PATIENT_DIAGNOSTIC_PROGRESS = gql`
  query GetPatientDiagnosticProgress(
    $patientId: ID!
    $procedureTypeTitle: String!
  ) {
    getPatientDiagnosticProgress(
      patientId: $patientId
      procedureTypeTitle: $procedureTypeTitle
    ) {
      id
      patientChart {
        diagnosticProcedureOrder {
          diagnosticProcedures {
            id
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
            diagnosticProcedureTypeTitle
            dicomStudyUid
            modalities
          }
        }
      }
    }
  }
`;
interface ProgressTypeInterface {
  title: string;
  type: 'ALL' | 'DIAGNOSTIC_PROCEDURE' | 'VITAL_SIGNS';
}

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export const PatientDashboard: React.FC<{
  locked: boolean;
  appointment: Appointment;
  onAppointmentReadOnlyClick: (appointment: Appointment) => void;
}> = ({ locked, appointment, onAppointmentReadOnlyClick }) => {
  const [patientOpen, setPatientOpen] = useState<boolean>(true);
  const bottomSheetDispatch = useBottomSheetDispatch();
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const [documentsOpen, setDocumentsOpen] = useState<boolean>(false);
  const [currentFindingsOpen, setCurrentFindingsOpen] = useState<boolean>(true);

  const notifDispatch = useNotificationDispatch();

  const query = useRouterQuery();
  const readOnly = query.get('readOnly');

  const [progressType, setProgressType] = useState<ProgressTypeInterface>({
    title: 'All',
    type: 'ALL',
  });

  const [openedAppointments, setOpenedAppointments] = useState<Array<string>>(
    []
  );

  const otherDocuments: Array<IFileUploader> =
    appointment?.patient.documents?.map((e: any) => ({
      id: e?.id,
      fileUrl: getFileUrl({
        baseUrl: import.meta.env.VITE_APP_SERVER_URL,
        fileName: e?.fileName,
        hash: e?.hash,
        extension: e?.extension,
      }),
      name: e?.fileName ?? '',
      size: e?.size,
      createdAt: e?.createdAt,
      contentType: e?.contentType ?? '',
    })) ?? [];

  const paperRecordDocument: IFileUploader | null = appointment?.patient
    .paperRecordDocument
    ? {
        id: appointment?.patient.paperRecordDocument?.id,
        fileUrl: getFileUrl({
          baseUrl: import.meta.env.VITE_APP_SERVER_URL,
          fileName: appointment?.patient.paperRecordDocument?.fileName ?? '',
          hash: appointment?.patient.paperRecordDocument?.hash ?? '',
          extension: appointment?.patient.paperRecordDocument?.extension ?? '',
        }),
        name: appointment?.patient.paperRecordDocument?.fileName ?? '',
        size: appointment?.patient.paperRecordDocument?.size,
        createdAt: appointment?.patient.paperRecordDocument?.createdAt,
        contentType:
          appointment?.patient.paperRecordDocument?.contentType ?? '',
      }
    : null;

  const progressNotesQuery = useQuery<Query, any>(GET_ALL_PATIENT_PROGRESS, {
    variables: {
      appointmentId: appointment.id,
      includeAll: true,
    },
  });

  const vitalSignsProgressQuery = useLazyQuery<
    Query,
    QueryGetVitalSignsProgressArgs
  >(GET_VITAL_SIGNS_PROGRESS);

  const diagnosticProgressQuery = useLazyQuery<
    Query,
    QueryGetPatientDiagnosticProgressArgs
  >(GET_PATIENT_DIAGNOSTIC_PROGRESS);

  useEffect(() => {
    if (progressType.type === 'VITAL_SIGNS') {
      if (appointment) {
        vitalSignsProgressQuery[0]({
          variables: {
            patientId: appointment?.patient.id,
          },
        });
      }
    } else if (progressType.type === 'DIAGNOSTIC_PROCEDURE') {
      if (appointment) {
        diagnosticProgressQuery[0]({
          variables: {
            patientId: appointment?.patient.id,
            procedureTypeTitle: progressType.title,
          },
        });
      }
    }
  }, [progressType]);

  const { data } = useQuery<Query, any>(GET_DATA, {
    variables: {
      patientHistoryId: appointment?.patient.patientHistory.id,
      appointmentId: appointment?.id,
      patientId: appointment?.patient.id,
    },
  });

  const hasPastIllnesses =
    data?.pastIllnesses && data?.pastIllnesses.length > 0;
  const hasPastInjuries = data?.pastInjuries && data?.pastInjuries.length > 0;
  const hasPastHospitalizations =
    data?.pastHospitalizations && data?.pastHospitalizations.length > 0;
  const hasPastSurgeries =
    data?.pastSurgeries && data?.pastSurgeries.length > 0;
  const hasLifestyles = data?.lifestyles && data?.lifestyles.length > 0;
  const hasFamilyIllnesses =
    data?.familyIllnesses && data?.familyIllnesses.length > 0;

  const hasHistory =
    hasPastIllnesses ||
    hasPastInjuries ||
    hasPastHospitalizations ||
    hasPastSurgeries ||
    hasLifestyles ||
    hasFamilyIllnesses;

  useEffect(() => {
    if (hasPastIllnesses) {
      setHistoryOpen(true);
    }
  }, [hasPastIllnesses]);

  const hasDocuments =
    paperRecordDocument !== null || otherDocuments.length > 0;

  useEffect(() => {
    if (hasDocuments) {
      setDocumentsOpen(true);
    } else {
      setDocumentsOpen(false);
    }
  }, [hasDocuments]);

  const handleViewAllDocumentClick = () => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 500,
      children: (
        <AllPatientDocuments
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
        />
      ),
    });
  };

  const handleAppointmentTitleClick = (appointmentId: string) => {
    if (!openedAppointments.includes(appointmentId.toString())) {
      setOpenedAppointments(
        openedAppointments.concat(appointmentId.toString())
      );
    }
  };

  const handleAppointmentClose = (appointmentId: string) => {
    const itemIdx = openedAppointments.findIndex(
      (e) => e === appointmentId.toString()
    );

    setOpenedAppointments([
      ...openedAppointments.splice(0, itemIdx),
      ...openedAppointments.slice(itemIdx + 1),
    ]);
  };

  const handleOpenFullChart = (appointment: Appointment) => {
    onAppointmentReadOnlyClick(appointment);
  };

  const creditCompany = appointment?.patient.creditCompany
    ? `(${appointment.patient.creditCompany})`
    : ``;

  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <AccordionItem
          title={
            <div className="flex items-center space-x-3">
              <span className="material-icons text-gray-600">
                person_outline
              </span>
              <AccordionTitle>{`${appointment?.patient.firstName} ${appointment?.patient.lastName}`}</AccordionTitle>
            </div>
          }
          open={patientOpen}
          onHeadingClick={(isOpen) => setPatientOpen(isOpen)}
        >
          <div className="grid grid-cols-3 gap-2">
            <div>
              <DetailLabel label="Visit Type" />
              <DetailText text={appointment?.visitType.title} />
            </div>
            <div>
              <DetailLabel label="Electronic ID" />
              <DetailText text={appointment?.patient.id} />
            </div>

            <div>
              <DetailLabel label="Age" />
              <DetailText
                text={
                  appointment && getPatientAge(appointment?.patient.dateOfBirth)
                }
              />
            </div>

            <div>
              <DetailLabel label="Gender" />
              <DetailText text={appointment?.patient.gender} />
            </div>

            <div>
              <DetailLabel label="Region" />
              <DetailText text={appointment?.patient.region} />
            </div>

            <div>
              <DetailLabel label="Woreda" />
              <DetailText text={appointment?.patient.woreda} />
            </div>

            <div>
              <DetailLabel label="Zone" />
              <DetailText text={appointment?.patient.zone} />
            </div>

            <div>
              <DetailLabel label="Memo" />
              <DetailText text={appointment?.patient.memo} />
            </div>

            <div>
              <DetailLabel label="Provider" />
              <DetailText text={`Dr. ${appointment?.providerName}`} />
            </div>

            <div>
              <DetailLabel label="Credit" />
              <DetailText
                text={appointment?.patient.credit ? `${creditCompany}` : `None`}
                className={
                  appointment.patient.credit ? 'text-red-600' : undefined
                }
              />
            </div>
          </div>
        </AccordionItem>

        <div className="flex space-x-4 mt-4">
          <AccordionItem
            title={
              <div className="flex items-center space-x-3">
                {hasHistory && (
                  <span className="rounded-full w-3 h-3 shadow-lg bg-red-500 flex items-center justify-center animate-pulse"></span>
                )}
                <span className="material-icons text-gray-600">history</span>
                <AccordionTitle>History</AccordionTitle>
              </div>
            }
            open={historyOpen}
            onHeadingClick={(isOpen) => setHistoryOpen(isOpen)}
            className="flex-1 flex flex-col"
          >
            <div
              className={classnames('bg-gray-50', {
                'rounded shadow-lg p-5': false,
              })}
            >
              <div className="grid grid-cols-2 gap-2">
                <div hidden={!hasPastIllnesses}>
                  <HistoryTypeComponent
                    title="Illnesses"
                    items={data?.pastIllnesses.map((e) => ({
                      ...e,
                      subTitle: e?.description,
                    }))}
                    isEdit={false}
                    locked={locked}
                    onAdd={() => null}
                    onUpdate={(item) => null}
                    onDelete={(id: string) => null}
                  />
                </div>

                <div hidden={!hasPastHospitalizations}>
                  <HistoryTypeComponent
                    title="Hospitalizations"
                    items={data?.pastHospitalizations.map((e) => ({
                      ...e,
                      title: e?.reason,
                      subTitle: e?.provider,
                      subTitle2: e?.from && e?.to && (
                        <p className="text-gray-500 text-sm">{`From ${format(
                          parseISO(e?.from),
                          'dd/MM/yyyy'
                        )} to ${format(parseISO(e?.to), 'dd/MM/yyyy')}`}</p>
                      ),
                    }))}
                    isEdit={false}
                    locked={locked}
                    onAdd={() => null}
                    onUpdate={(item) => null}
                    onDelete={() => null}
                  />
                </div>

                <div hidden={!hasPastInjuries}>
                  <HistoryTypeComponent
                    title="Injuries"
                    items={data?.pastInjuries.map((e) => ({
                      ...e,
                      title: e?.description,
                    }))}
                    locked={locked}
                    isEdit={false}
                    onAdd={() => null}
                    onUpdate={(item) => null}
                    onDelete={(id: string) => null}
                  />
                </div>

                <div hidden={!hasPastSurgeries}>
                  <HistoryTypeComponent
                    title="Surgeries"
                    items={data?.pastSurgeries.map((e) => ({
                      ...e,
                      title: e?.description,
                      subTitle:
                        e?.surgeryDate &&
                        format(parseISO(e?.surgeryDate), 'dd/MM/yyyy'),
                    }))}
                    isEdit={false}
                    locked={locked}
                    onAdd={() => null}
                    onUpdate={(item) => null}
                    onDelete={(id: string) => null}
                  />
                </div>

                <div hidden={!hasFamilyIllnesses}>
                  <HistoryTypeComponent
                    title="Family Illness"
                    items={data?.familyIllnesses.map((e) => ({
                      ...e,
                      title: e?.title,
                      subTitle: e?.description,
                    }))}
                    locked={locked}
                    isEdit={false}
                    onAdd={() => null}
                    onUpdate={(item) => null}
                    onDelete={(id: string) => null}
                  />
                </div>

                <div hidden={!hasLifestyles}>
                  <HistoryTypeComponent
                    title="Lifestyle"
                    items={data?.lifestyles.map((e) => ({
                      ...e,
                      title: e?.title,
                      subTitle: e?.description,
                      subTitle2: e?.note,
                    }))}
                    locked={locked}
                    isEdit={false}
                    onAdd={() => null}
                    onUpdate={(item) => null}
                    onDelete={(id: string) => null}
                  />
                </div>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem
            title={
              <div className="flex items-center space-x-3">
                {hasDocuments && (
                  <span className="rounded-full w-3 h-3 shadow-lg bg-red-500 flex items-center justify-center animate-pulse"></span>
                )}

                <span className="material-icons text-gray-600">
                  description
                </span>
                <AccordionTitle>Documents</AccordionTitle>
              </div>
            }
            open={documentsOpen}
            onHeadingClick={(isOpen) => setDocumentsOpen(isOpen)}
            className="flex-1 flex flex-col"
          >
            <div>
              {paperRecordDocument && (
                <div className="my-1">
                  <p className="text-lg text-gray-700">Paper Record</p>
                  <div className="mt-2">
                    <FileUploader
                      multiSelect={false}
                      values={[paperRecordDocument]}
                      accept={'document'}
                      onError={(message) => {
                        notifDispatch({
                          type: 'showNotification',
                          notifTitle: 'Error',
                          notifSubTitle: message,
                          variant: 'failure',
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {(data?.getPatientFiles.length ?? 0) > 0 && (
                <div className="my-1"></div>
              )}

              {otherDocuments.length > 0 && (
                <div>
                  <p className="mt-10 text-lg text-gray-700">Other documents</p>
                  <div className="mt-2">
                    <FileUploader
                      multiSelect={false}
                      values={otherDocuments}
                      accept={'document'}
                      onError={(message) => {
                        notifDispatch({
                          type: 'showNotification',
                          notifTitle: 'Error',
                          notifSubTitle: message,
                          variant: 'failure',
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionItem>
        </div>

        <AccordionItem
          title={
            <div className="flex items-center space-x-3">
              <span className="material-icons text-gray-600">find_in_page</span>
              <AccordionTitle>Current findings</AccordionTitle>
            </div>
          }
          className="mt-4"
          open={currentFindingsOpen}
          onHeadingClick={(isOpen) => setCurrentFindingsOpen(isOpen)}
        >
          {appointment?.patientChart.id && (
            <PositiveFindings
              locked={locked}
              patientChartId={appointment?.patientChart.id}
              onSuccess={(message) => {
                notifDispatch({
                  type: 'showNotification',
                  notifTitle: 'Success',
                  notifSubTitle: message,
                  variant: 'success',
                });
              }}
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
        </AccordionItem>
      </div>

      {!readOnly &&
        (progressNotesQuery.data?.getProgressNotes.appointments.length ?? 0) >
          0 && (
          <div className="w-2/5 bg-white shadow-md">
            <div>
              <div className="flex items-center space-x-3 rounded-t-md p-3">
                <span className="material-icons text-gray-600">timeline</span>
                <div>
                  <AccordionTitle>Progress Timeline</AccordionTitle>
                </div>
              </div>

              <div className="bg-white mt-2 px-2">
                <div className="w-full flex flex-wrap -m-1">
                  <ProgressChip
                    title="All"
                    progressType={progressType}
                    setProgressType={() =>
                      setProgressType({ title: 'All', type: 'ALL' })
                    }
                  />

                  <ProgressChip
                    title="Vital Signs"
                    progressType={progressType}
                    setProgressType={() =>
                      setProgressType({
                        title: 'Vital Signs',
                        type: 'VITAL_SIGNS',
                      })
                    }
                  />

                  {data?.getPatientDiagnosticProcedureTitles.map((e) => (
                    <ProgressChip
                      key={e}
                      title={e}
                      progressType={progressType}
                      setProgressType={() =>
                        setProgressType({
                          title: e,
                          type: 'DIAGNOSTIC_PROCEDURE',
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4">
                {progressNotesQuery.loading ? (
                  <div className="flex items-center justify-center my-4">
                    {/* @ts-ignore */}
                    <ReactLoading
                      type={'spinningBubbles'}
                      color={'gray'}
                      height={40}
                      width={40}
                      className="inline-block"
                    />
                  </div>
                ) : (
                  progressNotesQuery.data?.getProgressNotes?.appointments.map(
                    (e) => (
                      <div key={e?.id}>
                        {e ? (
                          <ProgressContainer
                            key={e?.id}
                            appointment={e}
                            onAppointmentClose={handleAppointmentClose}
                            onAppointmentTitleClick={
                              handleAppointmentTitleClick
                            }
                            onOpenFullChart={handleOpenFullChart}
                            openPositiveFindings={openedAppointments.includes(
                              e.id.toString()
                            )}
                            isToday={e?.id === appointment.id}
                            locked={locked}
                            onSuccess={(message) => {
                              notifDispatch({
                                type: 'showNotification',
                                notifTitle: 'Success',
                                notifSubTitle: message,
                                variant: 'success',
                              });
                            }}
                            onError={(message) => {
                              notifDispatch({
                                type: 'showNotification',
                                notifTitle: 'Error',
                                notifSubTitle: message,
                                variant: 'failure',
                              });
                            }}
                          >
                            {progressNotesQuery.loading ||
                            vitalSignsProgressQuery[1].loading ? (
                              <div className="flex items-center justify-center my-4">
                                {/* @ts-ignore */}
                                <ReactLoading
                                  type={'spinningBubbles'}
                                  color={'gray'}
                                  height={40}
                                  width={40}
                                  className="inline-block"
                                />
                              </div>
                            ) : (
                              <div>
                                {progressType.type === 'ALL' && (
                                  <Progress
                                    appointment={e}
                                    progressType={progressType}
                                    onSuccess={(message) => {
                                      notifDispatch({
                                        type: 'showNotification',
                                        notifTitle: 'Success',
                                        notifSubTitle: message,
                                        variant: 'success',
                                      });
                                    }}
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

                                {progressType.type === 'VITAL_SIGNS' && (
                                  <Progress
                                    appointment={vitalSignsProgressQuery[1].data?.getVitalSignsProgress.appointments.find(
                                      (v) =>
                                        v?.id?.toString() === e.id?.toString()
                                    )}
                                    progressType={progressType}
                                    onSuccess={(message) => {
                                      notifDispatch({
                                        type: 'showNotification',
                                        notifTitle: 'Success',
                                        notifSubTitle: message,
                                        variant: 'success',
                                      });
                                    }}
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

                                {progressType.type ===
                                  'DIAGNOSTIC_PROCEDURE' && (
                                  <Progress
                                    appointment={diagnosticProgressQuery[1].data?.getPatientDiagnosticProgress.find(
                                      (d) =>
                                        d?.id.toString() === e.id.toString()
                                    )}
                                    progressType={progressType}
                                    onSuccess={(message) => {
                                      notifDispatch({
                                        type: 'showNotification',
                                        notifTitle: 'Success',
                                        notifSubTitle: message,
                                        variant: 'success',
                                      });
                                    }}
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
                          </ProgressContainer>
                        ) : (
                          <div />
                        )}
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

interface ProgressContainerProps {
  isToday: boolean;
  appointment: Appointment;
  openPositiveFindings: boolean;
  onAppointmentTitleClick: (appointmentId: string) => void;
  onAppointmentClose: (appointmentId: string) => void;
  onOpenFullChart: (appointment: Appointment) => void;
  children: any;
  locked: boolean;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const ProgressContainer: React.FC<ProgressContainerProps> = ({
  isToday,
  appointment,
  openPositiveFindings,
  onAppointmentTitleClick,
  onAppointmentClose,
  onOpenFullChart,
  children,
  locked,
  onSuccess,
  onError,
}) => {
  const getVisitTypeTitle = (appointment: Appointment) => {
    if (appointment.visitType.title === 'Surgery') {
      return `${appointment.patientChart.surgicalProcedure.surgicalProcedureTypeTitle} Surgery`;
    } else if (appointment.visitType.title === 'Treatment') {
      return `${appointment.patientChart.treatment.treatmentTypeTitle} Treatment`;
    } else {
      return appointment.visitType.title;
    }
  };

  const sameDay = isSameDay(
    new Date(),
    parseISO(appointment.checkInTime.split('T')[0])
  );

  return (
    <div className="rounded-lg shadow-xl bg-gray-50">
      <div className="flex justify-between items-center space-x-2 bg-gray-100 p-4">
        <div>
          <p className="text-sm">
            {sameDay
              ? 'Today'
              : format(
                  parseISO(appointment.checkInTime.split('T')[0]),
                  'MMM d, y'
                )}
          </p>
          <div
            className="flex space-x-1 cursor-pointer"
            onClick={() => {
              if (openPositiveFindings) {
                onAppointmentClose(appointment.id);
              } else {
                onAppointmentTitleClick(appointment.id);
              }
            }}
          >
            <p className="material-icons md-18 text-teal-800">
              {openPositiveFindings ? 'close_fullscreen' : 'aspect_ratio'}
            </p>
            <p className="text-sm underline text-teal-600">
              {openPositiveFindings ? 'Close' : 'Expand'}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-right">{getVisitTypeTitle(appointment)}</p>
          <p className="text-sm text-teal-600 text-right">{`Dr. ${appointment.providerName}`}</p>
        </div>
      </div>

      {openPositiveFindings ? (
        <div className="shadow-lg p-4 bg-teal-50">
          <PositiveFindings
            locked={locked}
            patientChartId={appointment?.patientChart.id}
            onSuccess={onSuccess}
            onError={onError}
          />
          <div className="flex mt-4">
            <button
              type="button"
              onClick={() => onOpenFullChart(appointment)}
              className="flex space-x-1 items-center text-blue-600 text-sm transform hover:scale-105"
            >
              <p className="material-icons">open_in_new</p>
              <p className="underline">Open full chart</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-1 px-4">{children}</div>
      )}
    </div>
  );
};

interface ProgressProps {
  appointment: Appointment | undefined | null;
  progressType: ProgressTypeInterface;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const Progress: React.FC<ProgressProps> = ({
  appointment,
  progressType,
  onSuccess,
  onError,
}) => {
  if (appointment) {
    if (progressType.type === 'ALL') {
      return <ProgressComponent patientChart={appointment.patientChart} />;
    } else if (progressType.type === 'VITAL_SIGNS') {
      return (
        <ProgressVitalSigns
          vitalSigns={appointment.patientChart.vitalSigns}
          showEmpty={true}
        />
      );
    } else if (progressType.type === 'DIAGNOSTIC_PROCEDURE') {
      return (
        <div>
          {(appointment.patientChart.diagnosticProcedureOrder
            ?.diagnosticProcedures.length ?? 0) === 0 && (
            <div className="flex justify-center items-center my-4">
              <div className="flex space-x-1 text-gray-400">
                <span className="material-icons">hourglass_empty</span>
                <p>Empty</p>
              </div>
            </div>
          )}

          {appointment.patientChart.diagnosticProcedureOrder?.diagnosticProcedures.map(
            (e) => (
              <div className="mt-3">
                <DiagnosticProcedureComponent
                  readOnly
                  values={e}
                  onRefersh={() => null}
                  onSuccess={onSuccess}
                  onError={onError}
                />
              </div>
            )
          )}
        </div>
      );
    }
  }

  return <div />;
};

const ProgressChip: React.FC<{
  title: string;
  progressType: ProgressTypeInterface;
  setProgressType: (e: ProgressTypeInterface) => void;
}> = ({ title, progressType, setProgressType }) => {
  return (
    <button
      onClick={() =>
        setProgressType({
          title: 'Vital Signs',
          type: 'VITAL_SIGNS',
        })
      }
      className={cn(
        'items-center rounded-full m-1 transform hover:scale-105 px-4 py-1 shadow-lg tracking-wide',
        {
          'bg-gradient-to-r from-teal-500 to-teal-600 text-teal-200':
            progressType.title === title,
          'bg-gray-50 text-teal-600': progressType.title !== title,
        }
      )}
    >
      <p className="text-xs font-semibold">{title.toUpperCase()}</p>
    </button>
  );
};

const AccordionTitle: React.FC<{ children: any }> = ({ children }) => {
  return <p className="text-lg text-gray-700">{children}</p>;
};

const DetailLabel: React.FC<{ label: string }> = ({ label }) => {
  return <p className="font-semibold text-gray-700">{label}</p>;
};

const DetailText: React.FC<{
  text: string | undefined;
  className?: string;
}> = ({ text, className }) => {
  const cn = className ? className : 'text-teal-600';
  return <p className={cn}>{text}</p>;
};
