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

import { Encounter } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

import { debounce } from "lodash";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useSession } from "next-auth/react";
import {
  createVisionPrescription,
  getFinancialResourceStatuses,
  getVisionBaseCodes,
  getVisionEyeCodes,
  updateVisionPrescription,
} from "../../../../api";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

export default function VisionPrescriptionForm({
  updateId,
  encounter,
  onSuccess,
}: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, control, setValue } = useForm<any>({});
  const { data: session } = useSession();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    // TO-DO
  };

  const createVisionPrescriptionMu = useSWRMutation(
    "visionPrescriptions",
    (key, { arg }) => createVisionPrescription(arg)
  );

  const updateVisionPrescriptionMu = useSWRMutation(
    "visionPrescriptions",
    (key, { arg }) => updateVisionPrescription(arg.id, arg.visionPrescription)
  );

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
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Vision Prescription" : "Add Vision Prescription"}
      </p>
    </form>
  );
}
