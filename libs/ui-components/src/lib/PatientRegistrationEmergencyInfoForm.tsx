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

import React from 'react';

interface Props {
  register: any;
}

export const PatientRegistrationEmergencyInfoForm: React.FC<Props> = ({
  register,
}) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Emergency contact
          </h3>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="emergencyContactName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  id="emergencyContactName"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="emergencyContactRel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Relationship to patient
                </label>
                <input
                  type="text"
                  name="emergencyContactRel"
                  id="emergencyContactRel"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="emergencyContactPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact number
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  id="emergencyContactPhone"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="emergencyContactPhone2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact number 2
                </label>
                <input
                  type="text"
                  name="emergencyContactPhone2"
                  id="emergencyContactPhone2"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="emergencyContactMemo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Memo
                </label>
                <input
                  type="text"
                  name="emergencyContactMemo"
                  id="emergencyContactMemo"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
