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

import { AllergyIntolerance, Encounter } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  createAllergyIntolerance,
  getAllergyIntolerance,
  getAllergyIntoleranceCategories,
  getAllergyIntoleranceCriticalities,
  getAllergyIntoleranceStatuses,
  getAllergyIntoleranceTypes,
  getAllergyIntoleranceVerStatuses,
  getExtensions,
  getServerTime,
  searchConceptChildren,
  updateAllergyIntolerance,
} from "../../../../api";
import Select from "react-select";
import CodedInput from "../../../../components/coded-input";
import { debounce } from "lodash";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const AllergyIntoleranceForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);


  // Effect
  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);
    const allergyIntolerance: AllergyIntolerance = (
      await getAllergyIntolerance(updateId)
    )?.data;

    const type = allergyIntolerance?.type;
    if (type) {
      const typeOptions =
        (await getAllergyIntoleranceTypes()).data?.expansion?.contains.map(
          (e) => ({
            value: e.code,
            label: e.display,
            system: e.system,
          })
        ) ?? [];
      setValue(
        "type",
        typeOptions.find((s) => s.value === type)
      );
    }

    const code = allergyIntolerance.code?.coding?.at(0);
    if (code) {
      setValue("code", {
        label: code.display,
        value: code.code,
        system: code.system,
      });
    }

    const clinicalStatus = allergyIntolerance.clinicalStatus?.coding?.at(0);
    if (clinicalStatus) {
      setValue("clinicalStatus", {
        label: clinicalStatus.display,
        value: clinicalStatus.code,
        system: clinicalStatus.system,
      });
    }

    const verificationStatus =
      allergyIntolerance.verificationStatus?.coding?.at(0);
    if (verificationStatus) {
      setValue("verificationStatus", {
        label: verificationStatus.display,
        value: verificationStatus.code,
        system: verificationStatus.system,
      });
    }

    const category = allergyIntolerance?.category?.at(0);
    if (category) {
      const categoryOptions =
        (await getAllergyIntoleranceCategories()).data?.expansion?.contains.map(
          (e) => ({
            value: e.code,
            label: e.display,
            system: e.system,
          })
        ) ?? [];
      setValue(
        "category",
        categoryOptions.find((s) => s.value === category)
      );
    }

    const criticality = allergyIntolerance?.criticality;
    if (criticality) {
      const criticalityOptions =
        (
          await getAllergyIntoleranceCriticalities()
        ).data?.expansion?.contains.map((e) => ({
          value: e.code,
          label: e.display,
          system: e.system,
        })) ?? [];
      setValue(
        "criticality",
        criticalityOptions.find((s) => s.value === criticality)
      );
    }

    const note = allergyIntolerance?.note;
    if (note?.length > 0) {
      setValue("note", note.map((n) => n.text).join(", "));
    }

    setIsLoading(false);
  };

  const createAllergyIntoleranceMu = useSWRMutation(
    "allergyIntolerance",
    (key, { arg }) => createAllergyIntolerance(arg)
  );

  const updateAllergyIntoleranceMu = useSWRMutation(
    "allergyIntolerance",
    (key, { arg }) => updateAllergyIntolerance(arg.id, arg.allergyIntolerance)
  );

  const types =
    useSWR("types", () =>
      getAllergyIntoleranceTypes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const statuses =
    useSWR("statuses", () =>
      getAllergyIntoleranceStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const verStatuses =
    useSWR("verificationStatuses", () =>
      getAllergyIntoleranceVerStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const categories =
    useSWR("categories", () =>
      getAllergyIntoleranceCategories()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const criticalities =
    useSWR("criticalities", () =>
      getAllergyIntoleranceCriticalities()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchAllergyIntoleranceLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 420134006 AND << 473010000",
          limit: 20,
        })
          .then((resp) => {
            const values = resp.data?.items?.map((e) => ({
              value: e.id,
              label: e?.pt?.term,
            }));

            if (values) {
              callback(values);
            }
          })
          .catch((error) => {
            notifDispatch({
              type: "showNotification",
              notifTitle: "Error",
              notifSubTitle: error.message,
              variant: "failure",
            });

            console.error(error);
          });
      }
    }, 600),
    []
  );

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const time = (await getServerTime()).data;
      const extensions = (await getExtensions()).data;

      const allergyIntolerance: AllergyIntolerance = {
        resourceType: "AllergyIntolerance",
        id: updateId ? updateId : undefined,
        clinicalStatus: input.clinicalStatus
          ? {
              coding: [
                {
                  code: input.clinicalStatus.value,
                  display: input.clinicalStatus.label,
                  system: input.clinicalStatus.system,
                },
              ],
              text: input.clinicalStatus.label,
            }
          : undefined,
        verificationStatus: input.verificationStatus
          ? {
              coding: [
                {
                  code: input.verificationStatus.value,
                  display: input.verificationStatus.label,
                  system: input.verificationStatus.system,
                },
              ],
              text: input.verificationStatus.label,
            }
          : undefined,
        type: input.type ? input.type.value : undefined,
        category: input.category ? [input.category.value] : undefined,
        criticality: input.criticality ? input.criticality.value : undefined,
        code: input.code
          ? {
              coding: [
                {
                  code: input.code.value,
                  display: input.code.label,
                  system: "http://snomed.info/sct",
                },
              ],
              text: input.code.label,
            }
          : undefined,
        patient: encounter.subject,
        recordedDate: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        recorder: {
          // @ts-ignore
          reference: `Practitioner/${session.user?.id}`,
          type: "Practitioner",
        },
        note:
          input.note.length > 0
            ? [
                {
                  text: input.note,
                },
              ]
            : undefined,
        extension: [
          {
            url: extensions.EXT_CONDITION_TYPE,
            valueString: "allergy-intolerance-history",
          },
        ],
      };

      if (updateId) {
        await updateAllergyIntoleranceMu.trigger({
          id: updateId,
          allergyIntolerance: allergyIntolerance,
        });
      } else {
        await createAllergyIntoleranceMu.trigger(allergyIntolerance);
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
    <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Allergy/Intolerance" : "Add Allergy/Intolerance"}
      </p>

      <div className="mt-4">
        <label className="block text-gray-700">Type</label>

        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={types}
              placeholder="Site"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Allergy/Intolerance"
              conceptId="420134006"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchAllergyIntoleranceLoad}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Status</label>

        <Controller
          name="clinicalStatus"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={statuses}
              placeholder="Status"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Verification</label>

        <Controller
          name="verificationStatus"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={verStatuses}
              placeholder="Verification"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Category</label>

        <Controller
          name="category"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={categories}
              placeholder="Category"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Criticality</label>

        <Controller
          name="criticality"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={criticalities}
              placeholder="Criticality"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />

        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="note" className="block text-gray-700">
              Free Text Note
            </label>

            <Tooltip content="This field is not coded. Decision support and interactions will not be active">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
            </Tooltip>
          </div>
          <input
            type="text"
            name="note"
            id="note"
            {...register("note")}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
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
      </div>
    </form>
  );
};

export default AllergyIntoleranceForm;
