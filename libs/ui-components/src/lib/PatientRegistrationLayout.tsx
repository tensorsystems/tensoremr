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

import React from "react";
import { SimilarPatients } from "@tensoremr/models";
import { Button } from "../../../../apps/web/components/button";

interface Props {
  loading: boolean;
  paperRecord: boolean;
  update: boolean;
  migrationAlert?: string;
  demographic: React.ReactNode;
  contactInfo: React.ReactNode;
  emergencyInfo: React.ReactNode;
  similarPatients: SimilarPatients | undefined;
  onPatientClick?: (id: string, firstName: string, lastName: string) => void;
  onMigrate?: () => void;
}

export const PatientRegistrationLayout: React.FC<Props> = ({
  demographic,
  contactInfo,
  emergencyInfo,
  similarPatients,
  onPatientClick,
  loading,
  update,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-lg">
      <div className="mt-10 sm:mt-0">{demographic}</div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="mt-10 sm:mt-0">{contactInfo}</div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="mt-10 sm:mt-0">{emergencyInfo}</div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1"></div>

        <div className="mt-5 md:mt-0 md:col-span-2 flex space-x-6">
          <div className="py-3 bg-gray-50 w-full">
            {similarPatients && (
              <div className="bg-yellow-50 border-4 border-yellow-400">
                <div className="bg-yellow-400 p-1">
                  <div className="flex text-sm items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Similar patients found</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-around space-x-4">
                    {similarPatients.byName.length > 0 && (
                      <div>
                        <p>By Name</p>
                        <ul className="text-blue-500 underline mt-2">
                          {similarPatients?.byName.map((e) => (
                            <li
                              key={e?.id}
                              className="cursor-pointer"
                              onClick={() => {
                                onPatientClick &&
                                  onPatientClick(e.id, e.firstName, e.lastName);
                              }}
                            >{`${e.firstName} ${e.lastName} (ID: ${e.id})`}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {similarPatients.byPhone.length > 0 && (
                      <div>
                        By Phone
                        <ul className="text-blue-500 underline mt-2">
                          {similarPatients?.byName.map((e) => (
                            <li
                              key={e?.id}
                              className="cursor-pointer"
                              onClick={() => {
                                onPatientClick &&
                                  onPatientClick(e.id, e.firstName, e.lastName);
                              }}
                            >{`${e.firstName} ${e.lastName} (ID: ${e.id})`}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-sm">Similar Patients Found</p>
              <div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        MRN
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        Phone Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        Date of Birth
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200"></tbody>
                </table>
              </div>
            </div>

            <Button
              pill={true}
              loading={loading}
              loadingText={"Saving"}
              type="submit"
              text={update ? "Update" : "Save"}
              icon="save"
              variant="filled"
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
