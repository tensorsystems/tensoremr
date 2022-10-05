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

import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import {
  HistoryTypeComponent,
  IFileUploader,
  FileUploader,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { UpdatePastIllnessForm } from './UpdatePastIllnessForm';
import { SavePastDisorderForm } from './SavePastDisorderForm';
import { format, parseISO } from 'date-fns';
import { SavePastSurgeryForm } from './SavePastSurgeryForm';
import { UpdatePastSurgeryForm } from './UpdatePastSurgeryForm';
import { SaveFamilyIllnessForm } from './SaveFamilyIllnessForm';
import { UpdateFamilyIllnessForm } from './UpdateFamilyIllnessForm';
import { SaveLifestyleForm } from './SaveLifestyleForm';
import { UpdateLifestyleForm } from './UpdateLifestyleForm';
import {
  Appointment,
  MutationDeleteClinicalFindingArgs,
  MutationDeleteFamilyIllnessArgs,
  MutationDeleteLifestyleArgs,
  MutationDeletePastHospitalizationArgs,
  MutationDeletePastInjuryArgs,
  MutationDeletePastSurgeryArgs,
  Query,
} from '@tensoremr/models';
import { getFileUrl } from '@tensoremr/util';
import { SaveSocialHistoryForm } from './SaveSocialHistoryForm';
import { SaveAdministrativeForm } from './SaveAdministrativeForm';
import { SaveMentalStateForm } from './SaveMentalStateForm';
import { SaveImmunizationForm } from './SaveImmunizationForm';
import { SaveAllergyForm } from './SaveAllergyForm';
import { SaveIntoleranceForm } from './SaveIntoleranceForm';

const GET_HISTORY = gql`
  query GetHistory(
    $patientHistoryId: ID!
    $patientId: ID!
    $page: PaginationInput!
    $filter: ClinicalFindingFilter
  ) {
    pastIllnesses(patientHistoryId: $patientHistoryId) {
      id
      title
      description
    }
    patientDisorderHistory(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          patientChartId
          patientId
          conceptId
          parentConceptId
          conceptTerm
          freeTextNote
          attributes {
            id
            clinicalFindingId
            attributeTypeId
            attributeId
            attributeTerm
          }
          createdAt
          updatedAt
        }
      }
    }

    patientSurgicalHistory(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          patientChartId
          patientId
          conceptId
          parentConceptId
          conceptTerm
          freeTextNote
          attributes {
            id
            clinicalFindingId
            attributeTypeId
            attributeId
            attributeTerm
          }
          createdAt
          updatedAt
        }
      }
    }

    patientMentalHistory(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          patientChartId
          patientId
          conceptId
          parentConceptId
          conceptTerm
          freeTextNote
          attributes {
            id
            clinicalFindingId
            attributeTypeId
            attributeId
            attributeTerm
          }
          createdAt
          updatedAt
        }
      }
    }

    patientImmunizationHistory(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          patientChartId
          patientId
          conceptId
          parentConceptId
          conceptTerm
          freeTextNote
          attributes {
            id
            clinicalFindingId
            attributeTypeId
            attributeId
            attributeTerm
          }
          createdAt
          updatedAt
        }
      }
    }

    patientAllergyHistory(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          patientChartId
          patientId
          conceptId
          parentConceptId
          conceptTerm
          freeTextNote
          attributes {
            id
            clinicalFindingId
            attributeTypeId
            attributeId
            attributeTerm
          }
          createdAt
          updatedAt
        }
      }
    }

    patientIntoleranceHistory(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          patientChartId
          patientId
          conceptId
          parentConceptId
          conceptTerm
          freeTextNote
          attributes {
            id
            clinicalFindingId
            attributeTypeId
            attributeId
            attributeTerm
          }
          createdAt
          updatedAt
        }
      }
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
    patient(id: $patientId) {
      id
      paperRecordDocumentId
      paperRecordDocument {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
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
  }
`;

const DELETE_CLINICAL_FINDING = gql`
  mutation DeleteClinicalFinding($id: ID!) {
    deleteClinicalFinding(id: $id)
  }
`;

const DELETE_PAST_HOSPITALIZATION = gql`
  mutation DeleteHospitalization($id: ID!) {
    deletePastHospitalization(id: $id)
  }
`;

const DELETE_PAST_INJURY = gql`
  mutation DeletePastInjury($id: ID!) {
    deletePastInjury(id: $id)
  }
`;

const DELETE_PAST_SURGERY = gql`
  mutation DeletePastSurgery($id: ID!) {
    deletePastSurgery(id: $id)
  }
`;

const DELETE_FAMILY_ILLNESS = gql`
  mutation DeleteFamillyIllness($id: ID!) {
    deleteFamilyIllness(id: $id)
  }
`;

const DELETE_LIFESTYLE = gql`
  mutation DeleteLifestyle($id: ID!) {
    deleteLifestyle(id: $id)
  }
`;

export const PastMedicalHistoryPage: React.FC<{
  isEdit?: boolean;
  appointment: Appointment;
  showPaperRecord?: boolean;
  locked: boolean;
  onSaveChange: (saving: boolean) => void;
  onHasHistoryChange?: (value: boolean) => void;
}> = ({
  isEdit = true,
  appointment,
  showPaperRecord = true,
  locked,
  onSaveChange,
  onHasHistoryChange,
}) => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();
  const [paperRecordDocuments, setPaperRecordDocuments] = useState<
    Array<IFileUploader>
  >([]);

  const { data, refetch, loading } = useQuery<Query, any>(GET_HISTORY, {
    variables: {
      patientHistoryId: appointment.patient.patientHistory.id,
      patientId: appointment.patient.id,
      page: { page: 0, size: 100 },
      filter: {
        patientId: appointment.patient.id.toString(),
      },
    },
  });

  useEffect(() => {
    const paperRecordDocument = data?.patient.paperRecordDocument;

    if (paperRecordDocument) {
      const record = {
        id: paperRecordDocument.id,
        fileUrl: getFileUrl({
          baseUrl: import.meta.env.VITE_APP_SERVER_URL,
          fileName: paperRecordDocument.fileName,
          hash: paperRecordDocument.hash,
          extension: paperRecordDocument.extension,
        }),
        name: paperRecordDocument.fileName ?? '',
        size: paperRecordDocument.size,
        createdAt: paperRecordDocument.createdAt,
        contentType: paperRecordDocument.contentType ?? '',
      };

      setPaperRecordDocuments([record]);
    }
  }, [data]);

  const history = data;

  const handleRefresh = () => {
    refetch();
  };

  const hasPastIllnesses =
    history?.pastIllnesses && history?.pastIllnesses.length > 0;
  const hasPastInjuries =
    history?.pastInjuries && history?.pastInjuries.length > 0;
  const hasPastHospitalizations =
    history?.pastHospitalizations && history?.pastHospitalizations.length > 0;
  const hasPastSurgeries =
    history?.pastSurgeries && history?.pastSurgeries.length > 0;
  const hasLifestyles = history?.lifestyles && history?.lifestyles.length > 0;
  const hasFamilyIllnesses =
    history?.familyIllnesses && history?.familyIllnesses.length > 0;

  const hasHistory =
    hasPastIllnesses ||
    hasPastInjuries ||
    hasPastHospitalizations ||
    hasPastSurgeries ||
    hasLifestyles ||
    hasFamilyIllnesses;

  useEffect(() => {
    onHasHistoryChange &&
      onHasHistoryChange(hasHistory === undefined ? false : hasHistory);
  }, [hasHistory]);

  const [deleteClinicalFinding] = useMutation<
    any,
    MutationDeleteClinicalFindingArgs
  >(DELETE_CLINICAL_FINDING, {
    onCompleted(data) {
      onSaveChange(false);
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Success',
        notifSubTitle: 'History item deleted successfully',
        variant: 'success',
      });

      onSaveChange(false);
      handleRefresh();
    },
    onError(error) {
      onSaveChange(false);
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const [deletePastHospitalization] = useMutation<
    any,
    MutationDeletePastHospitalizationArgs
  >(DELETE_PAST_HOSPITALIZATION, {
    onCompleted(data) {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Success',
        notifSubTitle: 'Past Hospitalization deleted successfully',
        variant: 'success',
      });

      onSaveChange(false);
      handleRefresh();
    },
    onError(error) {
      onSaveChange(false);
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const [deleteFamilyIllness] = useMutation<
    any,
    MutationDeleteFamilyIllnessArgs
  >(DELETE_FAMILY_ILLNESS, {
    onCompleted(data) {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Success',
        notifSubTitle: 'Family Illness deleted successfully',
        variant: 'success',
      });

      onSaveChange(false);
      handleRefresh();
    },
    onError(error) {
      onSaveChange(false);
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const [deleteLifestyle] = useMutation<any, MutationDeleteLifestyleArgs>(
    DELETE_LIFESTYLE,
    {
      onCompleted(data) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: 'Lifestyle deleted successfully',
          variant: 'success',
        });

        onSaveChange(false);
        handleRefresh();
      },
      onError(error) {
        onSaveChange(false);
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  return (
    <div
      className={classnames('bg-gray-50 p-2', {
        'rounded shadow-lg p-5': isEdit,
      })}
    >
      <div className="text-xl text-gray-600 font-semibold">History</div>

      <hr className="mt-3" />

      <div
        hidden={isEdit || hasHistory}
        className="text-center text-gray-500 mt-5"
      >
        Nothing here yet
      </div>

      {paperRecordDocuments?.length > 0 && showPaperRecord && (
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700">
            Paper record
          </label>
          <div className="mt-2">
            <FileUploader
              multiSelect={false}
              accept={'image'}
              values={paperRecordDocuments}
              disabled={true}
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

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div hidden={!isEdit && !hasPastIllnesses}>
          <HistoryTypeComponent
            title="Past Disorders"
            items={history?.patientDisorderHistory.edges.map((e) => ({
              ...e.node,
              subTitle: e.node.freeTextNote,
            }))}
            isEdit={isEdit}
            locked={locked}
            loading={loading}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SavePastDisorderForm
                    patientChartId={appointment.patientChart.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past Illness saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <UpdatePastIllnessForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past Illness saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              deleteClinicalFinding({ variables: { id } });
            }}
          />
        </div>

        <div hidden>
          <HistoryTypeComponent
            title="Family History"
            items={history?.familyIllnesses.map((e) => ({
              ...e,
              title: e?.title,
              subTitle: e?.description,
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveFamilyIllnessForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Family Illness saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <UpdateFamilyIllnessForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Family illness saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
              deleteFamilyIllness({ variables: { id } });
            }}
          />
        </div>

        <div hidden={!isEdit && !hasPastSurgeries}>
          <HistoryTypeComponent
            title="Surgical History"
            items={history?.patientSurgicalHistory.edges.map((e) => ({
              ...e.node,
              subTitle: e.node.freeTextNote,
            }))}
            isEdit={isEdit}
            locked={locked}
            loading={loading}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SavePastSurgeryForm
                    patientChartId={appointment.patientChart.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Patient history saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <UpdatePastSurgeryForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past surgery saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              deleteClinicalFinding({ variables: { id } });
            }}
          />
        </div>

        <div hidden={!isEdit && !hasPastSurgeries}>
          <HistoryTypeComponent
            title="Mental State"
            items={history?.pastSurgeries.map((e) => ({
              ...e,
              title: e?.description,
              subTitle:
                e?.surgeryDate &&
                format(parseISO(e?.surgeryDate), 'dd/MM/yyyy'),
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveMentalStateForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Mental State saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <UpdatePastSurgeryForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past surgery saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
            }}
          />
        </div>

        <div hidden={!isEdit && !hasPastSurgeries}>
          <HistoryTypeComponent
            title="Immunization"
            items={history?.pastSurgeries.map((e) => ({
              ...e,
              title: e?.description,
              subTitle:
                e?.surgeryDate &&
                format(parseISO(e?.surgeryDate), 'dd/MM/yyyy'),
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveImmunizationForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Immunization saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <UpdatePastSurgeryForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past surgery saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
             
            }}
          />
        </div>

        <div hidden={!isEdit && !hasPastSurgeries}>
          <HistoryTypeComponent
            title="Allergy"
            items={history?.pastSurgeries.map((e) => ({
              ...e,
              title: e?.description,
              subTitle:
                e?.surgeryDate &&
                format(parseISO(e?.surgeryDate), 'dd/MM/yyyy'),
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveAllergyForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Immunization saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <UpdatePastSurgeryForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past surgery saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
             
            }}
          />
        </div>

        <div hidden={!isEdit && !hasPastSurgeries}>
          <HistoryTypeComponent
            title="Intolerance"
            items={history?.pastSurgeries.map((e) => ({
              ...e,
              title: e?.description,
              subTitle:
                e?.surgeryDate &&
                format(parseISO(e?.surgeryDate), 'dd/MM/yyyy'),
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveIntoleranceForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Intolerance saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <UpdatePastSurgeryForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past surgery saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
             
            }}
          />
        </div>

        <div hidden>
          <HistoryTypeComponent
            title="Social History"
            items={history?.pastSurgeries.map((e) => ({
              ...e,
              title: e?.description,
              subTitle:
                e?.surgeryDate &&
                format(parseISO(e?.surgeryDate), 'dd/MM/yyyy'),
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveSocialHistoryForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Social history saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 500,
                children: (
                  <UpdatePastSurgeryForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Past surgery saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
             
            }}
          />
        </div>

        <div hidden>
          <HistoryTypeComponent
            title="Lifestyle"
            items={history?.lifestyles.map((e) => ({
              ...e,
              title: e?.title,
              subTitle: e?.description,
              subTitle2: e?.note,
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveLifestyleForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Lifestyle saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 500,
                children: (
                  <UpdateLifestyleForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Lifestyle saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
              deleteLifestyle({ variables: { id } });
            }}
          />
        </div>

        <div hidden>
          <HistoryTypeComponent
            title="Administrative History"
            items={history?.lifestyles.map((e) => ({
              ...e,
              title: e?.title,
              subTitle: e?.description,
              subTitle2: e?.note,
            }))}
            isEdit={isEdit}
            locked={locked}
            onAdd={() => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 0,
                children: (
                  <SaveAdministrativeForm
                    patientHistoryId={appointment?.patient.patientHistory.id}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle:
                          'Administrative history saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onUpdate={(item) => {
              bottomSheetDispatch({
                type: 'show',
                snapPoint: 500,
                children: (
                  <UpdateLifestyleForm
                    values={item}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: 'hide' });

                      notifDispatch({
                        type: 'showNotification',
                        notifTitle: 'Success',
                        notifSubTitle: 'Lifestyle saved successfully',
                        variant: 'success',
                      });

                      handleRefresh();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    onSaveChange={onSaveChange}
                  />
                ),
              });
            }}
            onDelete={(id: string) => {
              onSaveChange(true);
              deleteLifestyle({ variables: { id } });
            }}
          />
        </div>
      </div>

      {/* 
        <div className="text-xl text-gray-600 font-semibold mt-10">
        Review of Systems
      </div>

      <hr className="mt-3" />

      <div className="mt-1 pl-3">
        <ul>
          {data?.reviewOfSystems.edges.map((e) => (
            <li key={e?.node.id}>
              <span className="font-semibold">
                {e?.node.systemSymptom.system.title}:{" "}
              </span>
              <span>{e?.node.systemSymptom.title}</span>
            </li>
          ))}
        </ul>

        {data?.patientHistory.reviewOfSystemsNote && (
          <div className="mt-2">
            <p>{data?.patientHistory.reviewOfSystemsNote}</p>
          </div>
        )}
      </div>
      */}
    </div>
  );
};
