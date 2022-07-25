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
import { useForm } from 'react-hook-form';
import {
  FavoriteMedication,
  MutationSaveMedicationPrescriptionArgs,
  MutationSaveFavoriteMedicationArgs,
  FavoriteMedicationInput,
  Query,
  QueryPharmaciesArgs,
  QuerySearchMedicalPrescriptionsArgs,
  MutationSavePastMedicationArgs,
} from '@tensoremr/models';
import Select from 'react-select';
import ReactLoading from 'react-loading';

const SAVE_MEDICAL_PRESCRIPTION = gql`
  mutation SaveMedicalPrescription($input: MedicalPrescriptionOrderInput!) {
    saveMedicationPrescription(input: $input) {
      id
    }
  }
`;

const SAVE_PAST_PRESCRIPTION = gql`
  mutation SavePastMedication($input: MedicalPrescriptionInput!) {
    savePastMedication(input: $input) {
      id
    }
  }
`;

const SAVE_FAVORITE_MEDICATION = gql`
  mutation SaveFavoriteMedication($input: FavoriteMedicationInput!) {
    saveFavoriteMedication(input: $input) {
      id
    }
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

const SEARCH_INTRACTION_RXCUI = gql`
  query SearchIntractionRxcui(
    $page: PaginationInput!
    $filter: MedicalPrescriptionFilter
  ) {
    searchMedicalPrescriptions(page: $page, filter: $filter) {
      totalCount
      edges {
        node {
          id
          rxCui
        }
      }
    }
  }
`;

interface Props {
  history: boolean;
  patientId: string | undefined;
  patientChartId: string | undefined;
  values?: FavoriteMedication | undefined;
  title: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  onPrescribeAnother: () => void;
  onCancel: () => void;
}

export const AddMedicalPrescriptionForm: React.FC<Props> = ({
  history,
  patientId,
  patientChartId,
  values,
  title,
  onSuccess,
  onError,
  onPrescribeAnother,
  onCancel,
}) => {
  const { register, handleSubmit, getValues, reset } = useForm<any>({
    defaultValues: {
      ...values,
    },
  });

  const { data } = useQuery<Query, QueryPharmaciesArgs>(PHARMACIES, {
    variables: {
      page: { page: 1, size: 1000 },
    },
  });

  const searchIntractionRxcuiQuery = useQuery<
    Query,
    QuerySearchMedicalPrescriptionsArgs
  >(SEARCH_INTRACTION_RXCUI, {
    variables: {
      page: { page: 0, size: 100 },
      filter: { status: 'Active', patientId: patientId },
    },
  });

  const [selectedPharmacy, setSelectedPharmacy] = useState<any>();
  const [medicationInput, setMedicationInput] = useState<string>('');

  const [drugGroup, setDrugGroup] = useState<any>(null);
  const [isDrugGroupLoading, setIsDrugGroupLoading] = useState<boolean>(false);

  const [selectedDrug, setSelectedDrug] = useState<any>(null);

  const [prescribeAnother, setPrescribeAnother] = useState<boolean>(false);

  const [rxCuis, setRxCuis] = useState<string | null>(null);

  const [interactions, setInteractions] = useState<Array<null>>([]);

  useEffect(() => {
    if (values !== undefined) {
      const drug = {
        language: values.language,
        name: values.medication,
        rxcui: values.rxCui,
        suppress: 'N',
        synonym: values.synonym,
        tty: values.tty,
        umlscui: '',
      };

      setSelectedDrug(drug);
    }
  }, [values]);

  useEffect(() => {
    if (searchIntractionRxcuiQuery.data?.searchMedicalPrescriptions) {
      const value =
        searchIntractionRxcuiQuery.data?.searchMedicalPrescriptions.edges
          .filter((e) => e?.node.rxCui !== null)
          .map((e) => e?.node.rxCui)
          .join(' ');
      setRxCuis(value);
    }
  }, [searchIntractionRxcuiQuery.data]);

  useEffect(() => {
    if (data?.pharmacies && data?.pharmacies.edges?.length > 0) {
      if (data?.pharmacies.edges[0]) {
        const pharmacy = data?.pharmacies.edges[0].node;

        const value = {
          value: pharmacy.id,
          label: `${pharmacy.title} - ${pharmacy.address}, ${
            pharmacy.region
          }, ${pharmacy.country} ${pharmacy.inHouse ? '(In-House)' : ''}`,
        };

        setSelectedPharmacy(value);
      }
    }
  }, [data]);

  const [saveToFavorite, setSaveToFavorite] = useState(false);

  const [saveMedicalPrescription, { error, loading }] = useMutation<
    any,
    MutationSaveMedicationPrescriptionArgs
  >(SAVE_MEDICAL_PRESCRIPTION, {
    onCompleted(data) {
      if (prescribeAnother) {
        onPrescribeAnother();
      } else {
        onSuccess();
      }
    },
    onError(error) {
      onError(error.message);
    },
  });

  const [savePastMedication, pastMedicationResult] = useMutation<
    any,
    MutationSavePastMedicationArgs
  >(SAVE_PAST_PRESCRIPTION, {
    onCompleted(data) {
      if (prescribeAnother) {
        onPrescribeAnother();
      } else {
        onSuccess();
      }
    },
    onError(error) {
      onError(error.message);
    },
  });

  const [saveFavoriteMedication] = useMutation<
    any,
    MutationSaveFavoriteMedicationArgs
  >(SAVE_FAVORITE_MEDICATION, {
    onError(error) {
      onError(error.message);
    },
  });

  const onSubmit = (data: any) => {
    if (saveToFavorite) {
      onSaveFavoriteMedication();
    }

    const values = getValues();

    if (
      patientChartId !== undefined &&
      patientId !== undefined &&
      selectedPharmacy
    ) {
      if (history) {
        savePastMedication({
          variables: {
            input: {
              medication: values.medication,
              sig: data.sig,
              refill: data.refill,
              rxCui: '',
              synonym: values.medication,
              tty: '',
              language: '',
              patientId: patientId,
              generic: selectedDrug?.tty === 'SCD',
              substitutionAllowed: data.substitutionAllowed === 'true',
              status: 'Active',
              history: true,
            },
          },
        });
      } else {
        saveMedicalPrescription({
          variables: {
            input: {
              patientChartId: patientChartId,
              pharmacyId: selectedPharmacy.value,
              medication: values.medication,
              sig: data.sig,
              refill: data.refill,
              rxCui: '',
              synonym: values.medication,
              tty: '',
              language: '',
              patientId: patientId,
              generic: selectedDrug?.tty === 'SCD',
              substitutionAllowed: data.substitutionAllowed === 'true',
              directionToPatient: data.directionToPatient,
              status: 'Active',
              history: false,
            },
          },
        });
      }
    }
  };

  const onSaveFavoriteMedication = () => {
    const values = getValues();

    const data: FavoriteMedicationInput = {
      medication: values.medication,
      rxCui: '',
      synonym: values.medication,
      tty: '',
      language: '',
      sig: values.sig,
      refill: values.refill,
      generic: values.generic === 'true',
      substitutionAllowed: values.substitutionAllowed === 'true',
      directionToPatient: values.directionToPatient,
    };

    saveFavoriteMedication({ variables: { input: data } });
  };

  const pharmacies = data?.pharmacies.edges.map((e) => ({
    value: e?.node.id,
    label: `${e?.node.title} - ${e?.node.address}, ${e?.node.region}, ${
      e?.node.country
    } ${e?.node.inHouse ? '(In-House)' : ''}`,
  }));

  //const isGeneric = selectedDrug?.tty === "SCD";

  const handleStartingOver = () => {
    setMedicationInput('');
    setDrugGroup(null);
    setIsDrugGroupLoading(false);
    setSelectedDrug(null);
    setPrescribeAnother(false);
    setInteractions([]);
    reset();
  };

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-2xl font-extrabold tracking-wider">{title}</p>
          {!history && (
            <div>
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
            </div>
          )}

          <div>
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
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md text-gray-600"
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
                ref={register({ required: true })}
                className="border-gray-300 rounded-lg shadow-sm w-full h-8"
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
            {!history && (
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
            )}
            {!history && (
              <div className="mt-4">
                <input
                  type="checkbox"
                  id="favorite"
                  name="favorite"
                  value={saveToFavorite.toString()}
                  onChange={(evt) => setSaveToFavorite(evt.target.checked)}
                />
                <label className="ml-2 text-sm" htmlFor="favorite">
                  Save to favorites
                </label>
              </div>
            )}
          </div>

          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              className="inline-flex items-center justify-center w-full py-2 px-4 mt-4 border border-red-600 shadow-sm text-sm font-medium rounded-md focus:outline-none text-red-700 hover:bg-red-600 hover:text-white"
              onClick={handleStartingOver}
            >
              <span className="material-icons">replay</span>
              <span className="ml-2">Start over</span>
            </button>
            {!history && (
              <button
                type="submit"
                className="inline-flex items-center justify-center w-full py-2 px-4 mt-4 border border-teal-600 shadow-sm text-sm font-medium rounded-md focus:outline-none text-teal-700 hover:bg-teal-600 hover:text-white"
                onClick={() => setPrescribeAnother(true)}
              >
                {loading ? (
                  // @ts-ignore
                  <ReactLoading
                    type={'spinningBubbles'}
                    color={'teal'}
                    height={20}
                    width={20}
                    className="inline-block"
                  />
                ) : (
                  <span className="material-icons">fast_forward</span>
                )}

                <span className="ml-2">Order & Prescribe Another</span>
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full py-2 px-4 mt-4 border border-teal-600 shadow-sm text-sm font-medium rounded-md focus:outline-none text-teal-700 hover:bg-teal-600 hover:text-white "
            >
              {loading ? (
                // @ts-ignore
                <ReactLoading
                  type={'spinningBubbles'}
                  color={'teal'}
                  height={20}
                  width={20}
                  className="inline-block"
                />
              ) : (
                <span className="material-icons">save</span>
              )}

              <span className="ml-2">{history ? 'Save' : 'Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface Drug {
  rxcui: string;
  name: string;
}

interface DrugComponentInterface {
  title: string;
  drugs: Drug[];
  onSelect: (rxcui: string) => void;
}

const DrugComponent: React.FC<DrugComponentInterface> = ({
  title,
  drugs,
  onSelect,
}) => {
  return (
    <div className="bg-yellow-50 rounded-lg shadow-md">
      <div className="bg-green-400 p-1">
        <div className="flex items-center space-x-2 text-green-800">
          <span className="material-icons">reorder</span>
          <span className="font-semibold">{title}</span>
        </div>
      </div>
      <div className="p-4">
        {drugs?.map((e) => (
          <div
            key={e.rxcui}
            onClick={() => onSelect(e.rxcui)}
            className="flex items-center space-x-3 mt-2 transform hover:scale-105"
          >
            <span className="material-icons text-teal-600">local_pharmacy</span>
            <p className="text-blue-700 underline cursor-pointer">{e.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
