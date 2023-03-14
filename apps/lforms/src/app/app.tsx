/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpOnSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import "./app.css";
import { QuestionnaireResponse, ServiceRequest } from "fhir/r4";
import { Spinner } from "flowbite-react";

export function App() {
  const ref = useRef(null);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest>();
  const [updateId, setUpdateId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const q = getQueryVariable("q");
  const orderId = getQueryVariable("orderId");
  const userId = getQueryVariable("userId");
  const fhirUrl = getQueryVariable("fhirUrl");

  useEffect(() => {
    if (q && orderId) {
      init(q, `${fhirUrl}/ServiceRequest/${orderId}`);
    }
  }, [q, orderId]);

  const init = async (questionnaireUrl: string, orderUrl: string) => {
    setIsLoading(true);

    try {
      // Fetch questionnaire
      const questionnaire = await (await fetch(questionnaireUrl)).json();

      const existingResponse = await (
        await fetch(`${fhirUrl}/QuestionnaireResponse?based-on=${orderId}`)
      ).json();

      // @ts-ignore
      if (questionnaire && window.LForms) {
        if (existingResponse?.total > 0) {
          const questionnaireResponse: QuestionnaireResponse =
            existingResponse?.entry
              ?.map((e: any) => e.resource as QuestionnaireResponse)
              ?.at(0);
          if (questionnaireResponse) {
            const lform =
              // @ts-ignore
              window.LForms.Util.convertFHIRQuestionnaireToLForms(
                questionnaire
              );

            // @ts-ignore
            const result = window.LForms.Util.mergeFHIRDataIntoLForms(
              "QuestionnaireResponse",
              questionnaireResponse,
              lform,
              "R4"
            );

            // @ts-ignore
            window.LForms.Util.addFormToPage(result, "myFormContainer", {});

            setUpdateId(questionnaireResponse.id);
          }
        } else {
          // @ts-ignore
          window.LForms.Util.addFormToPage(
            questionnaire,
            "myFormContainer",
            {}
          );
        }
      }

      // Fetch orders
      const order = await (await fetch(orderUrl)).json();
      if (order) {
        setServiceRequest(order);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong. Try reloading");
      }
    }

    setIsLoading(false);
  };

  const onSave = async () => {
    if (!window.confirm("Are you sure you want to save?")) {
      return;
    }

    setIsSaving(true);

    try {
      const questionnaireResponse: QuestionnaireResponse =
        // @ts-ignore
        window.LForms.Util.getFormFHIRData(
          "QuestionnaireResponse",
          "R4",
          ref.current,
          null
        );

      questionnaireResponse.id = updateId ? updateId : undefined;
      questionnaireResponse.subject = serviceRequest?.subject;
      questionnaireResponse.questionnaire = q as string;
      questionnaireResponse.encounter = serviceRequest?.encounter;
      questionnaireResponse.status = "in-progress";
      questionnaireResponse.basedOn = [
        {
          reference: `ServiceRequest/${orderId}`,
          type: "ServiceRequest",
        },
      ];
      questionnaireResponse.author = {
        reference: `Practitioner/${userId}`,
        type: "Practitioner",
      };

      const response = updateId
        ? await fetch(`${fhirUrl}/QuestionnaireResponse/${updateId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify(questionnaireResponse),
          })
        : await fetch(`${fhirUrl}/QuestionnaireResponse`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify(questionnaireResponse),
          });

      if (response.status !== 200 && response.status !== 201) {
        alert(`Couldn't save response. ${response.statusText}`);
      } else {
        alert("Results saved successfully");
        const r = await response.json();
        setUpdateId(r.id);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong. Try again");
      }
    }
    setIsSaving(false);
  };

  const onMarkAsComplete = async () => {
    if (!updateId) {
      alert("No results found");
      return;
    }

    if (!window.confirm("Are you sure you want mark this as complete?")) {
      return;
    }

    setIsSaving(true);

    try {
      if (serviceRequest) {
        serviceRequest.status = "completed";

        await fetch(`${fhirUrl}/ServiceRequest/${serviceRequest.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceRequest),
        });
      }

      const existingResponse = await (
        await fetch(`${fhirUrl}/QuestionnaireResponse?based-on=${orderId}`)
      ).json();

      const questionnareResponse: QuestionnaireResponse =
        existingResponse?.entry
          ?.map((e: any) => e.resource as QuestionnaireResponse)
          ?.at(0);

      questionnareResponse.status = "completed";
      await fetch(`${fhirUrl}/QuestionnaireResponse/${updateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionnareResponse),
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong. Try again");
      }
    }

    setIsSaving(false);
  };

  return (
    <div className="p-4">
      {isLoading && (
        <div className="h-36 flex items-center justify-center">
          <Spinner color="warning" aria-label="Button loading" />
        </div>
      )}
      <div ref={ref} id="myFormContainer"></div>
      <div hidden={isLoading} className="mt-4 flex space-x-3 px-2">
        <div className="flex-1">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="w-full py-2 rounded-md shadow-md bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br text-white focus:ring-4 focus:outline-none focus:ring-teal-300 font-semibold flex items-start justify-center space-x-2"
          >
            {isSaving ? (
              <Spinner color="warning" aria-label="Button loading" />
            ) : (
              <ArrowUpOnSquareIcon className="w-5 h-5" />
            )}
            <span>Save</span>
          </button>
        </div>
        <div className="flex-1">
          {serviceRequest?.status === "completed" ? (
            <div className="flex justify-center items-center space-x-2 text-green-600">
              <CheckBadgeIcon className="w-5 h-5" />
              <span className="text-lg text-center">Marked as complete</span>
            </div>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={onMarkAsComplete}
              className="w-full py-2 rounded-md shadow-md border-2 border-teal-400 focus:ring-4 focus:outline-none hover:from-green-400 hover:via-green-500 hover:to-green-600 hover:bg-gradient-to-br hover:text-white focus:ring-teal-300 text-teal-500 flex items-start justify-center space-x-2"
            >
              {isSaving ? (
                <Spinner color="warning" aria-label="Button loading" />
              ) : (
                <CheckBadgeIcon className="w-5 h-5" />
              )}

              <span>Mark as Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

export default App;
