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

import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import { useRouter } from "next/router";
import {
  getEncounter,
  getReviewOfSystemsTemplateDefault,
} from "../../../../api";
import { Encounter } from "fhir/r4";
import { ReactElement, useState } from "react";
import { EncounterLayout } from "..";
import { Checkbox, Label } from "flowbite-react";
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/24/outline";
import {
  Control,
  Controller,
  useForm,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import TemplateForm from "../../../../components/template-form";
import { ITemplateFormInput } from "../../../../model";
import Button from "../../../../components/button";

const ReviewOfSystems: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control, watch } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const rosDefTempQuery = useSWR(`reviewOfSystemsDefault`, () =>
    getReviewOfSystemsTemplateDefault()
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const formInputs: ITemplateFormInput[] =
    rosDefTempQuery?.data?.data?.tree?.children?.map((e) => ({
      id: e?.id,
      title: e?.name,
      inputs: e?.children?.map((c) => ({
        id: c?.id,
        type: c?.annotations?.type,
        children: c?.children?.map((input) => ({
          id: input?.id,
          name: input?.name,
          type: input?.rmType,
        })),
      })),
    }));

  const values = watch();

  const onSubmit = (input: any) => {
    console.log("Input", input);
  };

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Review of Systems
      </p>

      <hr className="mt-3" />

      <div className="mt-2">
        <p>Template: {rosDefTempQuery?.data?.data?.tree?.name}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-y-3 gap-x-5">
          {formInputs?.map((e) => (
            <TemplateForm
              key={e?.id}
              formInput={e}
              control={control}
              register={register}
              values={values}
            />
          ))}
        </div>
      <div className="mt-5">
      <Button
            loading={isLoading}
            loadingText={"Saving"}
            type="submit"
            text="Save"
            icon="save"
            variant="filled"
            disabled={isLoading}
            onClick={() => null}
          />
      </div>
      </form>
    </div>
  );
};

ReviewOfSystems.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default ReviewOfSystems;
