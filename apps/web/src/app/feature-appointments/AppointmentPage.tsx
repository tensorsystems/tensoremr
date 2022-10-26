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

import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { ChiefComplaints } from './subjective/chief_complaints';
import { PastMedicalHistoryPage } from './subjective/past_medical_history';
import { PatientDashboard } from './patient_dashboard';
import { OphthalmologyVitalSigns } from './objective/vital_signs/OphthalmologyVitalSigns';
import { SideNav } from './components/SideNav';
import { OphthalmologyExamination } from './objective/physical_examination/OphthalmologyExamination';
import { DiagnosisPage } from './assessment/diagnosis';
import { DifferentialDiagnosisPage } from './assessment/differential_diagnosis';
import { LabPage } from './objective/labratory';
import { PrescriptionPage } from './plan/prescription';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { SurgeryPage } from './plan/surgery';
import { PreOpPage } from './objective/pre_op';
import { IntraOpPage } from './objective/intra_operation';
import { TreatmentPlanPage } from './plan/treatment';
import { TreatmentObjectivePage } from './objective/treatment';
import { SummaryPage } from './summary';
import { PastMedicationsAllergies } from './subjective/past_medication_allergies';
import { Stickie } from './components/StickieComponent';
import { VisionSideInfo } from './components/VisionSideInfo';
import { IopSideInfo } from './components/IopSideInfo';
import { MedicationSideInfo } from './components/MedicationSideInfo';
import { ReferralPage } from './plan/referral';
import ReactLoading from 'react-loading';
import {
  Appointment,
  Destination,
  MutationCheckOutPatientArgs,
  MutationDeleteFromQueueArgs,
  MutationLockPatientChartArgs,
  MutationPushPatientQueueArgs,
  Query,
  Page,
} from '@tensoremr/models';
import { parseJwt } from '@tensoremr/util';
import { FollowUpPage } from './plan/follow_up';
import { PreanestheticPage } from './objective/pre_anesthetic';
import { Modal } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { MedicalCertificatePage } from './medical_certificate';
import { ReviewOfSystemsPage } from './subjective/review_of_systems';
import { GeneralVitalSigns } from './objective/vital_signs/GeneralVitalSigns';
import { GeneralExamination } from './objective/physical_examination/GeneralExamination';
import { useForm } from 'react-hook-form';
import { DiagnosticProcedurePage } from './objective/diagnostic_procedure';
import { format, parseISO } from 'date-fns';
import { MedicationsPage } from './subjective/medications';
import { SocialHistoryPage } from './subjective/social_history';
import { FamilyHistoryPage } from './subjective/family_history';
import PocketBaseClient from '../pocketbase-client';

export const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      id
      checkedInTime
      emergency
      medicalDepartment
      queueId
      userId
      patient {
        id
        firstName
        lastName
        gender
        dateOfBirth
        city
        memo
        credit
        creditCompany
        woreda
        zone
        subCity
        region
        patientHistory {
          id
          reviewOfSystemsNote
        }
        paperRecordDocument {
          id
          contentType
          fileName
          extension
          hash
          size
        }
        documents {
          id
          contentType
          fileName
          extension
          hash
          size
        }
      }
      patientChart {
        id
        diagnosisNote
        differentialDiagnosisNote
        chiefComplaintsNote
        stickieNote
        summaryNote
        rightSummarySketch
        leftSummarySketch
        medicalRecommendation
        sickLeave
        illnessType
        bloodPressure
        locked
        lockedDate
        lockedById
        amendments {
          id
          note
          createdAt
        }
      }
      providerName
      visitType {
        id
        title
      }
      room {
        title
      }
      appointmentStatus {
        title
      }
      providerName
    }
  }
`;

const LOCK_PATIENT_CHART = gql`
  mutation LockPatientChart($id: ID!) {
    lockPatientChart(id: $id) {
      id
    }
  }
`;

const PUSH_PATIENT_QUEUE = gql`
  mutation PushPatientQueue(
    $patientQueueId: ID!
    $appointmentId: ID!
    $destination: Destination!
  ) {
    pushPatientQueue(
      patientQueueId: $patientQueueId
      appointmentId: $appointmentId
      destination: $destination
    ) {
      id
    }
  }
`;

const DELETE_FROM_QUEUE = gql`
  mutation DeleteFromQueue($patientQueueId: ID!, $appointmentId: ID!) {
    deleteFromQueue(
      patientQueueId: $patientQueueId
      appointmentId: $appointmentId
    ) {
      id
    }
  }
`;

const CHECK_OUT_PATIENT = gql`
  mutation CheckOutPatient($patientQueueId: ID!, $appointmentId: ID!) {
    checkOutPatient(
      patientQueueId: $patientQueueId
      appointmentId: $appointmentId
    ) {
      id
    }
  }
`;

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export const AppointmentPage: React.FC<{
  onUpdateTab?: (page: any) => void;
  onAddPage: (page: Page) => void;
  onTabClose: (route: string) => void;
}> = ({ onUpdateTab, onAddPage, onTabClose }) => {
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  const { appointmentId } = useParams<{ appointmentId: string }>();

  const query = useRouterQuery();
  const queryQueueId = query.get('queueId');

  const notifDispatch = useNotificationDispatch();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [showRightBar, setShowRightBar] = useState<boolean>(true);
  const [isReceptionist, setIsReceptionist] = useState<boolean>(false);
  const [isNurse, setIsNurse] = useState<boolean>(false);
  const [isPhysician, setIsPhysician] = useState<boolean>(false);
  const [showQueueModel, setShowQueueModal] = useState<boolean>(false);
  const [soapType, setSoapType] = useState<
    'regular' | 'surgical' | 'treatment'
  >('regular');
  const [showExampleAlert] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>('');
  const [lockPatientChart, setLockPatientChart] = useState({
    openConfirmationDialog: false,
    confirmation: false,
  });

  const [patientChartLocked, setPatientChartLocked] = useState<boolean>(false);

  const queueForm = useForm({
    defaultValues: {
      queue: 'REMOVE_FROM_QUEUE',
    },
  });

  const { data, refetch } = useQuery<Query, any>(GET_APPOINTMENT, {
    variables: { id: appointmentId },
  });

  useEffect(() => {
    const user = PocketBaseClient.authStore.model?.export();

    if (user) {
      const profile = user.profile;
      if (profile.role === 'Receptionist') {
        setIsReceptionist(true);
      }

      if (profile.role === 'Nurse') {
        setIsNurse(true);
      }

      if (profile.role === 'Physician') {
        setIsPhysician(true);
      }
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token !== null) {
      const claim = parseJwt(token);
      setUserType(claim.UserType);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.pathname.length > 0) {
      const split = location.pathname.split('/');
      const path = split[split.length - 1];
      if (path === 'patient-dashboard') {
        setShowRightBar(true);
      } else {
        setShowRightBar(false);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (data?.appointment.visitType.title === 'Surgery') {
      setSoapType('surgical');
    } else if (data?.appointment.visitType.title === 'Treatment') {
      setSoapType('treatment');
    } else {
      setSoapType('regular');
    }
  }, [data]);

  useEffect(() => {
    const patientChartId = data?.appointment.patientChart.id;

    if (patientChartId && lockPatientChart.confirmation) {
      lockPatientChartMutation({ variables: { id: patientChartId } });
    }
  }, [data?.appointment.patientChart, lockPatientChart]);

  useEffect(() => {
    if (data?.appointment.patientChart) {
      const locked = data?.appointment.patientChart.locked ?? false;
      setPatientChartLocked(locked);
    }
  }, [data?.appointment.patientChart]);

  useEffect(() => {
    // if (data?.appointment && onUpdateTab) {
    //   const page: any = {
    //     title: `Appointment - ${data.appointment.patient.firstName} ${data.appointment.patient.lastName}`,
    //     route: `/appointments/${data.appointment.id}/patient-dashboard`,
    //     icon: (
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         stroke="currentColor"
    //         className="h-4 w-4"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    //         />
    //       </svg>
    //     ),
    //   };
    //   onUpdateTab(page);
    // }
  }, [data]);

  const [lockPatientChartMutation] = useMutation<
    any,
    MutationLockPatientChartArgs
  >(LOCK_PATIENT_CHART, {
    onCompleted(data) {
      refetch();
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

  const [pushPatientQueue] = useMutation<any, MutationPushPatientQueueArgs>(
    PUSH_PATIENT_QUEUE,
    {
      onCompleted(data) {
        let route = `/appointments/${appointmentId}/patient-dashboard`;

        if (queryQueueId != null) {
          route = route + `?queueId=${queryQueueId}`;
        }

        setShowQueueModal(false);
        onTabClose(route);
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const [removeFromQueue] = useMutation<any, MutationDeleteFromQueueArgs>(
    DELETE_FROM_QUEUE,
    {
      onCompleted() {
        let route = `/appointments/${appointmentId}/patient-dashboard`;

        if (queryQueueId != null) {
          route = route + `?queueId=${queryQueueId}`;
        }

        setShowQueueModal(false);
        onTabClose(route);
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const [checkOutPatient] = useMutation<any, MutationCheckOutPatientArgs>(
    CHECK_OUT_PATIENT,
    {
      onCompleted(data) {
        let route = `/appointments/${appointmentId}/patient-dashboard`;

        if (queryQueueId != null) {
          route = route + `?queueId=${queryQueueId}`;
        }

        setShowQueueModal(false);
        onTabClose(route);
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const handleSaveChange = (saving: boolean) => {
    if (saving) {
      setIsSaving(true);
    } else {
      setIsSaving(false);
      setLastSaved(new Date());
    }
  };

  const handleAppointmentClick = (
    appointment: Appointment,
    readOnly?: boolean
  ) => {
    const checkInTime = format(
      parseISO(appointment.checkInTime.split('T')[0]),
      'MMM d, y'
    );

    let route = `/appointments/${appointment.id}/patient-dashboard`;

    if (readOnly) {
      route = route + `?readOnly=true`;
    }

    const page: Page = {
      title: `Appointment ${checkInTime} - ${appointment.patient.firstName} ${appointment.patient.lastName}`,
      cancellable: true,
      route: route,
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    };

    onAddPage(page);

    history.push(route);
  };

  if (
    data?.appointment === undefined ||
    data.appointment.patientChart === undefined
  ) {
    return (
      <div className="flex justify-center mt-10 h-screen">
        {/* @ts-ignore */}
        <ReactLoading
          type={'spinningBubbles'}
          color={'gray'}
          height={70}
          width={70}
          className="inline-block"
        />
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex space-x-5">
        <div className="flex-initial">
          <div className="sticky" style={{ top: '139px' }}>
            {queryQueueId && (
              <div className="bg-white hover:bg-gray-100 shadow-lg rounded-md px-3 py-2 mb-2">
                <div className="w-full">
                  <button
                    type="button"
                    className="flex items-center justify-center space-x-2 rounded-md w-full"
                    onClick={() => setShowQueueModal(true)}
                  >
                    <span className="material-icons text-teal-500 animate-pulse">
                      schedule
                    </span>
                    <span className="text-gray-600">{`${data?.appointment.patient.firstName} ${data?.appointment.patient.lastName}`}</span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <SideNav
                soapType={soapType}
                userType={userType}
                matchUrl={match.url}
                location={`${history.location.pathname}${location.search}`}
                medicalDepartment={
                  data.appointment.medicalDepartment === 'General Medicine'
                    ? 'General Medicine'
                    : 'Ophthalmology'
                }
                locked={data?.appointment.patientChart.locked ?? false}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          {showExampleAlert && (
            <div className=" bg-yellow-50 border-4 border-yellow-400">
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
                  <span>
                    Surgical Fitness: This patient is not fit for surgery
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p>
                  This patients was designated unfit for surgery during
                  Preanesthetic evaluation
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-600 rounded-sm text-white"
                  >
                    Accept Recommendation
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded-sm"
                  >
                    Decline
                  </button>
                </div>
                <div className="mt-4 flex items-center space-x-5">
                  <div>Acknowledge Reason</div>
                  <div className="flex-1">
                    <hr />
                  </div>
                </div>
                <div className="mt-2 flex space-x-2 text-sm">
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded-sm text-gray-700 shadow-sm"
                  >
                    Consider at next visit
                  </button>

                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded-sm text-gray-700 shadow-sm"
                  >
                    Consider in 3 months
                  </button>

                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded-sm text-gray-700 shadow-sm"
                  >
                    Not recommended
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 bg-gray-200 rounded-sm text-gray-700 shadow-sm"
                  >
                    Other
                  </button>
                </div>
              </div>
            </div>
          )}

          <Switch>
            <Route path={`${match.path}/history`}>
              {data?.appointment && (
                <PastMedicalHistoryPage
                  appointment={data?.appointment}
                  onSaveChange={handleSaveChange}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/medications`}>
              <MedicationsPage />
            </Route>

            <Route path={`${match.path}/social-history`}>
              <SocialHistoryPage />
            </Route>

            <Route path={`${match.path}/family-history`}>
              <FamilyHistoryPage />
            </Route>

            <Route path={`${match.path}/past-medications-allergies`}>
              <PastMedicationsAllergies
                patientChartId={data?.appointment.patientChart.id}
                patientHistoryId={data?.appointment.patient.patientHistory.id}
                patientId={data?.appointment.patient.id}
                locked={patientChartLocked}
              />
            </Route>

            <Route path={`${match.path}/chief-complaints`}>
              <ChiefComplaints
                locked={patientChartLocked}
                patientChartId={data?.appointment.patientChart.id}
                onSaveChange={handleSaveChange}
              />
            </Route>

            <Route exact={false} path={`${match.path}/ros`}>
              {data?.appointment.patient.patientHistory.id && (
                <ReviewOfSystemsPage
                  patientHistory={data?.appointment.patient.patientHistory}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/vital-signs`}>
              {data?.appointment.medicalDepartment === 'Ophthalmology' &&
                data?.appointment.patientChart.id && (
                  <OphthalmologyVitalSigns
                    patientChartId={data?.appointment.patientChart.id}
                    onSaveChange={handleSaveChange}
                    locked={patientChartLocked}
                  />
                )}

              {data?.appointment.medicalDepartment === 'General Medicine' &&
                data?.appointment.patientChart.id &&
                data?.appointment.patient && (
                  <GeneralVitalSigns
                    patient={data?.appointment.patient}
                    patientChartId={data?.appointment.patientChart.id}
                    locked={patientChartLocked}
                  />
                )}
            </Route>

            <Route path={`${match.path}/examination`}>
              {data?.appointment.medicalDepartment === 'Ophthalmology' &&
                data?.appointment.patientChart.id && (
                  <OphthalmologyExamination
                    patientChartId={data?.appointment.patientChart.id}
                    onSaveChange={handleSaveChange}
                    locked={patientChartLocked}
                  />
                )}

              {data?.appointment.medicalDepartment === 'General Medicine' &&
                data?.appointment.patientChart.id && (
                  <GeneralExamination
                    patientChartId={data?.appointment.patientChart.id}
                    locked={patientChartLocked}
                  />
                )}
            </Route>

            <Route path={`${match.path}/diagnostics`}>
              <DiagnosticProcedurePage
                patientId={data?.appointment.patient.id}
                patientChart={data?.appointment.patientChart}
                appointmentId={data?.appointment.id}
                medicalDepartment={data?.appointment.medicalDepartment}
                locked={patientChartLocked}
              />
            </Route>

            <Route path={`${match.path}/labratory`}>
              {data?.appointment.patientChart && (
                <LabPage
                  patientId={data?.appointment.patient.id}
                  patientChart={data?.appointment.patientChart}
                  appointmentId={data?.appointment.id}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/pre-op`}>
              <PreOpPage
                locked={patientChartLocked}
                patientChartId={data?.appointment.patientChart.id}
              />
            </Route>

            <Route path={`${match.path}/pre-anesthetic`}>
              {data?.appointment.patientChart && (
                <PreanestheticPage
                  patientChartId={data.appointment.patientChart.id}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/intra-op`}>
              <IntraOpPage
                patientChartId={data?.appointment.patientChart.id}
                locked={patientChartLocked}
              />
            </Route>

            <Route path={`${match.path}/tx-objective`}>
              {data?.appointment.patientChart && (
                <TreatmentObjectivePage
                  patientChartId={data?.appointment.patientChart.id}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/diagnosis`}>
              <DiagnosisPage
                patientChartId={data?.appointment.patientChart.id}
                medicalDepartment={data?.appointment.medicalDepartment}
                onSaveChange={handleSaveChange}
                locked={patientChartLocked}
              />
            </Route>

            <Route path={`${match.path}/differential-diagnosis`}>
              <DifferentialDiagnosisPage
                patientChartId={data?.appointment.patientChart.id}
                medicalDepartment={data?.appointment.medicalDepartment}
                onSaveChange={handleSaveChange}
                locked={patientChartLocked}
              />
            </Route>

            <Route path={`${match.path}/surgery`}>
              {data?.appointment.patient.id && (
                <SurgeryPage
                  patientId={data?.appointment.patient.id}
                  patientChart={data?.appointment.patientChart}
                  appointmentId={data?.appointment.id}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/tx-plan`}>
              {data?.appointment.patient.id && (
                <TreatmentPlanPage
                  patientId={data?.appointment.patient.id}
                  patientChart={data?.appointment.patientChart}
                  appointmentId={data?.appointment.id}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/rx`}>
              {data?.appointment.patientChart.id && (
                <PrescriptionPage
                  appointmentId={data?.appointment.id}
                  patientChartId={data?.appointment.patientChart.id}
                  patientId={data?.appointment.patient.id}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/follow-up`}>
              <FollowUpPage
                patientChartId={data?.appointment.patientChart.id}
                patientId={data?.appointment.patient.id}
              />
            </Route>

            <Route path={`${match.path}/referral`}>
              <ReferralPage
                patientId={data?.appointment.patient.id}
                patientChartId={data?.appointment.patientChart.id}
              />
            </Route>

            <Route path={`${match.path}/medical-certificate`}>
              {data?.appointment && (
                <MedicalCertificatePage
                  baseUrl={import.meta.env.VITE_APP_SERVER_URL}
                  appointment={data?.appointment}
                />
              )}
            </Route>

            <Route path={`${match.path}/summary`}>
              {data?.appointment && (
                <SummaryPage
                  appointment={data?.appointment}
                  locked={patientChartLocked}
                />
              )}
            </Route>

            <Route path={`${match.path}/patient-dashboard`}>
              <PatientDashboard
                appointment={data?.appointment}
                onAppointmentReadOnlyClick={(appointment) =>
                  handleAppointmentClick(appointment, true)
                }
                locked={patientChartLocked}
              />
            </Route>
          </Switch>
        </div>
        {showRightBar && (
          <div className="w-44">
            <div className="sticky top-36">
              <div>
                <Stickie
                  stickieNote={data?.appointment.patientChart.stickieNote}
                  patientChartId={data?.appointment.patientChart.id}
                />
              </div>

              <div className="mt-5">
                <VisionSideInfo
                  patientChartId={data?.appointment.patientChart.id}
                />
              </div>

              <div className="mt-5">
                <IopSideInfo
                  patientChartId={data?.appointment.patientChart.id}
                />
              </div>
              <div className="mt-5">
                <MedicationSideInfo patientId={data?.appointment.patient.id} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        open={lockPatientChart.openConfirmationDialog}
        title={'Lock patient chart'}
        description={
          <p className="text-sm text-gray-500">
            You are about to lock this patient chart. Do you want to continue?
          </p>
        }
        positive={'Continue'}
        negative={'Cancel'}
        onNegativeClick={() => {
          setLockPatientChart({
            openConfirmationDialog: false,
            confirmation: false,
          });
        }}
        onPositiveClick={() => {
          setLockPatientChart({
            openConfirmationDialog: false,
            confirmation: true,
          });
        }}
        onClose={() => {
          setLockPatientChart({
            openConfirmationDialog: false,
            confirmation: false,
          });
        }}
      />

      <Modal
        open={showQueueModel}
        title={`${data?.appointment.patient.firstName} ${data?.appointment.patient.lastName}`}
        description={
          <div className="mt-5 w-full">
            <div className="border border-gray-300 p-2 rounded-md mt-2 w-full">
              <label className="inline-flex items-center w-full">
                <input
                  type="radio"
                  name="queue"
                  value={'REMOVE_FROM_QUEUE'}
                  ref={queueForm.register({ required: true })}
                />
                <span className="ml-2">Remove from my queue</span>
              </label>
            </div>

            {isPhysician && (
              <div className="border border-gray-300 p-2 rounded-md mt-2 w-full">
                <label className="inline-flex items-center w-full">
                  <input
                    type="radio"
                    name="queue"
                    value={'CHECK_OUT'}
                    ref={queueForm.register({ required: true })}
                  />
                  <span className="ml-2">Check Out</span>
                </label>
              </div>
            )}

            {!isPhysician && (
              <div className="border border-gray-300 p-2 rounded-md mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="queue"
                    value={'SEND_TO_PHYSICIAN'}
                    ref={queueForm.register({ required: true })}
                  />
                  <span className="ml-2">Send Chart to Physician</span>
                </label>
              </div>
            )}
          </div>
        }
        positive={'Continue'}
        negative={'Cancel'}
        onNegativeClick={() => {
          setShowQueueModal(false);
        }}
        onPositiveClick={() => {
          const values = queueForm.getValues();
          if (values.queue) {
            if (values.queue === 'SEND_TO_PHYSICIAN' && queryQueueId) {
              pushPatientQueue({
                variables: {
                  patientQueueId: queryQueueId,
                  appointmentId: appointmentId,
                  destination: Destination.Physician,
                },
              });
            } else if (values.queue === 'REMOVE_FROM_QUEUE' && queryQueueId) {
              removeFromQueue({
                variables: {
                  patientQueueId: queryQueueId,
                  appointmentId: appointmentId,
                },
              });
            } else if (values.queue === 'CHECK_OUT' && queryQueueId) {
              checkOutPatient({
                variables: {
                  patientQueueId: queryQueueId,
                  appointmentId: appointmentId,
                },
              });
            }
          }
        }}
        onClose={() => {
          setShowQueueModal(false);
        }}
      />
    </div>
  );
};

const ClinicalDecisionSupport: React.FC = () => {
  return (
    <div className="shadow overflow-hidden rounded-lg text-sm">
      <p className="px-4 py-2 bg-teal-700 text-left text-gray-50 uppercase tracking-wider">
        CDS
      </p>
      <div className="p-2 bg-white">
        <ul>
          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-10 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text">
              This is a test clinicial decision support system
            </p>
          </li>
          <li className="flex items-center space-x-2 border-t mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-10 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text">
              This is a test clinicial decision support system
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

const DiagnosisComponent: React.FC = () => {
  return (
    <div className="shadow overflow-hidden rounded-lg text-xs">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={1}
              className="px-3 py-2 bg-teal-700 text-left text-gray-50 uppercase tracking-wider"
            >
              Diagnosis
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-2">
          <tr className="text-gray-800">
            <td className="p-2">ARIC OU</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
