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

import { Transition } from '@headlessui/react';
import { format, parseISO } from 'date-fns';
import React, { Fragment, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  DiagnosticProcedure,
  EyewearPrescriptionOrder,
  Patient,
  User,
} from '@tensoremr/models';
import { getEyewearRxNames, getFileUrl, getPatientAge } from '@tensoremr/util';
import { PrintFileHeader } from './PrintFileHeader';

interface Props {
  refraction: DiagnosticProcedure | undefined | null;
  user: User;
  patient: Patient;
  eyewearPrescriptionOrder: EyewearPrescriptionOrder;
}

export const EyewearPrescriptionPrint: React.FC<Props> = ({
  user,
  patient,
  refraction,
  eyewearPrescriptionOrder,
}) => {
  const [showPrintButton, setShowPrintButton] = useState<boolean>(false);
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const namePrefix = user?.userTypes?.some((e) => e?.title === 'Physician')
    ? 'Dr. '
    : '';

  return (
    <div
      onMouseEnter={() => setShowPrintButton(true)}
      onMouseLeave={() => setShowPrintButton(false)}
      className="bg-gray-600 rounded  p-5 mt-5"
    >
      <p className="text-white font-semibold">Available for print</p>
      <div className="relative mt-5">
        <div className="bg-white p-6" ref={componentRef}>
          <PrintFileHeader
            // @ts-ignore
            qrUrl={`http://${window.__RUNTIME_CONFIG__.REACT_APP_SERVER_URL}/#/appointments/${patient.id}/patient-dashboard`}
          />
          <hr className="border border-solid border-teal-500 bg-teal-400 mt-5" />

          <p className="text-2xl text-gray-700 text-center mt-4">Eyeglass Rx</p>

          <hr className="mt-5" />

          <div className="grid grid-rows-3 grid-flow-col">
            <div>
              <span className="font-semibold">Patient:</span>{' '}
              <span>{`${patient.firstName} ${patient.lastName}`}</span>
            </div>
            <div>
              <span className="font-semibold">Age:</span>{' '}
              <span>{getPatientAge(patient.dateOfBirth)}</span>
            </div>
            <div>
              <span className="font-semibold">Gender:</span>{' '}
              <span>{patient.gender}</span>
            </div>
            <div>
              <span className="font-semibold">City:</span>{' '}
              <span>{patient.city}</span>
            </div>
            <div>
              <span className="font-semibold">Woreda:</span>{' '}
              <span>{patient.woreda}</span>
            </div>
            <div>
              <span className="font-semibold">Tel:</span>{' '}
              <span>{patient.phoneNo}</span>
            </div>
            <div>
              <span className="font-semibold">Electronic ID:</span>{' '}
              <span>{patient.id}</span>
            </div>
          </div>

          <hr className="mt-2" />

          <table className="table-auto divide-y divide-gray-200 mt-5 w-full shadow-lg rounded-lg border">
            <thead className="">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b"
                ></th>
                <th
                  scope="col"
                  colSpan={4}
                  className="px-6 py-3 text-center text-xs font-medium  uppercase tracking-wider border-b"
                >
                  Right Eye
                </th>
                <th
                  scope="col"
                  colSpan={4}
                  className="px-6 py-3 text-center text-xs font-medium  uppercase tracking-wider border-b"
                >
                  Left Eye
                </th>
              </tr>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider border-r"
                >
                  Rx
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                >
                  Sph
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                >
                  Cyl
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                >
                  Axis
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider border-r"
                >
                  Pri
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                >
                  Sph
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                >
                  Cyl
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                >
                  Axis
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
                >
                  Pri
                </th>
              </tr>
            </thead>
            {refraction ? (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-2 text-gray-900 border-r">Distance</td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.rightDistanceFinalSph}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.rightDistanceFinalCyl}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.rightDistanceFinalAxis}
                  </td>
                  <td className="px-6 py-2 text-gray-900 border-r"></td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.leftDistanceFinalSph}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.leftDistanceFinalCyl}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.leftDistanceFinalAxis}
                  </td>
                  <td className="px-6 py-2 text-gray-900"></td>
                </tr>
                <tr>
                  <td className="px-6 py-2 text-gray-900 border-r">Near</td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.rightNearFinalSph}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.rightNearFinalCyl}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.rightNearFinalAxis}
                  </td>
                  <td className="px-6 py-2 text-gray-900 border-r"></td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.leftNearFinalSph}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.leftNearFinalCyl}
                  </td>
                  <td className="px-6 py-2 text-gray-900">
                    {refraction?.leftNearFinalAxis}
                  </td>
                  <td className="px-6 py-2 text-gray-900"></td>
                </tr>
              </tbody>
            ) : (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-2 text-gray-900 border-r">Distance</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900 border-r"></td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900"></td>
                </tr>
                <tr>
                  <td className="px-6 py-2 text-gray-900 border-r">Near</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900 border-r"></td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900">Plano</td>
                  <td className="px-6 py-2 text-gray-900"></td>
                </tr>
              </tbody>
            )}
          </table>

          <table className="table-auto divide-y divide-gray-200 mt-5 w-full shadow-lg rounded-lg border">
            <thead className="">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium  uppercase tracking-wider"
                >
                  Far PD
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium  uppercase tracking-wider"
                >
                  Near PD
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4  text-gray-900 text-center">
                  {refraction?.farPd}
                </td>
                <td className="px-6 py-4  text-gray-900 text-center">
                  {refraction?.nearPd}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="table-auto divide-y divide-gray-200 mt-5 w-full shadow-lg rounded-lg border">
            <thead className="">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Prescription
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eyewearPrescriptionOrder?.eyewearPrescriptions.map((e) => (
                <tr key={e?.id}>
                  <td className="px-6 py-2  text-gray-900 text-left">
                    {getEyewearRxNames(e)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 flex justify-between">
            <div>
              <p className="font-bold">Prescriber</p>
              <div className="mt-2">
                <span className="font-semibold">Name: </span>
                <span>{`${namePrefix} ${user.firstName} ${user.lastName}`}</span>
              </div>
              <div>
                <span className="font-semibold">Qualification: </span>
                <span></span>
              </div>
              <div>
                <span className="font-semibold">Registration #: </span>
                <span></span>
              </div>
              <div>
                <span className="font-semibold">Date: </span>
                <span>
                  {format(
                    parseISO(eyewearPrescriptionOrder.createdAt),
                    'MMM d, y'
                  )}
                </span>
              </div>
              <div>
                <span className="font-semibold">Signature: </span>
                <span></span>
              </div>
              {user.signature && (
                <div className="mt-5">
                  <img
                    className="h-auto w-32"
                    src={getFileUrl({
                      // @ts-ignore
                      baseUrl: window.__RUNTIME_CONFIG__.REACT_APP_SERVER_URL,
                      fileName: user?.signature.fileName,
                      hash: user?.signature.hash,
                      extension: user?.signature.extension,
                    })}
                  />
                </div>
              )}
            </div>
            <div className="mr-20">
              <p className="font-bold">Dispenser</p>
              <div className="mt-2">
                <span className="font-semibold">Name: </span>
                <span></span>
              </div>
              <div>
                <span className="font-semibold">Qualification: </span>
                <span></span>
              </div>
              <div>
                <span className="font-semibold">Registration #: </span>
                <span></span>
              </div>
              <div>
                <span className="font-semibold">Date: </span>
                <span></span>
              </div>
              <div>
                <span className="font-semibold">Signature: </span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <Transition.Root
          show={showPrintButton}
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute top-4 right-5">
            <button
              type="button"
              className=" tracking-wide text-teal-800 hover:bg-teal-700 hover:text-white subpixel-antialiased px-5 py-2 rounded-lg flex items-center space-x-2 border"
              onClick={handlePrint}
            >
              <span className="material-icons">print</span>
              <div>Print this</div>
            </button>
          </div>
        </Transition.Root>
      </div>
    </div>
  );
};
