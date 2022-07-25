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
  DiagnosticProcedure,
  EyewearPrescriptionInput,
  MutationSaveEyewearPrescriptionArgs,
  Query,
  QueryEyewearShopsArgs,
} from '@tensoremr/models';
import {
  RefractionDistanceComponent,
  RefractionNearComponent,
} from '@tensoremr/ui-components';
import Select from 'react-select';
import cn from 'classnames';

const SAVE_EYE_GLASS_PRESCRIPTION = gql`
  mutation SaveEyewearPrescription($input: EyewearPrescriptionInput!) {
    saveEyewearPrescription(input: $input) {
      id
    }
  }
`;

const EYE_WEAR_SHOPS = gql`
  query EyewearShops($page: PaginationInput!) {
    eyewearShops(page: $page) {
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

interface AddEyeGlassPrescriptionFormProps {
  history?: boolean;
  patientId: string | undefined;
  patientChartId: string | undefined;
  refraction: DiagnosticProcedure | undefined | null;
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const AddEyeGlassPrescriptionForm: React.FC<
  AddEyeGlassPrescriptionFormProps
> = ({
  history,
  patientId,
  patientChartId,
  refraction,
  onSuccess,
  onError,
  onCancel,
}) => {
  const { register, handleSubmit } = useForm<any>();
  const refractionForm = useForm<DiagnosticProcedure>();

  useEffect(() => {
    if (refraction) {
      refractionForm.reset(refraction);
    }
  }, [refraction]);

  const { data } = useQuery<Query, QueryEyewearShopsArgs>(EYE_WEAR_SHOPS, {
    variables: {
      page: { page: 1, size: 1000 },
    },
  });

  const [selectedEyewearShop, setSelectedEyewearShop] = useState<any>();

  useEffect(() => {
    if (data?.eyewearShops && data?.eyewearShops.edges?.length > 0) {
      if (data?.eyewearShops.edges[0]) {
        const eyewearShop = data?.eyewearShops.edges[0].node;

        const value = {
          value: eyewearShop.id,
          label: `${eyewearShop.title} - ${eyewearShop.address}, ${
            eyewearShop.region
          }, ${eyewearShop.country} ${eyewearShop.inHouse ? '(In-House)' : ''}`,
        };

        setSelectedEyewearShop(value);
      }
    }
  }, [data]);

  const [save, { error }] = useMutation<
    any,
    MutationSaveEyewearPrescriptionArgs
  >(SAVE_EYE_GLASS_PRESCRIPTION, {
    onCompleted(data) {
      onSuccess();
    },
    onError(error) {
      onError(error.message);
    },
  });

  const onSubmit = (data: EyewearPrescriptionInput) => {
    if (patientChartId !== undefined && patientId !== undefined) {
      data.patientId = patientId;
      data.patientChartId = patientChartId;
      data.eyewearShopId = selectedEyewearShop.value;
      data.status = 'Ordered';

      if (history) {
        data.history = true;
      } else {
        data.history = false;
      }

      save({ variables: { input: data } });
    }
  };

  const eyeWearShops = data?.eyewearShops.edges.map((e) => ({
    value: e?.node.id,
    label: `${e?.node.title} - ${e?.node.address}, ${e?.node.region}, ${
      e?.node.country
    } ${e?.node.inHouse ? '(In-House)' : ''}`,
  }));

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div className="w-3/4">
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
          <p className="text-2xl font-extrabold tracking-wider text-teal-700">
            Prescribe Eye Glass
          </p>
          <div className="mt-4">
            <Select
              placeholder="Eyewear Shop"
              options={eyeWearShops}
              value={selectedEyewearShop}
              onChange={(value) => {
                setSelectedEyewearShop(value);
              }}
            />
          </div>
          <div className="mt-4">
            <hr />
          </div>

          <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center mt-10">
            <div className="col-span-1"></div>
            <div className="col-span-4 justify-self-center">OD</div>
            <div className="col-span-4 justify-self-center">OS</div>

            <div className="col-span-1"></div>
            <div className="col-span-4">
              <div className="flex justify-around">
                <div>SPH</div>
                <div>CYL</div>
                <div>AXIS</div>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex justify-around">
                <div>SPH</div>
                <div>CYL</div>
                <div>AXIS</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center p-2 rounded-md">
            <div className="co-span-1">
              <span className="text-xs">Distance</span>
            </div>
            <div className="col-span-4"></div>
            <div className="col-span-4"></div>
          </div>

          <RefractionDistanceComponent
            readonly={true}
            values={refractionForm.getValues()}
            register={refractionForm.register}
            onChange={() => null}
          />

          <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center p-2 rounded-md">
            <div className="co-span-1">
              <span className="text-xs">Near</span>
            </div>
            <div className="col-span-4"></div>
            <div className="col-span-4"></div>
          </div>

          <RefractionNearComponent
            readonly={true}
            values={refractionForm.getValues()}
            register={refractionForm.register}
            onChange={() => null}
          />

          <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center mt-5">
            <div className="col-span-1">
              <span className="text-gray-600 tracking-wide text-sm">
                Visual Acuity
              </span>
            </div>
            <div className="col-span-4">
              <input
                type="text"
                name="rightVisualAcuity"
                readOnly
                ref={refractionForm.register}
                className={cn(
                  'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full'
                )}
                onChange={() => null}
              />
            </div>
            <div className="col-span-4">
              <input
                type="text"
                name="leftVisualAcuity"
                readOnly
                ref={refractionForm.register}
                className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
                onChange={() => null}
              />
            </div>
          </div>

          <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center mt-2">
            <div className="col-span-1">
              <span className="text-gray-600 tracking-wide text-sm">
                Far PD
              </span>
            </div>
            <div className="col-span-4">
              <input
                type="text"
                name="farPd"
                readOnly
                ref={refractionForm.register}
                className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
                onChange={() => null}
              />
            </div>
            <div className="col-span-4"></div>
            <div className="col-span-1">
              <span className="text-gray-600 tracking-wide text-sm">
                Near PD
              </span>
            </div>
            <div className="col-span-4">
              <input
                type="text"
                name="nearPd"
                readOnly
                ref={refractionForm.register}
                className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
                onChange={() => null}
              />
            </div>
            <div className="col-span-4"></div>
          </div>

          <div className="mt-10 grid grid-cols-4 space-y-2 text-lg">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="glass"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Glass</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="photoChromatic"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Photo Chromatic</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="bifocal"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Bifocal</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="plastic"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Plastic</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="glareFree"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Glare Free</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="progressive"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Progressive</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="singleVision"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Single vision</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="scratchResistant"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Scratch Resistant</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="twoSeparateGlasses"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Two separate glasses</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="highIndex"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">High Index</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="tint"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Tint</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="blueCut"
                ref={register}
                onChange={() => null}
              />
              <span className="ml-2">Blue Cut</span>
            </label>
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 focus:outline-none"
          >
            <span className="ml-2">Order</span>
          </button>
        </form>
      </div>
    </div>
  );
};
