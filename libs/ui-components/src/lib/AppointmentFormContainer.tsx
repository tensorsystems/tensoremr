import React, { useState, useEffect } from 'react';
import {
  AppointmentInput,
  MutationNewAppointmentArgs,
  QueryPayForConsultationArgs,
  QueryPatientArgs,
  QueryPatientEncounterLimitByUserArgs,
  QuerySearchAppointmentsArgs,
  AppointmentUpdateInput,
  PaginationInput,
  Query,
} from '@tensoremr/models';
import { formatDate } from '@tensoremr/util';
import { useForm } from 'react-hook-form';
import { SHOULD_PAY_FOR_CONSULTATION } from '@tensoremr/util';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { format, getDay, parseISO } from 'date-fns';
import _ from 'lodash';
import { AppointmentForm } from './AppointmentForm';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';

const APPOINTMENT_LOOKUPS = gql`
  query AppointmentLookups($page: PaginationInput!, $userTypeTitle: String!) {
    rooms(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }

    visitTypes(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }

    consultationBillings {
      id
      item
      code
      price
      credit
      remark
    }

    appointmentStatuses(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }

    getByUserTypeTitle(input: $userTypeTitle) {
      id
      firstName
      lastName
    }
  }
`;

const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      id
      checkInTime
      checkedInTime
      credit
      userId
      visitType {
        id
      }
      room {
        id
      }
    }
  }
`;

const SEARCH_APPOINTMENTS = gql`
  query SearchAppointments(
    $input: AppointmentSearchInput!
    $page: PaginationInput!
  ) {
    searchAppointments(input: $input, page: $page) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          providerName
          checkInTime
          checkedInTime
          checkedOutTime
          patient {
            id
            firstName
            lastName
            phoneNo
          }
          room {
            id
            title
          }
          visitType {
            id
            title
          }
          appointmentStatus {
            id
            title
          }
        }
      }
    }
  }
`;

export const SAVE_APPOINTMENT = gql`
  mutation SaveAppointment($input: AppointmentInput!) {
    newAppointment(input: $input) {
      id
    }
  }
`;

const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

const GET_PATIENT_ENCOUNTER_LIMIT = gql`
  query PatientEncounterLimit($userId: ID!) {
    patientEncounterLimitByUser(userId: $userId) {
      id
      userId
      mondayLimit
      tuesdayLimit
      wednesdayLimit
      thursdayLimit
      fridayLimit
      saturdayLimit
      sundayLimit
      overbook
    }
  }
`;

const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($input: AppointmentUpdateInput!) {
    updateAppointment(input: $input) {
      id
    }
  }
`;

interface Props {
  patientId: string;
  updateId?: string;
  defaultValues?: AppointmentInput;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
  onCancel: () => void;
}

export const AppointmentFormContainer: React.FC<Props> = ({
  patientId,
  updateId,
  defaultValues,
  onSuccess,
  onFailure,
  onCancel,
}) => {
  const [paginationInput] = useState<PaginationInput>({
    page: 1,
    size: 1000,
  });

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<AppointmentInput>({
      defaultValues: defaultValues,
    });

  const [dailyLimit, setDailyLimit] = useState<number>(-1);

  const appointmentInput = watch();

  const [shouldPayForConsultation, setShouldPayForConsultation] =
    useState<boolean>(true);

  useEffect(() => {
    setDefaultOrganizationDetails();
  }, []);

  const setDefaultOrganizationDetails = () => {
    const organizationDetailsSession = sessionStorage.getItem(
      'organizationDetails'
    );
    if (organizationDetailsSession) {
      const organizationDetails = JSON.parse(organizationDetailsSession);
      if (organizationDetails.defaultMedicalDepartment === 'General Medicine') {
        setValue('medicalDepartment', 'General Medicine');
      } else if (
        organizationDetails.defaultMedicalDepartment === 'Ophthalmology'
      ) {
        setValue('medicalDepartment', 'Ophthalmology');
      } else {
        setValue('medicalDepartment', 'General Medicine');
      }
    }
  };

  const [save, result] = useMutation<any, MutationNewAppointmentArgs>(
    SAVE_APPOINTMENT,
    {
      onCompleted(data) {
        notifDispatch({
          type: 'show',
          notifTitle: 'Success',
          notifSubTitle: `${patientQuery.data?.patient.firstName} ${patientQuery.data?.patient.lastName} has been scheduled successfully`,
          variant: 'success',
        });
        bottomSheetDispatch({ type: 'hide' });
        onSuccess(
          `${patientQuery.data?.patient.firstName} ${patientQuery.data?.patient.lastName} has been scheduled successfully`
        );
      },
      onError(error) {
        onFailure(error.message);
      },
    }
  );

  const updateMutation = useMutation<any, any>(UPDATE_APPOINTMENT, {
    onCompleted(data) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: `${patientQuery.data?.patient.firstName} ${patientQuery.data?.patient.lastName} has been scheduled successfully`,
        variant: 'success',
      });
      bottomSheetDispatch({ type: 'hide' });
      onSuccess(
        `${patientQuery.data?.patient.firstName} ${patientQuery.data?.patient.lastName} has been scheduled successfully`
      );
    },
    onError(error) {
      onFailure(error.message);
    },
  });

  const lookupQuery = useQuery<Query, any>(APPOINTMENT_LOOKUPS, {
    variables: {
      page: paginationInput,
      userTypeTitle: 'Physician',
      patientId: patientId,
    },
  });

  const shouldPayForConsultationQuery = useLazyQuery<
    Query,
    QueryPayForConsultationArgs
  >(SHOULD_PAY_FOR_CONSULTATION, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (appointmentInput.checkInTime) {
      shouldPayForConsultationQuery[0]({
        variables: {
          patientId,
          date: new Date(appointmentInput.checkInTime),
        },
      });
    }
  }, [appointmentInput.checkInTime]);

  useEffect(() => {
    if (!updateId) {
      if (shouldPayForConsultationQuery[1].called) {
        if (shouldPayForConsultationQuery[1].data?.payForConsultation) {
          setShouldPayForConsultation(true);
        } else {
          setShouldPayForConsultation(false);
        }
      }
    } else {
      setShouldPayForConsultation(false);
    }
  }, [shouldPayForConsultationQuery[1].data?.payForConsultation, updateId]);

  const patientQuery = useQuery<Query, QueryPatientArgs>(GET_PATIENT, {
    variables: { id: patientId },
  });

  const patientEncounterLimitQuery = useLazyQuery<
    Query,
    QueryPatientEncounterLimitByUserArgs
  >(GET_PATIENT_ENCOUNTER_LIMIT, {
    fetchPolicy: 'network-only',
  });

  const patientEncounterLimit =
    patientEncounterLimitQuery[1].data?.patientEncounterLimitByUser;

  const providerAppointmentsQuery = useLazyQuery<
    Query,
    QuerySearchAppointmentsArgs
  >(SEARCH_APPOINTMENTS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (appointmentInput.userId && appointmentInput.checkInTime) {
      providerAppointmentsQuery[0]({
        variables: {
          page: { page: 0, size: 100 },
          input: {
            userId: appointmentInput.userId,
            checkInTime: new Date(appointmentInput.checkInTime),
          },
        },
      });

      patientEncounterLimitQuery[0]({
        variables: {
          userId: appointmentInput.userId,
        },
      });
    }
  }, [appointmentInput.userId, appointmentInput.checkInTime]);

  const appointmentQuery = useLazyQuery<Query, any>(GET_APPOINTMENT, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (updateId !== undefined) {
      appointmentQuery[0]({
        variables: { id: updateId },
      }).then((result) => {
        const appointment = result.data?.appointment;
        if (appointment) {
          reset({
            userId: appointment.userId,
            roomId: appointment.room.id.toString(),
            visitTypeId: appointment.visitType.id.toString(),
            checkInTime: format(
              parseISO(appointment.checkInTime),
              "yyyy-MM-dd'T'HH:mm"
            ),
          });

          setDefaultOrganizationDetails();
        }
      });
    }
  }, [updateId]);

  useEffect(() => {
    if (appointmentInput.checkInTime && patientEncounterLimit) {
      const checkInTime = parseISO(appointmentInput.checkInTime);

      const day = getDay(checkInTime);
      switch (day) {
        case 0:
          setDailyLimit(patientEncounterLimit.sundayLimit);
          break;
        case 1:
          setDailyLimit(patientEncounterLimit.mondayLimit);
          break;
        case 2:
          setDailyLimit(patientEncounterLimit.tuesdayLimit);
          break;
        case 3:
          setDailyLimit(patientEncounterLimit.wednesdayLimit);
          break;
        case 4:
          setDailyLimit(patientEncounterLimit.thursdayLimit);
          break;
        case 5:
          setDailyLimit(patientEncounterLimit.fridayLimit);
          break;
        case 6:
          setDailyLimit(patientEncounterLimit.saturdayLimit);
          break;
      }
    }
  }, [appointmentInput.checkInTime, patientEncounterLimit]);

  const handleCheckInTimeChange = () => {
    if (updateId !== undefined) {
      appointmentQuery[1].refetch();
    }
  };

  const onSubmit = (input: any) => {
    input.patientId = patientQuery.data?.patient.id;
    input.checkInTime = formatDate(input.checkInTime);
    input.credit = false;
    input.emergency = input.emergency === 'true';

    if (updateId !== undefined) {
      const updateInput = input as AppointmentUpdateInput;
      updateInput.id = updateId;

      updateMutation[0]({
        variables: { input: updateInput },
      });
    } else {
      save({ variables: { input: input as AppointmentInput } });
    }
  };

  const providerAppointments =
    providerAppointmentsQuery[1].data?.searchAppointments;
  const scheduledToday = providerAppointments?.totalCount ?? 0;
  const overbook = patientEncounterLimit?.overbook ?? 0;

  const bookingLeft = dailyLimit - scheduledToday;
  const overbooked =
    dailyLimit < scheduledToday && scheduledToday < dailyLimit + overbook;
  const fullyBooked = scheduledToday >= dailyLimit + overbook;

  const isCheckedIn = !_.isEmpty(
    appointmentQuery[1].data?.appointment.checkedInTime
  );

  const showProviderStats =
    appointmentInput.userId !== undefined &&
    appointmentInput.userId.length > 0 &&
    appointmentInput.checkInTime !== undefined &&
    appointmentInput.checkInTime.length > 0;

  let providerStatus: null | 'AVAILABLE' | 'OVERBOOKED' | 'FULLY_BOOKED' =
    'AVAILABLE';
  if (showProviderStats) {
    if (!overbooked && !fullyBooked) {
      providerStatus = 'AVAILABLE';
    }

    if (overbooked && !fullyBooked) {
      providerStatus = 'OVERBOOKED';
    }

    if (fullyBooked) {
      providerStatus = 'FULLY_BOOKED';
    }
  } else {
    providerStatus = null;
  }

  return (
    <AppointmentForm
      error={result.error}
      patientId={patientId}
      patientName={`${patientQuery.data?.patient.firstName} ${patientQuery.data?.patient.lastName}`}
      isCheckedIn={isCheckedIn}
      bookingLeft={bookingLeft}
      scheduledToday={scheduledToday}
      shouldPayForConsultation={shouldPayForConsultation}
      providerStatus={providerStatus}
      providers={lookupQuery.data?.getByUserTypeTitle}
      rooms={lookupQuery.data?.rooms.edges.map((e) => e?.node)}
      visitTypes={lookupQuery.data?.visitTypes.edges.map((e) => e?.node)}
      consultationBillings={lookupQuery.data?.consultationBillings}
      register={register}
      onCheckInTimeChange={handleCheckInTimeChange}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
