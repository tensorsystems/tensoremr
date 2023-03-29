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

import {
  Encounter,
  VisionPrescription,
  VisionPrescriptionLensSpecification,
} from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { parseInt } from "lodash";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  createVisionPrescription,
  getFinancialResourceStatuses,
  getServerTime,
  getVisionBaseCodes,
  getVisionEyeCodes,
  getVisionPrescription,
  getVisionProducts,
  updateVisionPrescription,
} from "../../../../api";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import { useSession } from "../../../../context/SessionProvider";
import { getUserIdFromSession } from "../../../../util/ory";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
  onClose: () => void;
}

export default function VisionPrescriptionForm({
  updateId,
  encounter,
  onSuccess,
  onClose,
}: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } = useForm<any>({});
  const { session } = useSession();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rightEyeActive, setRightEyeActive] = useState<boolean>(false);
  const [leftEyeActive, setLeftEyeActive] = useState<boolean>(false);

  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);

    const visionPrescription: VisionPrescription = (
      await getVisionPrescription(updateId)
    )?.data;

    const rightEye = visionPrescription?.lensSpecification?.find(
      (e) => e.eye === "right"
    );
    if (rightEye) {
      setRightEyeActive(true);

      if (rightEye.product)
        setValue("right.product", rightEye.product?.coding?.at(0)?.code);
      if (rightEye.sphere) setValue("right.sphere", rightEye.sphere);
      if (rightEye.cylinder) setValue("right.cylinder", rightEye.cylinder);
      if (rightEye.axis) setValue("right.axis", rightEye.axis);

      if (rightEye.prism) {
        if (rightEye.prism?.at(0).amount)
          setValue("right.prismAmount", rightEye.prism?.at(0).amount);
        if (rightEye.prism?.at(0).base)
          setValue("right.prismBase", rightEye.prism?.at(0).base);
      }

      if (rightEye.add) setValue("right.add", rightEye.add);
      if (rightEye.power) setValue("right.power", rightEye.power);
      if (rightEye.backCurve) setValue("right.backCurve", rightEye.backCurve);
      if (rightEye.diameter) setValue("right.diameter", rightEye.diameter);
      if (rightEye.duration)
        setValue("right.duration", rightEye.duration?.value);
      if (rightEye.color) setValue("right.color", rightEye.color);
      if (rightEye.brand) setValue("right.brand", rightEye.brand);
      if (rightEye.note)
        setValue("right.note", rightEye?.note?.map((n) => n.text).join(", "));
    }

    const leftEye = visionPrescription?.lensSpecification?.find(
      (e) => e.eye === "left"
    );
    if (leftEye) {
      setLeftEyeActive(true);

      if (leftEye.product)
        setValue("left.product", leftEye.product?.coding?.at(0)?.code);
      if (leftEye.sphere) setValue("left.sphere", leftEye.sphere);
      if (leftEye.cylinder) setValue("left.cylinder", leftEye.cylinder);
      if (leftEye.axis) setValue("left.axis", leftEye.axis);

      if (leftEye.prism) {
        if (leftEye.prism?.at(0).amount)
          setValue("left.prismAmount", leftEye.prism?.at(0).amount);
        if (leftEye.prism?.at(0).base)
          setValue("left.prismBase", leftEye.prism?.at(0).base);
      }

      if (leftEye.add) setValue("left.add", leftEye.add);
      if (leftEye.power) setValue("left.power", leftEye.power);
      if (leftEye.backCurve) setValue("left.backCurve", leftEye.backCurve);
      if (leftEye.diameter) setValue("left.diameter", leftEye.diameter);
      if (leftEye.duration) setValue("left.duration", leftEye.duration?.value);
      if (leftEye.color) setValue("left.color", leftEye.color);
      if (leftEye.brand) setValue("left.brand", leftEye.brand);
      if (leftEye.note)
        setValue("left.note", leftEye?.note?.map((n) => n.text).join(", "));
    }

    setIsLoading(false);
  };

  const createVisionPrescriptionMu = useSWRMutation(
    "visionPrescriptions",
    (key, { arg }) => createVisionPrescription(arg)
  );

  const updateVisionPrescriptionMu = useSWRMutation(
    "visionPrescriptions",
    (key, { arg }) => updateVisionPrescription(arg.id, arg.visionPrescription)
  );

  const visionProducts =
    useSWR("visionProducts", () =>
      getVisionProducts()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const financialResourceStatuses =
    useSWR("financialResources", () =>
      getFinancialResourceStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const visionEyesCodes =
    useSWR("visionEyesCodes", () =>
      getVisionEyeCodes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const visionBaseCodes =
    useSWR("visionBaseCodes", () =>
      getVisionBaseCodes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const onSubmit = async (input: any) => {
    setIsLoading(true);
    try {
      const time = (await getServerTime()).data;

      const productRight = visionProducts?.find(
        (e) => e.value === input.right.product
      );
      const productLeft = visionProducts?.find(
        (e) => e.value === input.left.product
      );

      const lensSpecifications: VisionPrescriptionLensSpecification[] = [];

      if (rightEyeActive) {
        lensSpecifications.push({
          product: {
            coding: [
              {
                code: productRight.value,
                display: productRight.label,
                system: productRight.system,
              },
            ],
            text: productRight.label,
          },
          eye: "right",
          sphere: input.right.sphere ? parseInt(input.right.sphere) : undefined,
          cylinder: input.right.cylinder
            ? parseInt(input.right.cylinder)
            : undefined,
          axis: input.right.axis ? parseInt(input.right.axis) : undefined,
          prism: input.right.prismAmount
            ? [
                {
                  amount: parseInt(input.right.prismAmount),
                  base: input.right.prismBase,
                },
              ]
            : undefined,
          add: input.right.add ? parseInt(input.right.add) : undefined,
          power: input.right.power ? parseInt(input.right.power) : undefined,
          backCurve: input.right.backCurve
            ? parseInt(input.right.backCurve)
            : undefined,
          diameter: input.right.diameter
            ? parseInt(input.right.diameter)
            : undefined,
          duration: input.right.duration
            ? {
                value: parseInt(input.right.duration),
              }
            : undefined,
          color: input.right.color?.length > 0 ? input.right.color : undefined,
          brand: input.right.brand?.length > 0 ? input.right.brand : undefined,
          note: input.right.note
            ? [
                {
                  text: input.right.note,
                },
              ]
            : undefined,
        });
      }

      if (leftEyeActive) {
        lensSpecifications.push({
          product: {
            coding: [
              {
                code: productLeft.value,
                display: productLeft.label,
                system: productLeft.system,
              },
            ],
            text: productLeft.label,
          },
          eye: "left",
          sphere: input.left.sphere ? parseInt(input.left.sphere) : undefined,
          cylinder: input.left.cylinder
            ? parseInt(input.left.cylinder)
            : undefined,
          axis: input.left.axis ? parseInt(input.left.axis) : undefined,
          prism: input.left.prismAmount
            ? [
                {
                  amount: parseInt(input.left.prismAmount),
                  base: input.left.prismBase,
                },
              ]
            : undefined,
          add: input.left.add ? parseInt(input.left.add) : undefined,
          power: input.left.power ? parseInt(input.left.power) : undefined,
          backCurve: input.left.backCurve
            ? parseInt(input.left.backCurve)
            : undefined,
          diameter: input.left.diameter
            ? parseInt(input.left.diameter)
            : undefined,
          duration: input.left.duration
            ? {
                value: parseInt(input.left.duration),
              }
            : undefined,
          color: input.left.color?.length > 0 ? input.left.color : undefined,
          brand: input.left.brand?.length > 0 ? input.left.brand : undefined,
          note: input.left.note
            ? [
                {
                  text: input.left.note,
                },
              ]
            : undefined,
        });
      }

      const userId = session ? getUserIdFromSession(session) : "";

      const visionPrescription: VisionPrescription = {
        resourceType: "VisionPrescription",
        id: updateId ? updateId : undefined,
        status: "active",
        created: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        dateWritten: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        prescriber: {
          reference: `Practitioner/${userId}`,
          type: "Practitioner",
        },
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        patient: encounter.subject,
        lensSpecification:
          lensSpecifications.length > 0 ? lensSpecifications : undefined,
      };

      if (updateId) {
        await updateVisionPrescriptionMu.trigger({
          id: updateId,
          visionPrescription,
        });
      } else {
        await createVisionPrescriptionMu.trigger(visionPrescription);
      }

      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.message,
          variant: "failure",
        });
      }

      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between">
        <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
          {updateId ? "Update Vision Prescription" : "Add Vision Prescription"}
        </p>

        <div>
          <button
            onClick={() => {
              onClose();
            }}
          >
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
      </div>

      <div className="flex space-x-6">
        <div
          className={`mt-4 border rounded-md border-teal-600 p-4 flex-1 ${
            !rightEyeActive ? "bg-stone-50" : ""
          }`}
        >
          <div className="flex justify-between">
            <p className="text-gray-700 tracking-wide">Right Eye</p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rightEyeActive"
                checked={rightEyeActive}
                onChange={(evt) => setRightEyeActive(evt.target.checked)}
              />
            </div>
          </div>

          <div className={!rightEyeActive ? "pointer-events-none" : ""}>
            <div className="mt-4">
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700"
              >
                Product
              </label>
              <select
                required={rightEyeActive}
                {...register("right.product", { required: rightEyeActive })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option></option>
                {visionProducts.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="sphere" className="block text-gray-700 text-sm">
                Sphere
              </label>
              <input
                type="number"
                name="sphere"
                id="sphere"
                {...register("right.sphere")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="cylinder" className="block text-gray-700 text-sm">
                Cylinder
              </label>
              <input
                type="number"
                name="cylinder"
                id="cylinder"
                {...register("right.cylinder")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="axis" className="block text-gray-700 text-sm">
                Axis
              </label>
              <input
                type="number"
                name="axis"
                id="axis"
                {...register("right.axis")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="mt-4 flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="prismAmount"
                  className="block text-gray-700 text-sm"
                >
                  Prism
                </label>
                <input
                  type="number"
                  name="prismAmount"
                  id="prismAmount"
                  {...register("right.prismAmount")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="prismBase"
                  className="block text-sm font-medium text-gray-700"
                >
                  Base
                </label>
                <select
                  {...register("right.prismBase")}
                  className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option></option>
                  {visionBaseCodes.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <label htmlFor="add" className="block text-gray-700 text-sm">
                  Add
                </label>
                <input
                  type="number"
                  name="add"
                  id="add"
                  {...register("right.add")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="power" className="block text-gray-700 text-sm">
                  Power
                </label>
                <input
                  type="number"
                  name="power"
                  id="power"
                  {...register("right.power")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="backCurve"
                  className="block text-gray-700 text-sm"
                >
                  Back Curve
                </label>
                <input
                  type="number"
                  name="backCurve"
                  id="backCurve"
                  {...register("right.backCurve")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="diameter"
                  className="block text-gray-700 text-sm"
                >
                  Diameter
                </label>
                <input
                  type="number"
                  name="diameter"
                  id="diameter"
                  {...register("right.diameter")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-gray-700 text-sm"
                >
                  Duration
                </label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  {...register("right.duration")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-gray-700 text-sm">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  id="color"
                  {...register("right.color")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="brand" className="block text-gray-700 text-sm">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                id="brand"
                {...register("right.brand")}
                className="mt-1 p-1 pl-4  block w-full sm:text-md border-gray-300 border rounded-md text-sm"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="note" className="block text-gray-700 text-sm">
                Note
              </label>
              <input
                type="text"
                name="note"
                id="note"
                {...register("right.note")}
                className="mt-1 p-1 pl-4  block w-full sm:text-md border-gray-300 border rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        <div
          className={`mt-4 border rounded-md border-teal-600 p-4 flex-1 ${
            !leftEyeActive ? "bg-stone-50" : ""
          }`}
        >
          <div className="flex justify-between">
            <p className="text-gray-700 tracking-wide">Left Eye</p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="leftEyeActive"
                checked={leftEyeActive}
                onChange={(evt) => setLeftEyeActive(evt.target.checked)}
              />
            </div>
          </div>

          <div className={!leftEyeActive ? "pointer-events-none" : ""}>
            <div className="mt-4">
              <label
                htmlFor="product"
                className="block text-sm font-medium text-gray-700"
              >
                Product
              </label>
              <select
                required={leftEyeActive}
                {...register("left.product", { required: leftEyeActive })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option></option>
                {visionProducts.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="sphere" className="block text-gray-700 text-sm">
                Sphere
              </label>
              <input
                type="number"
                name="sphere"
                id="sphere"
                {...register("left.sphere")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="cylinder" className="block text-gray-700 text-sm">
                Cylinder
              </label>
              <input
                type="number"
                name="cylinder"
                id="cylinder"
                {...register("left.cylinder")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="axis" className="block text-gray-700 text-sm">
                Axis
              </label>
              <input
                type="number"
                name="axis"
                id="axis"
                {...register("left.axis")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="mt-4 flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="prismAmount"
                  className="block text-gray-700 text-sm"
                >
                  Prism
                </label>
                <input
                  type="number"
                  name="prismAmount"
                  id="prismAmount"
                  {...register("left.prismAmount")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="prismBase"
                  className="block text-sm font-medium text-gray-700"
                >
                  Base
                </label>
                <select
                  {...register("left.prismBase")}
                  className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option></option>
                  {visionBaseCodes.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <label htmlFor="add" className="block text-gray-700 text-sm">
                  Add
                </label>
                <input
                  type="number"
                  name="add"
                  id="add"
                  {...register("left.add")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="power" className="block text-gray-700 text-sm">
                  Power
                </label>
                <input
                  type="number"
                  name="power"
                  id="power"
                  {...register("left.power")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="backCurve"
                  className="block text-gray-700 text-sm"
                >
                  Back Curve
                </label>
                <input
                  type="number"
                  name="backCurve"
                  id="backCurve"
                  {...register("left.backCurve")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="diameter"
                  className="block text-gray-700 text-sm"
                >
                  Diameter
                </label>
                <input
                  type="number"
                  name="diameter"
                  id="diameter"
                  {...register("left.diameter")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-gray-700 text-sm"
                >
                  Duration
                </label>
                <input
                  type="number"
                  name="duration"
                  id="duration"
                  {...register("left.duration")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-gray-700 text-sm">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  id="color"
                  {...register("left.color")}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="brand" className="block text-gray-700 text-sm">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                id="brand"
                {...register("left.brand")}
                className="mt-1 p-1 pl-4  block w-full sm:text-md border-gray-300 border rounded-md text-sm"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="note" className="block text-gray-700 text-sm">
                Note
              </label>
              <input
                type="text"
                name="note"
                id="note"
                {...register("left.note")}
                className="mt-1 p-1 pl-4  block w-full sm:text-md border-gray-300 border rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {false && <p className="text-red-600">Error: </p>}
      </div>
      <Button
        pill={true}
        loading={isLoading}
        loadingText={"Saving"}
        type="submit"
        text={updateId ? "Update" : "Save"}
        icon="save"
        variant="filled"
        disabled={isLoading}
      />
    </form>
  );
}
