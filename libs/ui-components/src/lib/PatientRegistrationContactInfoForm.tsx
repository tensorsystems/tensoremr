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

export const PatientRegistrationContactInfoForm: React.FC<Props> = ({
  register,
}) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Contact information
          </h3>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2 shadow-md">
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="cellPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cell phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNo"
                  id="phoneNo"
                  required
                  ref={register({ required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="cellPhone2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cell phone 2
                </label>
                <input
                  type="tel"
                  name="phoneNo2"
                  id="phoneNo2"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="homePhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Home Phone
                </label>
                <input
                  type="tel"
                  name="homePhone"
                  id="homePhone"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="region"
                  className="block text-sm font-medium text-gray-700"
                >
                  Region <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="region"
                  required
                  ref={register({ required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="woreda"
                  className="block text-sm font-medium text-gray-700"
                >
                  Woreda <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="woreda"
                  id="woreda"
                  required
                  ref={register({ required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="zone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Zone
                </label>
                <input
                  type="text"
                  name="zone"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="kebele"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kebele
                </label>
                <input
                  type="text"
                  name="kebele"
                  id="kebele"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="subCity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sub-City
                </label>
                <input
                  type="text"
                  name="subCity"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="houseNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  House No
                </label>
                <input
                  type="text"
                  name="houseNo"
                  id="houseNo"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-12 sm:col-span-12">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
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
