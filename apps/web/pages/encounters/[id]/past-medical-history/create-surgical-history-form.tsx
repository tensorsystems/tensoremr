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

import { Encounter } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { ISelectOption } from "@tensoremr/models";
import useSWRMutation from "swr/mutation";
import { createCondition, searchConceptChildren } from "../../../../api";
import AsyncSelect from "react-select/async";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { Transition } from "@headlessui/react";
import { ConceptBrowser } from "../../../../components/concept-browser";
import Button from "../../../../components/button";
import CodedInput from "../../../../components/coded-input";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
  encounter: Encounter;
  onSuccess: () => void;
}

export const CreateSurgicalHistoryForm: React.FC<Props> = ({
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedProcedure, setSelectedProcedure] = useState<ISelectOption>();
  const [selectedReason, setSelectedReason] = useState<ISelectOption>();
  const [selectedBodySite, setSelectedBodySite] = useState<ISelectOption>();
  const [selectedComplication, setSelectedComplication] =
    useState<ISelectOption>();

  // @ts-ignore
  const { data: session } = useSession();

  const { trigger } = useSWRMutation("conditions", (key, { arg }) =>
    createCondition(arg)
  );

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
    console.log("Input", input);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
          Add Surgical History
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
            {...(register("status"), { required: true })}
            className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option></option>
            <option value="preparation">Preparation</option>
            <option value="in-progress">In Progress</option>
            <option value="note-done">Not Done</option>
            <option value="on-hold">On Hold</option>
            <option value="stopped">Stopped</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mt-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            required
            {...(register("category"), { required: true })}
            className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option></option>
            <option value="24642003">Psychiatry procedure or service</option>
            <option value="409063005">Counseling</option>
            <option value="409073007">Education</option>
            <option value="387713003">Surgical procedure</option>
            <option value="103693007">Diagnostic procedure</option>
            <option value="46947000">Chiropractic manipulation</option>
            <option value="410606002">Social service procedure</option>
          </select>
        </div>

        <CodedInput
          title="Reason"
          conceptId="404684003"
          selectedItem={selectedReason}
          setSelectedItem={setSelectedReason}
          searchOptions={searchReasonLoad}
        />

        <div className="flex space-x-5 mt-4">
          <div className="flex-1">
            <label
              htmlFor="performedDateTime"
              className="block font-medium text-gray-700"
            >
              Performed On
            </label>
            <input
              type="datetime-local"
              name="performedDateTime"
              id="performedDateTime"
              {...register("performedDateTime")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="performedAge"
              className="block font-medium text-gray-700"
            >
              Performed On Age
            </label>
            <input
              type="number"
              name="performedAge"
              id="performedAge"
              {...register("performedAge")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="performedString"
            className="block font-medium text-gray-700"
          >
            Performed On Note
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
            {...(register("outcome"), { required: true })}
            className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option></option>
            <option value="385669000">Successful</option>
            <option value="385671000">Unsuccessful</option>
            <option value="385670004">Partially successful</option>
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
          text="Save"
          icon="save"
          variant="filled"
          disabled={isLoading}
        />
      </form>
    </div>
  );
};
