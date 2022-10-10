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
import { SavePastSurgeryForm } from './SavePastSurgeryForm';
import { UpdatePastSurgeryForm } from './UpdatePastSurgeryForm';
import {
  Appointment,
  MutationDeleteClinicalFindingArgs,
  MutationDeleteFamilyIllnessArgs,
  MutationDeleteLifestyleArgs,
  MutationDeletePastHospitalizationArgs,
  Query,
} from '@tensoremr/models';
import { getFileUrl } from '@tensoremr/util';
import { SaveMentalStateForm } from './SaveMentalStateForm';
import { SaveImmunizationForm } from './SaveImmunizationForm';
import { SaveAllergyForm } from './SaveAllergyForm';
import { SaveIntoleranceForm } from './SaveIntoleranceForm';
import { SaveHospitalizationHistoryForm } from './SaveHospitalizationHistoryForm';
import { SaveClinicalFindingHistoryForm } from './SaveClinicalFindingHistoryForm';

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

    patientHospitalizationHistory(page: $page, filter: $filter) {
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

    patientClinicalFindingHistory(page: $page, filter: $filter) {
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
      className={classnames('bg-slate-100 p-4', {
        'rounded-lg shadow-lg p-5': isEdit,
      })}
    >
      <div className="text-2xl text-gray-800 font-bold font-mono">
        Past Medical History
      </div>

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

      <div className="grid grid-cols-2 gap-3 auto-rows-fr mt-5">
        <HistoryTypeComponent
          title="Past Disorders"
          items={history?.patientDisorderHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
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

        <HistoryTypeComponent
          title="Surgical History"
          items={history?.patientSurgicalHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
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
        <HistoryTypeComponent
          title="Mental State"
          items={history?.patientMentalHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <SaveMentalStateForm
                  patientChartId={appointment.patientChart.id}
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

        <HistoryTypeComponent
          title="Immunization"
          items={history?.patientImmunizationHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <SaveImmunizationForm
                  patientChartId={appointment.patientChart.id}
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

        <HistoryTypeComponent
          title="Allergy"
          items={history?.patientAllergyHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <SaveAllergyForm
                  patientChartId={appointment.patientChart.id}
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
                  onError={(message) =>
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

        <HistoryTypeComponent
          title="Intolerance"
          items={history?.patientIntoleranceHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <SaveIntoleranceForm
                  patientChartId={appointment.patientChart.id}
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

        <HistoryTypeComponent
          title="Hospitalizations"
          items={history?.patientHospitalizationHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <SaveHospitalizationHistoryForm
                  patientChartId={appointment.patientChart.id}
                  onSuccess={() => {
                    bottomSheetDispatch({ type: 'hide' });

                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Success',
                      notifSubTitle: 'Hospitalization saved successfully',
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

        <HistoryTypeComponent
          title="Other"
          items={history?.patientClinicalFindingHistory.edges.map((e) => ({
            ...e.node,
            subTitle: e.node.freeTextNote,
          }))}
          isEdit={isEdit}
          locked={locked}
          loading={loading}
          onAddClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <SaveClinicalFindingHistoryForm
                  patientChartId={appointment.patientChart.id}
                  onSuccess={() => {
                    bottomSheetDispatch({ type: 'hide' });

                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Success',
                      notifSubTitle:
                        'Other clinical finding history saved successfully',
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
