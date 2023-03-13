/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpOnSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import "./app.css";
import { fetch } from "./api";
import useSWR from "swr";
import { ServiceRequest } from "fhir/r4";
import { Spinner } from "flowbite-react";

export function App() {
  const ref = useRef(null);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const q = getQueryVariable("q");
  const o = getQueryVariable("o");

  useEffect(() => {
    if (q && o) {
      fetchUrls(q, o);
    }
  }, [q, o]);

  const fetchUrls = async (questionnaireUrl: string, orderUrl: string) => {
    setIsLoading(true);

    try {
      // Fetch questionnaire
      const questionnaire = (await fetch(questionnaireUrl))?.data;
      // @ts-ignore
      if (questionnaire && window.LForms) {
        // @ts-ignore
        window.LForms.Util.addFormToPage(questionnaire, "myFormContainer", {});
      }

      // Fetch orders
      const order = (await fetch(orderUrl))?.data;
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
          <button className="w-full py-2 rounded-md shadow-md bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br text-white focus:ring-4 focus:outline-none focus:ring-teal-300 font-semibold flex items-start justify-center space-x-2">
            <ArrowUpOnSquareIcon className="w-5 h-5" />
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
            <button className="w-full py-2 rounded-md shadow-md border-2 border-teal-400 focus:ring-4 focus:outline-none hover:from-green-400 hover:via-green-500 hover:to-green-600 hover:bg-gradient-to-br hover:text-white focus:ring-teal-300 text-teal-500 flex items-start justify-center space-x-2">
              <CheckBadgeIcon className="w-5 h-5" />
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
