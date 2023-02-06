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

import { Encounter, Procedure } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { ISelectOption } from "@tensoremr/models";
import useSWRMutation from "swr/mutation";
import {
  createProcedure,
  getEventStatus,
  getExtensions,
  getProcedure,
  getProcedureOutcomes,
  searchConceptChildren,
  updateProcedure,
} from "../../../../api";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Button from "../../../../components/button";
import CodedInput from "../../../../components/coded-input";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const SurgicalHistoryForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedProcedure, setSelectedProcedure] = useState<ISelectOption>();
  const [selectedReason, setSelectedReason] = useState<ISelectOption>();
  const [selectedBodySite, setSelectedBodySite] = useState<ISelectOption>();
  const [selectedComplication, setSelectedComplication] =
    useState<ISelectOption>();

  // Effects
  useEffect(() => {
    if (updateId) {
      setIsLoading(true);
      getProcedure(updateId)
        .then((res) => {
          setIsLoading(false);

          const procedure: Procedure = res?.data;

          const code = procedure?.code?.coding?.at(0);
          if (code) {
            setSelectedProcedure({ value: code.code, label: code.display });
          }

          const status = procedure?.status;
          if (status) {
            setValue("status", status);
          }

          const reason = procedure?.reasonCode?.at(0).coding?.at(0);
          if (reason) {
            setSelectedReason({ value: reason.code, label: reason.display });
          }

          const performedOn = procedure?.performedString;
          if (performedOn) {
            setValue("performedString", performedOn);
          }

          const bodySite = procedure?.bodySite?.at(0).coding?.at(0);
          if (bodySite) {
            setSelectedBodySite({
              value: bodySite.code,
              label: bodySite.display,
            });
          }

          const outcome = procedure?.outcome?.coding?.at(0);
          if (outcome) {
            setValue("outcome", outcome.code);
          }

          const complication = procedure?.complication?.at(0).coding?.at(0);
          if (complication) {
            setSelectedComplication({
              value: complication.code,
              label: complication.display,
            });
          }

          if (procedure?.note?.length > 0) {
            setValue("note", procedure?.note.map((n) => n.text).join(", "));
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            notifDispatch({
              type: "showNotification",
              notifTitle: "Error",
              notifSubTitle: error.message,
              variant: "failure",
            });
          }

          console.error(error);
          setIsLoading(false);
        });
    }
  }, [updateId]);

  // @ts-ignore
  const { data: session } = useSession();

  const createProcedureMu = useSWRMutation("procedures", (key, { arg }) =>
    createProcedure(arg)
  );

  const updateProcedureMu = useSWRMutation("procedures", (key, { arg }) =>
    updateProcedure(arg.id, arg.procedure)
  );

  const eventStatuses =
    useSWR("eventStatuses", () =>
      getEventStatus()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const procedureOutcomes =
    useSWR("procedureOutcomes", () =>
      getProcedureOutcomes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchSurgicalProcedureLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 71388002",
          limit: 20,
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
        });
      }
    }, 600),
    []
  );

  const searchReasonLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 404684003",
          limit: 20,
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
        });
      }
    }, 600),
    []
  );

  const searchBodySiteLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 442083009",
          limit: 20,
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
        });
      }
    }, 600),
    []
  );

  const searchComplicationLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 404684003",
          limit: 20,
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
        });
      }
    }, 600),
    []
  );

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const extensions = (await getExtensions()).data;

      const status = eventStatuses.find((e) => e.value === input.status);
      const outcome = procedureOutcomes.find((e) => e.value === input.outcome);

      const procedure: Procedure = {
        resourceType: "Procedure",
        id: updateId ? updateId : undefined,
        status: status.value ? status.value : undefined,
        category: {
          coding: [
            {
              code: "387713003",
              display: "Surgical procedure",
              system: "http://snomed.info/sct",
            },
          ],
          text: "problem-list-item",
        },
        code: selectedProcedure
          ? {
              coding: [
                {
                  code: selectedProcedure.value,
                  display: selectedProcedure.label,
                  system: "http://snomed.info/sct",
                },
              ],
              text: selectedProcedure.label,
            }
          : undefined,
        subject: encounter.subject,
        performedString:
          input.performedString.length > 0 ? input.performedString : undefined,
        reasonCode: selectedReason
          ? [
              {
                coding: [
                  {
                    code: selectedReason.value,
                    display: selectedReason.label,
                    system: "http://snomed.info/sct",
                  },
                ],
                text: selectedReason.label,
              },
            ]
          : undefined,
        complication: selectedComplication
          ? [
              {
                coding: [
                  {
                    code: selectedComplication.value,
                    display: selectedComplication.label,
                    system: "http://snomed.info/sct",
                  },
                ],
                text: selectedComplication.label,
              },
            ]
          : undefined,
        recorder: {
          // @ts-ignore
          reference: `Practitioner/${session.user?.id}`,
          type: "Practitioner",
        },
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        bodySite: selectedBodySite
          ? [
              {
                coding: [
                  {
                    code: selectedBodySite.value,
                    display: selectedBodySite.label,
                    system: "http://snomed.info/sct",
                  },
                ],
                text: selectedBodySite.label,
              },
            ]
          : undefined,
        outcome: outcome
          ? {
              coding: [
                {
                  code: outcome.value,
                  display: outcome.label,
                  system: outcome.system,
                },
              ],
              text: outcome.label,
            }
          : undefined,
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
            valueString: "surgical-history",
          },
        ],
      };

      if (updateId) {
        await updateProcedureMu.trigger({ id: updateId, procedure: procedure });
      } else {
        await createProcedureMu.trigger(procedure);
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
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Surgical History" : "Add Surgical History"}
      </p>

      <CodedInput
        title="Surgical Procedure"
        conceptId="71388002"
        selectedItem={selectedProcedure}
        setSelectedItem={setSelectedProcedure}
        searchOptions={searchSurgicalProcedureLoad}
      />

      <div className="mt-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          required
          {...register("status", { required: true })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {eventStatuses.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <CodedInput
        title="Reason"
        conceptId="404684003"
        selectedItem={selectedReason}
        setSelectedItem={setSelectedReason}
        searchOptions={searchReasonLoad}
      />

      <div className="mt-4">
        <label
          htmlFor="performedString"
          className="block font-medium text-gray-700"
        >
          Performed On
        </label>
        <input
          type="text"
          name="performedString"
          id="performedString"
          {...register("performedString")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <CodedInput
        title="Body Site"
        conceptId="442083009"
        selectedItem={selectedBodySite}
        setSelectedItem={setSelectedBodySite}
        searchOptions={searchBodySiteLoad}
      />

      <div className="mt-4">
        <label
          htmlFor="outcome"
          className="block text-sm font-medium text-gray-700"
        >
          Outcome
        </label>
        <select
          required
          {...register("outcome", { required: true })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {procedureOutcomes.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <CodedInput
        title="Complication"
        conceptId="404684003"
        selectedItem={selectedComplication}
        setSelectedItem={setSelectedComplication}
        searchOptions={searchComplicationLoad}
      />

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="note" className="block font-medium text-gray-700">
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
        <div className="flex space-x-6">
          <div className="text-gray-700">Source of Info</div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="illnessType"
              value={"Natural Illness"}
              defaultChecked={true}
            />
            <span className="ml-2">Patient Reported</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="illnessType"
              value={"Industrial Accident"}
            />
            <span className="ml-2">External</span>
          </label>
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
};

export default SurgicalHistoryForm;
