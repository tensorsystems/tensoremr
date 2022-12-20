import React, { useState } from "react";
import { AppointmentInput, PaginationInput } from "@tensoremr/models";
import { useForm } from "react-hook-form";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import Button from "./button";

interface Props {
  patientId: string;
  updateId?: string;
  defaultValues?: AppointmentInput;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
  onCancel: () => void;
}

export const AppointmentFormContainer: React.FC<Props> = ({
  patientId,
  updateId,
  defaultValues,
  onSuccess,
  onFailure,
  onCancel,
}) => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<AppointmentInput>({
      defaultValues: defaultValues,
    });

  const onSubmit = (input: any) => {
    // TO-DO
  };

  // const providerStatus: null | "AVAILABLE" | "OVERBOOKED" | "FULLY_BOOKED" =
  //   "AVAILABLE" = "AVAILABLE";

  return (
    <div className="my-10 mx-8">
      <form onSubmit={onSubmit}>
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

        <p className="text-xl font-extrabold text-gray-800">{`Scheduling`}</p>

        <p className="text-gray-500">{patientId}</p>

        <div className="mt-8">
          <div className="mt-4">
            <label
              htmlFor="emergency"
              className="block text-sm font-medium text-gray-700"
            >
              Emergency
            </label>
            <select
              required
              id="emergency"
              {...register("emergency", { required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="checkInTime"
              className="block text-sm font-medium text-gray-700"
            >
              Check-In time
            </label>
            <input
              required
              type="datetime-local"
              id="checkInTime"
              {...register("checkInTime", { required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="provider"
              className="block text-sm font-medium text-gray-700"
            >
              Provider
            </label>
            <select
              required
              id="userId"
              name="userId"
              {...register("userId", { required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option></option>
            </select>
          </div>

          {/*providerStatus !== null && (
            <div className="mt-2">
              {providerStatus === "AVAILABLE" && (
                <p className="text-green-600 font-semibold">
                  {`${scheduledToday} scheduled on this day, ${bookingLeft} left`}
                </p>
              )}

              {providerStatus === "OVERBOOKED" && (
                <p className="text-yellow-500 font-semibold">
                  {`Provider is overbooked with ${scheduledToday} patients`}
                </p>
              )}

              {providerStatus === "FULLY_BOOKED" && (
                <p className="text-red-500 font-semibold">
                  {`Provider is fully booked with ${scheduledToday} patients`}
                </p>
              )}
            </div>
              )*/}

          <div className="mt-4">
            <label
              htmlFor="roomId"
              className="block text-sm font-medium text-gray-700"
            >
              Room
            </label>
            <select
              required
              id="roomId"
              {...register("roomId", { required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="visitTypeId"
              className="block text-sm font-medium text-gray-700"
            >
              Visit Type
            </label>
            <select
              required
              id="visitTypeId"
              name="visitTypeId"
              {...register("visitTypeId", { required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="medicalDepartment"
              className="block text-sm font-medium text-gray-700"
            >
              Medical Department
            </label>
            <select
              required
              id="medicalDepartment"
              name="medicalDepartment"
              {...register("medicalDepartment", { required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="General Medicine">General Medicine</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>

          {/*error && (
            <div className="mt-4">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          )*/}

          <div className="py-3 mt-2 bg-gray-50 text-right">
            <Button
              loading={false}
              type="submit"
              text="Schedule"
              icon="save"
              variant="filled"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
