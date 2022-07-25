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
import { useForm } from 'react-hook-form';
import {
  MedicalPrescription,
  MedicalPrescriptionUpdateInput,
  MutationUpdateMedicationPrescriptionArgs,
  MutationDeleteMedicalPrescriptionArgs,
  Query,
  QueryPharmaciesArgs,
} from '@tensoremr/models';
import Select from 'react-select';

const UPDATE_MEDICATION_PRESCRIPTION = gql`
  mutation UpdateMedicationPrescription(
    $input: MedicalPrescriptionUpdateInput!
  ) {
    updateMedicationPrescription(input: $input) {
      id
    }
  }
`;

const DELETE_MEDICAL_PRESCRIPTION = gql`
  mutation DeleteMedicalPrescription($id: ID!) {
    deleteMedicalPrescription(id: $id)
  }
`;

const PHARMACIES = gql`
  query Pharmacies($page: PaginationInput!) {
    pharmacies(page: $page) {
      totalCount
      edges {
        node {
          id
          title
          address
          region
          country
          phone
          inHouse
          active
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

interface UpdateMedicalPrescriptionProps {
  values: MedicalPrescription | undefined;
  pharmacyIdValue: string | undefined | null;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

export const UpdateMedicalPrescriptionForm: React.FC<
  UpdateMedicalPrescriptionProps
> = ({
  values,
  pharmacyIdValue,
  onUpdateSuccess,
  onDeleteSuccess,
  onCancel,
  onError,
}) => {
  const { register, handleSubmit } = useForm<MedicalPrescriptionUpdateInput>({
    defaultValues: values,
  });

  const { data } = useQuery<Query, QueryPharmaciesArgs>(PHARMACIES, {
    variables: {
      page: { page: 1, size: 1000 },
    },
  });

  const [selectedPharmacy, setSelectedPharmacy] = useState<any>();

  useEffect(() => {
    if (pharmacyIdValue) {
      const pharmacy = data?.pharmacies.edges.find(
        (e) => e?.node.id === pharmacyIdValue
      )?.node;

      const value = {
        value: pharmacy?.id,
        label: `${pharmacy?.title} - ${pharmacy?.address}, ${
          pharmacy?.region
        }, ${pharmacy?.country} ${pharmacy?.inHouse ? '(In-House)' : ''}`,
      };

      setSelectedPharmacy(value);
    }
  }, [values, data]);

  const [update, { error }] = useMutation<
    any,
    MutationUpdateMedicationPrescriptionArgs
  >(UPDATE_MEDICATION_PRESCRIPTION, {
    onCompleted(data) {
      onUpdateSuccess();
    },
    onError(error) {
      onError(error.message);
    },
  });

  const [deleteMedicalPrescription] = useMutation<
    any,
    MutationDeleteMedicalPrescriptionArgs
  >(DELETE_MEDICAL_PRESCRIPTION, {
    onCompleted(data) {
      onDeleteSuccess();
    },
    onError(error) {
      onError(error.message);
    },
  });

  const onUpdateSubmit = (data: any) => {
    if (values?.id !== undefined) {
      data.id = values.id;
      data.generic = data.generic === 'true';
      data.substitutionAllowed = data.substitutionAllowed === 'true';
      data.pharmacyId = selectedPharmacy.value;

      update({ variables: { input: data } });
    }
  };

  const onDeleteSubmit = (data: any) => {
    if (values?.id !== undefined) {
      deleteMedicalPrescription({ variables: { id: values?.id } });
    }
  };

  const pharmacies = data?.pharmacies.edges.map((e) => ({
    value: e?.node.id,
    label: `${e?.node.title} - ${e?.node.address}, ${e?.node.region}, ${
      e?.node.country
    } ${e?.node.inHouse ? '(In-House)' : ''}`,
  }));

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div className="w-1/2">
        <div className="float-right">
          <button onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form>
          <p className="text-2xl font-extrabold tracking-wider">
            Update Medical Prescription
          </p>
          <div className="mt-4">
            <Select
              placeholder="Pharmacy"
              options={pharmacies}
              value={selectedPharmacy}
              onChange={(value) => {
                setSelectedPharmacy(value);
              }}
            />
          </div>
          <div className="mt-4">
            <hr />
          </div>
          <div className="mt-4">
            <label
              htmlFor="medication"
              className="block text-sm font-medium text-gray-700"
            >
              Medication
            </label>
            <input
              type="text"
              name="medication"
              id="medication"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="sig"
              className="block text-sm font-medium text-gray-700"
            >
              Sig
            </label>
            <input
              type="text"
              name="sig"
              id="sig"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="refill"
              className="block text-sm font-medium text-gray-700"
            >
              Refill
            </label>
            <select
              id="refill"
              name="refill"
              ref={register}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {[0, 1, 2, 3, 4, 5].map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="generic"
              className="block text-sm font-medium text-gray-700"
            >
              Generic
            </label>
            <select
              id="generic"
              name="generic"
              ref={register}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="substitutionAllowed"
              className="block text-sm font-medium text-gray-700"
            >
              Substitution Allowed
            </label>
            <select
              id="substitutionAllowed"
              name="substitutionAllowed"
              ref={register}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'false'}>No</option>
              <option value={'true'}>Yes</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="directionToPatient"
              className="block text-sm font-medium text-gray-700"
            >
              Direction To Patient
            </label>
            <textarea
              rows={3}
              name="directionToPatient"
              id="directionToPatient"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <input type="checkbox" id="favorite" name="favorite" />
            <label className="ml-2 text-sm" htmlFor="favorite">
              Save to favorites
            </label>
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <div className="flex space-x-5">
            <button
              type="button"
              onClick={handleSubmit(onUpdateSubmit)}
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 focus:outline-none"
            >
              <span className="ml-2">Update</span>
            </button>

            <button
              type="submit"
              onClick={handleSubmit(onDeleteSubmit)}
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 focus:outline-none"
            >
              <span className="ml-2">Delete</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
