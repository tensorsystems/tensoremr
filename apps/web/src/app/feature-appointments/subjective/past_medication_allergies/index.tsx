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
import React from 'react';
import {
  AddMedicalPrescriptionForm,
  UpdateMedicalPrescriptionForm,
  MedicationTable,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { AddAllergyForm } from './AddAllergyForm';
import { AllergyTable } from './AllergyTable';
import { UpdateAllergyForm } from './UpdateAllergyForm';
import {
  Allergy,
  MedicalPrescription,
  MutationUpdateMedicationPrescriptionArgs,
  Query,
  QueryAllergiesArgs,
  QuerySearchMedicalPrescriptionsArgs,
} from '@tensoremr/models';

interface Props {
  locked: boolean;
  patientChartId: string | undefined;
  patientHistoryId: string | undefined;
  patientId: string | undefined;
}

export const PastMedicationsAllergies: React.FC<Props> = (props) => {
  return (
    <div className="">
      <div className="mt-5">
        <PastMedications {...props} />
      </div>

      <div className="mt-5">
        <Allergies
          locked={props.locked}
          patientHistoryId={props.patientHistoryId}
        />
      </div>
    </div>
  );
};

const MEDICATION_PRESCRIPTIONS = gql`
  query SearchMedicalPrescriptions(
    $page: PaginationInput!
    $filter: MedicalPrescriptionFilter
  ) {
    searchMedicalPrescriptions(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
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
    }
  }
`;

const UPDATE_MEDICATION_PRESCRIPTION = gql`
  mutation UpdateMedicationPrescription(
    $input: MedicalPrescriptionUpdateInput!
  ) {
    updateMedicationPrescription(input: $input) {
      id
    }
  }
`;

const PastMedications: React.FC<Props> = ({
  locked,
  patientChartId,
  patientId,
}) => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const { data, refetch } = useQuery<
    Query,
    QuerySearchMedicalPrescriptionsArgs
  >(MEDICATION_PRESCRIPTIONS, {
    variables: {
      page: { page: 0, size: 20 },
      filter: { patientId: patientId },
    },
  });

  const [update] = useMutation<any, MutationUpdateMedicationPrescriptionArgs>(
    UPDATE_MEDICATION_PRESCRIPTION,
    {
      onCompleted(data) {
        refetch();

        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: 'Medication has been updated successfully',
          variant: 'success',
        });
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

  const onPrescribeAnother = () => {
    bottomSheetDispatch({ type: 'hide' });
    notifDispatch({
      type: 'showNotification',
      notifTitle: 'Success',
      notifSubTitle: 'Prescription has been saved successfully',
      variant: 'success',
    });
    refetch();

    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <AddMedicalPrescriptionForm
          history={true}
          patientId={patientId}
          patientChartId={patientChartId}
          onSuccess={() => {
            bottomSheetDispatch({ type: 'hide' });
            notifDispatch({
              type: 'showNotification',
              notifTitle: 'Success',
              notifSubTitle: 'Medication has been saved successfully',
              variant: 'success',
            });
            refetch();
          }}
          onError={(message) => {
            notifDispatch({
              type: 'showNotification',
              notifTitle: 'Error',
              notifSubTitle: message,
              variant: 'failure',
            });
          }}
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
          onPrescribeAnother={onPrescribeAnother}
          title={'Add Past Medication'}
        />
      ),
    });
  };

  return (
    <div className="flex-1 bg-gray-50 rounded shadow-lg p-5">
      <p className="text-2xl text-gray-600 font-bold">Past Medications</p>

      <hr className="mt-4 mb-4" />

      <div className="flex justify-end">
        <button
          disabled={locked}
          onClick={() =>
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <AddMedicalPrescriptionForm
                  history={true}
                  patientId={patientId}
                  patientChartId={patientChartId}
                  onSuccess={() => {
                    bottomSheetDispatch({ type: 'hide' });
                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Success',
                      notifSubTitle: 'Medication has been saved successfully',
                      variant: 'success',
                    });
                    refetch();
                  }}
                  onError={(message) => {
                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Error',
                      notifSubTitle: message,
                      variant: 'failure',
                    });
                  }}
                  onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                  onPrescribeAnother={onPrescribeAnother}
                  title={'Add Past Medication'}
                />
              ),
            })
          }
          className="border border-teal-600 text-teal-800 px-3 py-1 rounded-lg flex space-x-1 items-center"
        >
          <div className="material-icons">add</div>
          <p>Add</p>
        </button>
      </div>

      <MedicationTable
        items={data?.searchMedicalPrescriptions.edges.map((e) => e?.node)}
        onUpdate={(item: MedicalPrescription, value: string) => {
          if (item.id !== undefined) {
            update({
              variables: {
                input: {
                  id: item.id,
                  status: value,
                },
              },
            });
          }
        }}
        onEdit={(item: MedicalPrescription) => {
          bottomSheetDispatch({
            type: 'show',
            snapPoint: 0,
            children: (
              <UpdateMedicalPrescriptionForm
                onUpdateSuccess={() => {
                  bottomSheetDispatch({ type: 'hide' });

                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Success',
                    notifSubTitle: 'Medication has been updated successfully',
                    variant: 'success',
                  });

                  refetch();
                }}
                onDeleteSuccess={() => {
                  bottomSheetDispatch({ type: 'hide' });

                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Success',
                    notifSubTitle: 'Medication has been deleted successfully',
                    variant: 'success',
                  });

                  refetch();
                }}
                onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                values={item}
                pharmacyIdValue={null}
                onError={(message) => {
                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Error',
                    notifSubTitle: message,
                    variant: 'failure',
                  });
                }}
              />
            ),
          });
        }}
        onPrint={() => null}
        locked={locked}
      />
    </div>
  );
};

const ALLERGIES = gql`
  query Allergies($page: PaginationInput!, $filter: AllergyFilter) {
    allergies(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          title
          issueSeverity
          issueReaction
          issueOutcome
          issueOccurrence
        }
      }
    }
  }
`;

const UPDATE_ALLERGY = gql`
  mutation UpdateAllergy($input: AllergyUpdateInput!) {
    updateAllergy(input: $input) {
      id
    }
  }
`;

const Allergies: React.FC<{
  locked: boolean;
  patientHistoryId: string | undefined;
}> = ({ patientHistoryId, locked }) => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const { data, refetch } = useQuery<Query, QueryAllergiesArgs>(ALLERGIES, {
    variables: {
      page: { page: 0, size: 20 },
      filter: { patientHistoryId },
    },
  });

  return (
    <div className="flex-1 bg-gray-50 rounded shadow-lg p-5">
      <p className="text-2xl text--600 font-bold">Allergies</p>

      <hr className="mt-4 mb-4" />

      <div className="flex justify-end">
        <button
          disabled={locked}
          onClick={() =>
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <AddAllergyForm
                  patientHistoryId={patientHistoryId}
                  onSuccess={() => {
                    bottomSheetDispatch({ type: 'hide' });
                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Success',
                      notifSubTitle: 'Medication has been saved successfully',
                      variant: 'success',
                    });
                    refetch();
                  }}
                  onError={(message) => {
                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Error',
                      notifSubTitle: message,
                      variant: 'failure',
                    });
                  }}
                  onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                />
              ),
            })
          }
          className="border border-teal-600 text-teal-800 px-3 py-1 rounded-lg flex space-x-1 items-center"
        >
          <div className="material-icons">add</div>
          <p>Add</p>
        </button>
      </div>

      <AllergyTable
        items={data?.allergies.edges}
        onEdit={(item: Allergy) => {
          bottomSheetDispatch({
            type: 'show',
            snapPoint: 0,
            children: (
              <UpdateAllergyForm
                onUpdateSuccess={() => {
                  bottomSheetDispatch({ type: 'hide' });

                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Success',
                    notifSubTitle: 'Allergy has been updated successfully',
                    variant: 'success',
                  });

                  refetch();
                }}
                onDeleteSuccess={() => {
                  bottomSheetDispatch({ type: 'hide' });

                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Success',
                    notifSubTitle: 'Allergy has been deleted successfully',
                    variant: 'success',
                  });

                  refetch();
                }}
                onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                values={item}
              />
            ),
          });
        }}
        locked={locked}
      />
    </div>
  );
};
