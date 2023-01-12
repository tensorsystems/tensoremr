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

import { Bundle, Patient } from "fhir/r4";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "flowbite-react";
import { searchPatients } from "../_api";
import { debounce } from "lodash";

interface Props {
  onPatientSelect: (patient: Patient) => void;
  onError?: (message: string) => void;
  onClose: () => void;
}

interface ISearchField {
  givenName: string | null;
  familyName: string | null;
  mrn: string | null;
}

export default function PatientFinder({
  onPatientSelect,
  onError,
  onClose,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchFields, setSearchFields] = useState<ISearchField>({
    givenName: null,
    familyName: null,
    mrn: null,
  });

  useEffect(() => {
    const searchParams = [];

    if (searchFields.givenName) {
      searchParams.push(`given=${searchFields.givenName}`);
    }

    if (searchFields.familyName) {
      searchParams.push(`family=${searchFields.familyName}`);
    }

    if (searchFields.mrn) {
      searchParams.push(`identifier=${searchFields.mrn}`);
    }

    const params = searchParams.join("&");

    if (params.length > 0) {
      setIsLoading(true);
      searchPatients(searchParams.join("&"))
        .then((res) => {
          const bundle: Bundle = res.data;
          const patients =
            bundle.entry
              ?.filter((e) => e.search.mode === "match")
              .map((e) => e.resource as Patient) ?? [];
          setPatients(patients);
          setIsLoading(false);
        })
        .catch((error) => {
          onError && onError(error.message);
          setIsLoading(false);
        });
    }
  }, [searchFields]);

  const givenDebouncedSearch = useRef(
    debounce(async (givenName) => {
      setSearchFields({
        ...searchFields,
        givenName,
      });
    }, 500)
  ).current;

  const familyDebouncedSearch = useRef(
    debounce(async (familyName) => {
      setSearchFields({
        ...searchFields,
        familyName,
      });
    }, 500)
  ).current;

  const mrnDebouncedSearch = useRef(
    debounce(async (mrn) => {
      setSearchFields({
        ...searchFields,
        mrn,
      });
    }, 500)
  ).current;

  return (
    <div>
      <div className="float-right">
        <button onClick={onClose}>
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

      <div>
        <div>
          <p className="text-2xl font-extrabold tracking-wider text-teal-600">
            Find Patient
          </p>
        </div>

        <div className="mt-4 flex items-center space-x-5">
          <div className="flex-1 z-10">
            <input
              type="text"
              id="givenName"
              placeholder="Given Name"
              onChange={(evt) => givenDebouncedSearch(evt.target.value)}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-sm"
            />
          </div>
          <div className="flex-1 z-10">
            <input
              type="text"
              id="familyName"
              placeholder="Family Name"
              onChange={(evt) => familyDebouncedSearch(evt.target.value)}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-sm"
            />
          </div>
          <div className="flex-1 z-10">
            <input
              type="text"
              id="mrn"
              placeholder="Medical Record Number"
              onChange={(evt) => mrnDebouncedSearch(evt.target.value)}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-sm"
            />
          </div>
        </div>
        {patients.length === 0 && !isLoading && (
          <div className="h-48 flex items-center justify-center">
            <div className="flex space-x-2 items-center text-gray-400">
              <p className="material-icons">search</p>
              <p>Search</p>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner color="warning" aria-label="Calendar loading" />
          </div>
        ) : (
          <div hidden={patients.length === 0}>
            <div className="mt-8 bg-stone-50">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="">
                    <th
                      scope="col"
                      className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      MRN
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      Date of Birth
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {patients?.map((e) => {
                    const mrn =
                      e.identifier?.find((e) =>
                        e.type.coding.find((t) => t.code === "MR")
                      )?.value ?? "";
                    const name =
                      e.name?.map(
                        (e) => `${e.given.join(", ")}, ${e.family}`
                      ) ?? "";
                    const contactNumber =
                      e.telecom?.find((e) => e.system === "phone").value ?? "";

                    return (
                      <tr
                        key={e.id}
                        className="hover:bg-stone-100 rounded-md"
                        onClick={() => onPatientSelect(e)}
                      >
                        <td className="px-6 py-2 text-sm text-yellow-800">
                          {mrn}
                        </td>
                        <td className="px-6 py-2 text-sm text-yellow-800 underline cursor-pointer">
                          {name}
                        </td>
                        <td className="px-6 py-2 text-sm text-yellow-800">
                          {contactNumber}
                        </td>
                        <td className="px-6 py-2 text-sm text-yellow-800">
                          {e.birthDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
