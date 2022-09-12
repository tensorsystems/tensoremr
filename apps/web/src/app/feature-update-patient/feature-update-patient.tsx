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
import { format, subMonths, subYears } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import {
  Component404,
  IFileUploader,
  PatientRegistrationContactInfoForm,
  PatientRegistrationDemographicForm,
  PatientRegistrationDocumentsForm,
  PatientRegistrationEmergencyInfoForm,
  PatientRegistrationLayout,
} from '@tensoremr/ui-components';
import {
  FileUpload,
  MutationUpdatePatientArgs,
  PatientUpdateInput,
  Query,
  Page,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { formatDate, getFileUrl } from '@tensoremr/util';

const PATIENT_DETAILS = gql`
  query PatientDetails($id: ID!) {
    patient(id: $id) {
      id
      firstName
      lastName
      dateOfBirth

      gender
      idNo
      occupation
      martialStatus
      memo
      phoneNo
      phoneNo2
      homePhone
      region
      credit
      creditCompany
      city
      subCity
      kebele
      woreda
      email
      houseNo
      emergencyContactRel
      emergencyContactName
      emergencyContactMemo
      emergencyContactPhone
      emergencyContactPhone2
      paperRecord
      cardNo
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
  }
`;

const UPDATE_PATIENT = gql`
  mutation UpdatePatient($input: PatientUpdateInput!) {
    updatePatient(input: $input) {
      id
    }
  }
`;

interface Props {
  onAddPage: (page: Page) => void;
}

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export const UpdatePatientPage: React.FC<Props> = ({ onAddPage }) => {
  const query = useRouterQuery();
  const queryPatientId = query.get('patientId');

  const notifDispatch = useNotificationDispatch();

  const { register, handleSubmit, reset, watch } = useForm<PatientUpdateInput>({
    defaultValues: {
      paperRecord: false,
    },
  });

  const { data, refetch } = useQuery<Query, any>(PATIENT_DETAILS, {
    variables: {
      id: queryPatientId,
    },
  });

  useEffect(() => {
    if (data?.patient) {
      const patient = data.patient;

      reset({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: format(parseISO(patient.dateOfBirth), 'yyyy-MM-dd'),
        gender: patient.gender,
        idNo: patient.idNo,
        martialStatus: patient.martialStatus,
        occupation: patient.occupation,
        memo: patient.memo,
        phoneNo: patient.phoneNo,
        phoneNo2: patient.phoneNo2,
        homePhone: patient.homePhone,
        region: patient.region,
        woreda: patient.woreda,
        zone: patient.zone,
        kebele: patient.kebele,
        city: patient.city,
        subCity: patient.subCity,
        houseNo: patient.houseNo,
        email: patient.email,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactRel: patient.emergencyContactRel,
        emergencyContactPhone: patient.emergencyContactPhone,
        emergencyContactPhone2: patient.emergencyContactPhone2,
        emergencyContactMemo: patient.emergencyContactMemo,
        paperRecord: patient.paperRecord,
        cardNo: patient.cardNo,
        credit: patient.credit,
        creditCompany: patient.creditCompany,
      });

      if (patient.paperRecordDocument) {
        const document: IFileUploader = {
          id: patient?.paperRecordDocument?.id,
          fileUrl: getFileUrl({
            // @ts-ignore
            baseUrl: import.meta.env.APP_SERVER_URL,
            fileName: patient?.paperRecordDocument?.fileName,
            hash: patient?.paperRecordDocument?.hash,
            extension: patient?.paperRecordDocument?.extension,
          }),
          name: patient?.paperRecordDocument?.fileName ?? '',
          size: patient?.paperRecordDocument?.size,
          createdAt: patient?.paperRecordDocument?.createdAt,
          contentType: patient?.paperRecordDocument?.contentType ?? '',
        };

        setPaperRecordDocument([document]);
      }

      const otherDocuments: Array<IFileUploader> =
        patient?.documents?.map((e: any) => ({
          id: e?.id,
          fileUrl: getFileUrl({
            // @ts-ignore
            baseUrl: import.meta.env.APP_SERVER_URL,
            fileName: e?.fileName,
            hash: e?.hash,
            extension: e?.extension,
          }),
          name: e?.fileName ?? '',
          size: e?.size,
          createdAt: e?.createdAt,
          contentType: e?.contentType ?? '',
        })) ?? [];

      setPaperRecord(patient.paperRecord ? 'Yes' : 'No');

      setDocuments(otherDocuments);
    }
  }, [data, reset]);

  const [ageInput, setAgeInput] = useState<'default' | 'manual' | 'months'>(
    'default'
  );

  const [paperRecord, setPaperRecord] = useState<'Yes' | 'No'>('No');

  const [documents, setDocuments] = useState<Array<IFileUploader>>([]);
  const [paperRecordDocument, setPaperRecordDocument] = useState<
    Array<IFileUploader>
  >([]);

  const [update, { loading }] = useMutation<any, MutationUpdatePatientArgs>(
    UPDATE_PATIENT,
    {
      onCompleted(data) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: `Patient updated has been saved successfully`,
          variant: 'success',
        });

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
    }
  );

  const handleDocumentsChange = (files: Array<IFileUploader>) => {
    setDocuments(files);
  };

  const handlePaperDocumentChange = (files: Array<IFileUploader>) => {
    setPaperRecordDocument(files);
  };

  const handleDocumentDelete = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handlePaperDocumentDelete = () => {
    setPaperRecordDocument([]);
  };

  const onSubmit = (data: any) => {
    let dateOfBirth;
    if (ageInput === 'default') {
      dateOfBirth = formatDate(data.dateOfBirth);
    } else if (ageInput === 'manual') {
      dateOfBirth = subYears(new Date(), data.dateOfBirth);
    } else if (ageInput === 'months') {
      dateOfBirth = subMonths(new Date(), data.dateOfBirth);
    }
    data.dateOfBirth = dateOfBirth;

    if (paperRecord === 'Yes') {
      data.paperRecord = true;
    } else {
      data.paperRecord = false;
    }

    data.credit = data.credit === 'true';

    if (
      paperRecordDocument.length > 0 &&
      paperRecordDocument[0].fileObject !== undefined
    ) {
      const file: FileUpload = {
        file: paperRecordDocument[0].fileObject,
        name: paperRecordDocument[0].name,
      };

      data.paperRecordDocument = file;
    }

    if (documents.length > 0) {
      const files: Array<FileUpload> = documents
        .filter((e) => e.fileObject !== undefined)
        .map((e) => ({
          file: e.fileObject,
          name: e.name,
        }));

      data.documents = files;
    }

    if (queryPatientId) {
      data.id = queryPatientId;
      update({ variables: { input: data } });
    }
  };

  if (queryPatientId === null || queryPatientId === undefined) {
    return (
      <div>
        <Component404 />
      </div>
    );
  }

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PatientRegistrationLayout
        update={true}
        loading={loading}
        paperRecord={paperRecord === 'Yes'}
        similarPatients={undefined}
        demographic={
          <PatientRegistrationDemographicForm
            values={values}
            register={register}
            ageInput={ageInput}
            setAgeInput={setAgeInput}
          />
        }
        contactInfo={<PatientRegistrationContactInfoForm register={register} />}
        emergencyInfo={
          <PatientRegistrationEmergencyInfoForm register={register} />
        }
        documents={
          <PatientRegistrationDocumentsForm
            register={register}
            paperRecord={paperRecord}
            setPaperRecord={setPaperRecord}
            documents={documents}
            setDocuments={handleDocumentsChange}
            onDocumentDelete={handleDocumentDelete}
            paperRecordDocument={paperRecordDocument}
            setPaperRecordDocument={handlePaperDocumentChange}
            onPaperRecordDocumentDelete={handlePaperDocumentDelete}
            onError={(message) => {
              notifDispatch({
                type: 'showNotification',
                notifTitle: 'Error',
                notifSubTitle: message,
                variant: 'failure',
              });
            }}
          />
        }
      />
    </form>
  );
};
