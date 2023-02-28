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

import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  getAllUsers,
  getCareTeam,
  getCareTeamStatuses,
  updateCareTeam,
} from "../../api";
import Select from "react-select";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "../../components/button";
import { CareTeam } from "fhir/r4";
import useSWRMutation from "swr/mutation";
import { createCareTeam } from "../../api";

interface Props {
  updateId?: string;
  onCancel: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function CareTeamForm({
  updateId,
  onSuccess,
  onCancel,
  onError,
}: Props) {
  const { register, handleSubmit, control, setValue } = useForm<any>({
    defaultValues: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Array<any>>([{}]);

  const careTeamStatusesQuery = useSWR("careTeamStatuses", () =>
    getCareTeamStatuses()
  );
  const careTeamStatuses =
    careTeamStatusesQuery?.data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const createCareTeamMu = useSWRMutation("careTeams", (key, { arg }) =>
    createCareTeam(arg)
  );

  const updateCareTeamMu = useSWRMutation("careTeams", (key, { arg }) =>
    updateCareTeam(arg.id, arg.careTeam)
  );

  useEffect(() => {
    if (updateId) {
      updateValues(updateId);
    }
  }, [updateId]);

  const updateValues = async (updateId: string) => {
    setIsLoading(true);

    const careTeam: CareTeam = (await getCareTeam(updateId))?.data;

    if (careTeam.name) {
      setValue("name", careTeam.name);
    }

    const status = (
      await getCareTeamStatuses()
    )?.data.expansion?.contains?.find((e) => e.code === careTeam.status);

    if (status) {
      setValue("status", {
        value: status.code,
        label: status.display,
        system: status.system,
      });
    }

    if (careTeam.category) {
      setValue("category", {
        value: careTeam.category?.at(0)?.coding?.at(0)?.code,
        label: careTeam.category?.at(0)?.coding?.at(0)?.display,
        system: careTeam.category?.at(0)?.coding?.at(0)?.system,
      });
    }

    if (careTeam.note) {
      setValue("note", careTeam?.note?.at(0).text);
    }

    if (careTeam.participant) {
      const participants: any[] = [];

      careTeam.participant.forEach((e) => {
        const userValue = e?.member?.reference?.split("/")[1];
        const userLabel = e?.member?.display;
        const roleValue = e?.role?.at(0)?.text;

        participants.push({
          userValue,
          userLabel,
          roleValue,
        });
      });

      setParticipants(participants);
    }

    setIsLoading(false);
  };

  const onSubmit = async (input: any) => {
    setIsLoading(true);
    try {
      const careTeam: CareTeam = {
        resourceType: "CareTeam",
        id: updateId ? updateId : undefined,
        name: input.name?.length > 0 ? input.name : undefined,
        status: input.status ? input.status.value : undefined,
        category: input.category
          ? [
              {
                coding: [
                  {
                    code: input.category.value,
                    display: input.category.label,
                  },
                ],
                text: input.category.label,
              },
            ]
          : undefined,
        participant: participants?.map((e) => ({
          member: {
            reference: `Practitioner/${e.userValue}`,
            type: "Practitioner",
            display: e.userLabel,
          },
          role: e.roleValue
            ? [
                {
                  text: e.roleValue,
                },
              ]
            : undefined,
        })),
        note:
          input.note?.length > 0
            ? [
                {
                  text: input.note,
                },
              ]
            : undefined,
      };

      if (updateId) {
        await updateCareTeamMu.trigger({ id: updateId, careTeam });
      } else {
        await createCareTeamMu.trigger(careTeam);
      }

      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      }

      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="my-10 pb-10 mx-8">
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <p className="text-xl font-extrabold text-teal-800">New Care Team</p>

        <div className="mt-4">
          <label htmlFor="name" className="block text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: true })}
            placeholder="Name"
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                ref={ref}
                value={value}
                options={careTeamStatuses}
                placeholder="Status"
                className="mt-1"
                onChange={onChange}
              />
            )}
            rules={{ required: true }}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Category</label>
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                ref={ref}
                value={value}
                options={careTeamCategories}
                placeholder="Category"
                className="mt-1"
                onChange={onChange}
              />
            )}
            rules={{ required: true }}
          />
        </div>

        <div className="mt-4">
          {participants.map((e, i) => (
            <div key={i} className="flex items-center space-x-4 mt-2">
              <div className="flex-1">
                <label htmlFor="name" className="block text-gray-700">
                  Participants
                </label>
                <Select
                  isClearable
                  options={practitioners}
                  placeholder="Participant"
                  className="mt-1"
                  value={{
                    value: participants[i].userValue,
                    label: participants[i].userLabel,
                  }}
                  onChange={(evt) => {
                    const p = participants.map((p, index) => {
                      if (i === index) {
                        return {
                          ...p,
                          userValue: evt.value,
                          userLabel: evt.label,
                        };
                      }

                      return p;
                    });
                    setParticipants(p);
                  }}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="name" className="block text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={participants[i].roleValue ?? ""}
                  className="mt-1 py-[6px] pl-4 block w-full sm:text-md border-gray-300 border rounded-sm"
                  onChange={(evt) => {
                    const p = participants.map((p, index) => {
                      if (i === index) {
                        return {
                          ...p,
                          roleValue: evt.target.value,
                        };
                      }

                      return p;
                    });
                    setParticipants(p);
                  }}
                />
              </div>
              <div hidden={i !== participants.length - 1}>
                <button
                  type="button"
                  onClick={() => setParticipants([...participants, {}])}
                >
                  <PlusIcon className="w-8 h-8 mt-6 text-green-600" />
                </button>
              </div>
              <div className="w-8" hidden={i === participants.length - 1}></div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label htmlFor="name" className="block text-gray-700">
            Note
          </label>
          <input
            type="text"
            id="note"
            {...register("note")}
            placeholder="note"
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>
        <div className="mt-4 bg-gray-50 text-right">
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
}

const careTeamCategories = [
  {
    value: "LA27975-4",
    label: "Event-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA27977-0",
    label: "Episode of care-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA27978-8",
    label: "Condition-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA28865-6",
    label: "Longitudinal care-coordination focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA28866-4",
    label: "Home & Community Based Services (HCBS)-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA27980-4",
    label: "Clinical research-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA28867-2",
    label: "Public health-focused care team",
    system: "http://loinc.org",
  },
];
