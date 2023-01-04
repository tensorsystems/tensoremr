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
import { useEffect, useState } from "react";
import { Spinner } from "flowbite-react";
import { searchPatients } from "../_api";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchFields, setSearchFields] = useState<ISearchField>({
    givenName: null,
    familyName: null,
    mrn: null,
  });

  useEffect(() => {
    const searchParams = [];

    if (searchFields.givenName) {
      searchParams.push(`family=${searchFields.givenName}`);
    }

    if (searchFields.familyName) {
      searchParams.push(`family=${searchFields.familyName}`);
    }

    if (searchFields.mrn) {
      searchParams.push(`family=${searchFields.mrn}`);
    }

    setIsLoading(true);

    searchPatients(searchParams.join("&")).then(
      (res) => {
        const bundle: Bundle = res.data;
      }
    );
  }, [searchFields]);

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
              value={searchFields.givenName ?? ""}
              onChange={(evt) =>
                setSearchFields({
                  ...searchFields,
                  givenName: evt.target.value,
                })
              }
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="flex-1 z-10">
            <input
              type="text"
              id="familyName"
              placeholder="Family Name"
              value={searchFields.familyName ?? ""}
              onChange={(evt) =>
                setSearchFields({
                  ...searchFields,
                  familyName: evt.target.value,
                })
              }
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="flex-1 z-10">
            <input
              type="text"
              id="mrn"
              placeholder="Medical Record Number"
              value={searchFields.mrn ?? ""}
              onChange={(evt) =>
                setSearchFields({
                  ...searchFields,
                  mrn: evt.target.value,
                })
              }
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setSearchFields({
                  givenName: null,
                  familyName: null,
                  mrn: null,
                });
              }}
            >
              <span className="material-icons text-red-500 py-1">
                clear_all
              </span>
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center mt-10">
            <Spinner color="warning" aria-label="Calendar loading" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
