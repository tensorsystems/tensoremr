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

import { Condition, Encounter, EncounterDiagnosis, Extension } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { ISelectOption } from "@tensoremr/models";
import CodedInput from "../../../../components/coded-input";
import { debounce } from "lodash";
import {
  createCondition,
  getCondition,
  getExtensions,
  getServerTime,
  searchConceptChildren,
  updateEncounter,
} from "../../../../api";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";
import { useSession } from "../../../../context/SessionProvider";
import { getUserIdFromSession } from "../../../../util/ory";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const ChiefComplaintForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ISelectOption>();

  // Effects
  useEffect(() => {
    if (updateId) {
      fetchUpdateDetails(updateId);
    }
  }, [updateId]);

  const fetchUpdateDetails = async (updateId: string) => {
    setIsLoading(true);

    try {
      const extensions = (await getExtensions()).data;

      const chiefComplaint: EncounterDiagnosis = encounter?.diagnosis?.find(
        (e) => e.condition.reference === `Condition/${updateId}`
      );

      const condition: Condition = (await getCondition(updateId)).data;

      const conditionCode = condition.code?.coding?.at(0);
      if (conditionCode) {
        setSelectedComplaint({
          value: conditionCode.code,
          label: conditionCode.display,
        });
      }

      const location = chiefComplaint?.extension?.find(
        (ext) => ext.url === extensions.EXT_HPI_LOCATION
      );
      if (location) {
        setValue("location", location.valueString);
      }

      const severity = chiefComplaint?.extension?.find(
        (ext) => ext.url === extensions.EXT_HPI_SEVERITY
      );
      if (severity) {
        setValue("severity", severity.valueString);
      }

      const duration = chiefComplaint?.extension?.find(
        (ext) => ext.url === extensions.EXT_HPI_DURATION
      );
      if (duration) {
        setValue("duration", duration.valueString);
      }

      const timing = chiefComplaint?.extension?.find(
        (ext) => ext.url === extensions.EXT_HPI_TIMING
      );
      if (timing) {
        setValue("timing", timing.valueString);
      }

      const context = chiefComplaint?.extension?.find(
        (ext) => ext.url === extensions.EXT_HPI_CONTEXT
      );
      if (context) {
        setValue("context", context.valueString);
      }

      const modifyingFactors = chiefComplaint?.extension?.find(
        (ext) => ext.url === extensions.EXT_HPI_MODIFYING_FACTORS
      );
      if (context) {
        setValue("modifyingFactors", modifyingFactors.valueString);
      }

      const signsSymptoms = chiefComplaint?.extension?.find(
        (ext) => ext.url === extensions.EXT_HPI_SIGNS_SYMPTOMS
      );
      if (context) {
        setValue("signsSymptoms", signsSymptoms.valueString);
      }
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

  const { session } = useSession();

  const createConditionMu = useSWRMutation("conditions", (key, { arg }) =>
    createCondition(arg)
  );

  const updateEncounterMu = useSWRMutation(
    `encounters/${encounter.id}`,
    (key, { arg }) => updateEncounter(arg.id, arg.encounter)
  );

  const searchComplaints = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 404684003",
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

      const userId = session ? getUserIdFromSession(session) : "";
      
      let conditionId;
      if (updateId) {
        conditionId = updateId;
      } else {
        const condition: Condition = {
          resourceType: "Condition",
          subject: encounter.subject,
          recordedDate: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
          recorder: {
            // @ts-ignore
            reference: `Practitioner/${userId}`,
            type: "Practitioner",
          },
          code: selectedComplaint
            ? {
                coding: [
                  {
                    code: selectedComplaint.value,
                    display: selectedComplaint.label,
                    system: "http://snomed.info/sct",
                  },
                ],
                text: selectedComplaint.label,
              }
            : undefined,
        };

        const conditionResult = await createConditionMu.trigger(condition);
        conditionId = conditionResult?.data?.id;
      }

      const hpi: Extension[] = [];
      if (input.location.length > 0) {
        hpi.push({
          url: extensions.EXT_HPI_LOCATION,
          valueString: input.location,
        });
      }

      if (input.severity.length > 0) {
        hpi.push({
          url: extensions.EXT_HPI_SEVERITY,
          valueString: input.severity,
        });
      }

      if (input.duration.length > 0) {
        hpi.push({
          url: extensions.EXT_HPI_DURATION,
          valueString: input.duration,
        });
      }

      if (input.timing.length > 0) {
        hpi.push({
          url: extensions.EXT_HPI_TIMING,
          valueString: input.timing,
        });
      }

      if (input.context.length > 0) {
        hpi.push({
          url: extensions.EXT_HPI_CONTEXT,
          valueString: input.context,
        });
      }

      if (input.modifyingFactors.length > 0) {
        hpi.push({
          url: extensions.EXT_HPI_MODIFYING_FACTORS,
          valueString: input.modifyingFactors,
        });
      }

      if (input.signsSymptoms.length > 0) {
        hpi.push({
          url: extensions.EXT_HPI_SIGNS_SYMPTOMS,
          valueString: input.signsSymptoms,
        });
      }

      const diagnosis: EncounterDiagnosis = {
        condition: {
          reference: `Condition/${conditionId}`,
          type: "Condition",
        },
        use: {
          coding: [
            {
              code: "CC",
              display: "Chief complaint",
              system: "http://terminology.hl7.org/CodeSystem/diagnosis-role",
            },
          ],
          text: "Chief complaint",
        },
        extension: hpi,
      };

      if (updateId) {
        const d = encounter?.diagnosis?.filter(
          (e) => e.condition.reference !== `Condition/${updateId}`
        );
        encounter.diagnosis = d.concat(diagnosis);
        await updateEncounterMu.trigger({ id: encounter.id, encounter });
        onSuccess();
      } else {
        encounter.diagnosis =
          encounter.diagnosis?.length > 0
            ? encounter.diagnosis.concat(diagnosis)
            : [diagnosis];

        await updateEncounterMu.trigger({ id: encounter.id, encounter });
        onSuccess();
      }
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
        {updateId ? "Update Chief Complaint" : "Add Chief Complaint"}
      </p>

      <CodedInput
        title="Complaint"
        conceptId="404684003"
        selectedItem={selectedComplaint}
        setSelectedItem={setSelectedComplaint}
        searchOptions={searchComplaints}
      />

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="location" className="block text-gray-700">
            Location
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="location"
          id="location"
          {...register("location")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="severity" className="block text-gray-700">
            Severity
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="severity"
          id="severity"
          {...register("severity")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="duration" className="block text-gray-700">
            Duration
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="duration"
          id="duration"
          {...register("duration")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="timing" className="block text-gray-700">
            Timing
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="timing"
          id="timing"
          {...register("timing")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="context" className="block text-gray-700">
            Context
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="context"
          id="context"
          {...register("context")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="modifyingFactors" className="block text-gray-700">
            Modifying Factors
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="modifyingFactors"
          id="modifyingFactors"
          {...register("modifyingFactors")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="signsSymptoms" className="block text-gray-700">
            Signs & Symptoms
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="signsSymptoms"
          id="signsSymptoms"
          {...register("signsSymptoms")}
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
    </form>
  );
};

export default ChiefComplaintForm;
