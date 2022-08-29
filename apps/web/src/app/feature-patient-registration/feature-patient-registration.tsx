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

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { formatDate } from '@tensoremr/util';
import {
  PatientInput,
  FileUpload,
  Query,
  QueryFindSimilarPatientsArgs,
  Page,
  MutationSavePatientV2Args,
  DateOfBirthInput,
  DateOfBirthInputType,
} from '@tensoremr/models';
import { useHistory } from 'react-router-dom';
import {
  IFileUploader,
  PatientRegistrationLayout,
  PatientRegistrationDemographicForm,
  PatientRegistrationContactInfoForm,
  PatientRegistrationEmergencyInfoForm,
  PatientRegistrationDocumentsForm,
  AppointmentFormContainer,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useEffect } from 'react';
import { newPatientCache } from '@tensoremr/cache';

const SAVE_PATIENT = gql`
  mutation SavePatient($input: PatientInput!) {
    savePatient(input: $input) {
      id
      idNo
      firstName
      lastName
    }
  }
`;

const SAVE_PATIENT_V2 = gql`
  mutation SavePatientV2(
    $input: PatientInputV2!
    $dateOfBirthInput: DateOfBirthInput!
  ) {
    savePatientV2(input: $input, dateOfBirthInput: $dateOfBirthInput) {
      id
      idNo
      firstName
      lastName
    }
  }
`;

const FIND_SIMILAR_PATIENTS = gql`
  query FindSimilarPatients($input: SimilarPatientsInput!) {
    findSimilarPatients(input: $input) {
      byName {
        id
        firstName
        lastName
        phoneNo
      }

      byPhone {
        id
        firstName
        lastName
        phoneNo
      }
    }
  }
`;

const NEW_PATIENT_CACHE = gql`
  query NewPatientCache {
    newPatientCache @client {
      firstName
      lastName
    }
  }
`;

interface Props {
  onAddPage: (page: Page) => void;
}

export const PatientRegistrationPage: React.FC<Props> = ({ onAddPage }) => {
  const history = useHistory();
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

  const newPatientCacheQuery = useQuery(NEW_PATIENT_CACHE);

  const { register, handleSubmit, reset, watch } = useForm<PatientInput>({
    defaultValues: {
      paperRecord: false,
    },
  });

  const values = watch();

  useEffect(() => {
    newPatientCache(values);
  }, [values]);

  useEffect(() => {
    const cache = newPatientCacheQuery.data?.newPatientCache;
    if (cache) {
      reset(cache);
    }
  }, []);

  const [ageInput, setAgeInput] = useState<'default' | 'manual' | 'months'>(
    'default'
  );

  const [paperRecord, setPaperRecord] = useState<'Yes' | 'No'>('No');
  const [scheduleOnSave, setScheduleSave] = useState<boolean>(false);

  const [documents, setDocuments] = useState<Array<IFileUploader>>([]);
  const [paperRecordDocument, setPaperRecordDocument] = useState<
    Array<IFileUploader>
  >([]);

  const [similarPatientSearched, setSimilarPatientSearched] =
    useState<boolean>(false);

  const findSimilarPatientsQuery = useLazyQuery<
    Query,
    QueryFindSimilarPatientsArgs
  >(FIND_SIMILAR_PATIENTS);

  const [save, { loading }] = useMutation<any, MutationSavePatientV2Args>(
    SAVE_PATIENT_V2,
    {
      onCompleted(data) {
        const patient = data.savePatientV2;

        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: `Patient ${patient.firstName} ${patient.lastName} has been saved successfully`,
          variant: 'success',
        });

        resetAll();

        if (scheduleOnSave) {
          bottomSheetDispatch({
            type: 'show',
            snapPoint: 1000,
            children: (
              <AppointmentFormContainer
                patientId={patient?.id}
                onSuccess={() => null}
                onCancel={() => {
                  bottomSheetDispatch({ type: 'hide' });
                }}
                onFailure={(message) =>
                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Error',
                    notifSubTitle: message,
                    variant: 'failure',
                  })
                }
              />
            ),
          });
        } else {
          const page: Page = {
            title: `Patient - ${patient?.firstName} ${patient?.lastName}`,
            cancellable: true,
            route: `/patients/${patient?.id}/appointments`,
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
          history.replace(`/patients/${patient?.id}/appointments`);
        }
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

  const resetAll = () => {
    reset();
    setAgeInput('default');
    setPaperRecord('No');
    setDocuments([]);
    setPaperRecordDocument([]);
    setScheduleSave(false);
  };

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

  const handlePatientClick = (
    id: string,
    firstName: string,
    lastName: string
  ) => {
    const page: Page = {
      title: `Patient - ${firstName} ${lastName}`,
      cancellable: true,
      route: `/patients/${id}/appointments`,
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
    history.replace(`/patients/${id}/appointments`);
  };

  const onSubmit = (data: any) => {
    // if (!similarPatientSearched) {
    //   findSimilarPatientsQuery[0]({
    //     variables: {
    //       input: {
    //         firstName: data.firstName,
    //         lastName: data.lastName,
    //         phoneNo: data.phoneNo,
    //       },
    //     },
    //   })
    //     .then((result) => {
    //       console.log("Data", result);
    //       const similarPatients = result.data?.findSimilarPatients;

    //       if(similarPatients?.byName.length === 0 && similarPatients.byPhone.length === 0) {
    //         setSimilarPatientSearched(true);
    //         handleSubmit(onSubmit)();
    //       }

    //       setSimilarPatientSearched(true);
    //     })
    //     .catch((error) => {
    //       notifDispatch({
    //         type: "show",
    //         notifTitle: "Error",
    //         notifSubTitle: error.message,
    //         variant: "failure",
    //       });
    //       setSimilarPatientSearched(true);
    //     });
    //   return;
    // }

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

    const firstName =
      data.firstName.charAt(0).toUpperCase() +
      data.firstName.slice(1).toLowerCase();

    const lastName =
      data.lastName.charAt(0).toUpperCase() +
      data.lastName.slice(1).toLowerCase();

    data.firstName = firstName;
    data.lastName = lastName;

    let dateOfBirthInputType: DateOfBirthInputType;

    if (ageInput === 'manual') {
      dateOfBirthInputType = DateOfBirthInputType.AgeYear;
    } else if (ageInput === 'months') {
      dateOfBirthInputType = DateOfBirthInputType.AgeMonth;
    } else {
      dateOfBirthInputType = DateOfBirthInputType.Date;
    }

    const dateOfBirthInput: DateOfBirthInput = {
      inputType: dateOfBirthInputType,
      dateOfBirth:
        ageInput === 'default' ? formatDate(data.dateOfBirth) : undefined,
      ageInYears:
        ageInput === 'manual' ? (data.dateOfBirth as number) : undefined,
      ageInMonths:
        ageInput === 'months' ? (data.dateOfBirth as number) : undefined,
    };

    data.dateOfBirth = undefined;

    save({ variables: { input: data, dateOfBirthInput: dateOfBirthInput } });
  };

  const similarPatients = findSimilarPatientsQuery[1].data?.findSimilarPatients;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PatientRegistrationLayout
        update={false}
        loading={loading}
        paperRecord={paperRecord === 'Yes'}
        migrationAlert={
          paperRecord === 'Yes' && paperRecordDocument.length > 0
            ? 'Paper record will be automatically be migrated to the system'
            : undefined
        }
        similarPatients={similarPatients}
        onPatientClick={handlePatientClick}
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
