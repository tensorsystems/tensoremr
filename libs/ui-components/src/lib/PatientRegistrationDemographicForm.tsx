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

import { Menu } from '@headlessui/react';
import { CalendarIcon, CalculatorIcon } from '@heroicons/react/outline';
import React from 'react';
import { PatientInput, PatientUpdateInput } from '@tensoremr/models';
import { MenuComponent } from './MenuComponent';

interface Props {
  values: PatientInput | PatientUpdateInput;
  register: any;
  ageInput: 'default' | 'manual' | 'months';
  setAgeInput: (value: 'default' | 'manual' | 'months') => void;
}

export const PatientRegistrationDemographicForm: React.FC<Props> = ({
  values,
  register,
  ageInput,
  setAgeInput,
}) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Demographic
          </h3>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2 shadow-md">
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  ref={register({ required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle name
                </label>
                <input
                  type="text"
                  name="middleName"
                  id="middleName"
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  ref={register({ required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  <span>
                    {ageInput === 'default' && 'Date of Birth'}
                    {ageInput === 'manual' && 'Age In Years'}
                    {ageInput === 'months' && 'Age In Months'}
                  </span>{' '}
                  <span className="text-red-600">*</span>
                </label>
                <div className="flex mt-1">
                  <input
                    required
                    autoComplete="off"
                    name="dateOfBirth"
                    type={ageInput === 'default' ? 'date' : 'number'}
                    ref={register({ required: true })}
                    onWheel={(event) => event.currentTarget.blur()}
                    className="p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md rounded-r-none"
                  />
                  <MenuComponent
                    title={'Options'}
                    color={'bg-gray-500 text-white hover:bg-gray-600'}
                    rounded={'rounded-md rounded-l-none'}
                    menus={
                      <div className="px-1 py-1">
                        <Menu.Item>
                          <button
                            className={`${
                              ageInput === 'default'
                                ? 'bg-teal-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setAgeInput('default')}
                          >
                            <CalendarIcon
                              className="w-5 h-5 mr-2 text-teal-700"
                              aria-hidden="true"
                            />
                            Date of Birth
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className={`${
                              ageInput === 'manual'
                                ? 'bg-teal-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setAgeInput('manual')}
                          >
                            <CalculatorIcon
                              className="w-5 h-5 mr-2 text-teal-700"
                              aria-hidden="true"
                            />
                            Enter Age In Years
                          </button>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className={`${
                              ageInput === 'months'
                                ? 'bg-teal-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setAgeInput('months')}
                          >
                            <CalculatorIcon
                              className="w-5 h-5 mr-2 text-teal-700"
                              aria-hidden="true"
                            />
                            Enter Age In Months
                          </button>
                        </Menu.Item>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender <span className="text-red-600">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  ref={register({ required: true })}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="idNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Identification number
                </label>
                <input
                  type="text"
                  name="idNo"
                  id="idNo"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="martialStatus"
                  className="block text-sm font-medium text-gray-700"
                >
                  Martial Status
                </label>
                <input
                  type="text"
                  name="martialStatus"
                  id="martialStatus"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  id="occupation"
                  ref={register}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-3">
                <label
                  htmlFor="memo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Memo
                </label>
                <input
                  type="text"
                  name="memo"
                  id="memo"
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
