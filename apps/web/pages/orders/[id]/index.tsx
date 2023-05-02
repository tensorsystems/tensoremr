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

import { useRouter } from "next/router";
import { useState } from "react";
import MyBreadcrumb, { IBreadcrumb } from "../../../components/breadcrumb";
import useSWR from "swr";
import {
  APP_SERVER_URL,
  FHIR_URL,
  getEncounter,
  getExtensions,
  getPatient,
  getServiceRequest,
} from "../../../api";
import { Encounter, Patient, ServiceRequest } from "fhir/r4";
import { parsePatientName } from "../../../util/fhir";
import FhirPractitionerName from "../../../components/fhir-practitioner-name";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

export default function OrdersPage() {
  const router = useRouter();
  const { id } = router.query;
  const session: any = useSessionContext();

  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    {
      href: "/diagnostic-procedures",
      title: "Orders",
      icon: "airline_seat_recline_normal",
    },
  ]);

  const serviceRequestQuery = useSWR(`serviceRequests/${id}`, () =>
    getServiceRequest(id as string)
  );

  const serviceRequest: ServiceRequest | undefined =
    serviceRequestQuery?.data?.data;
  const encounterId = serviceRequest?.encounter?.reference?.split("/")[1];
  const patientId = serviceRequest?.subject?.reference?.split("/")[1];

  const encounterQuery = useSWR(
    encounterId ? `encounters/${encounterId}` : null,
    () => getEncounter(encounterId)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  const patientQuery = useSWR(patientId ? `patients/${patientId}` : null, () =>
    getPatient(patientId)
  );

  const patient: Patient | undefined = patientQuery?.data?.data;

  const extensions = useSWR(`extension`, () => getExtensions());
  const formExt = serviceRequest?.extension?.find(
    (e) => e.url === extensions?.data?.data?.EXT_ORDER_FORM
  );

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   if (window.LForms && !questionnaireQuery.isLoading) {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     const formExists = window.LForms.Util.getFormData();
  //     if (!formExists) {
  //       const questionnaireBundle: Bundle = questionnaireQuery?.data?.data;
  //       const questionnaire = questionnaireBundle?.entry?.at(0)?.resource;
  //       if (questionnaire) {
  //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //         // @ts-ignore
  //         window.LForms.Util.addFormToPage(
  //           questionnaire,
  //           "myFormContainer",
  //           {}
  //         );
  //       }
  //     }
  //   }
  // }, [questionnaireQuery]);

  
  return (
    <div className="h-full mb-10">
      <MyBreadcrumb crumbs={crumbs} />

      <div className="mt-4 grid grid-cols-3 bg-amber-100 rounded-md shadow-lg p-3 text-sm">
        <div>
          <OrderDetailItem
            title={"Patient"}
            value={parsePatientName(patient)}
            valueSelectable={true}
          />
        </div>
        <div>
          <OrderDetailItem
            title={"Type"}
            value={serviceRequest?.category?.at(0)?.text}
          />
        </div>
        <div>
          <OrderDetailItem
            title={"Procedure"}
            value={serviceRequest?.code?.text}
          />
        </div>
        <div>
          <OrderDetailItem
            title={"Body Site"}
            value={serviceRequest?.bodySite?.map((e) => e.text).join(", ")}
          />
        </div>
        <div>
          <OrderDetailItem title={"Status"} value={serviceRequest?.status} />
        </div>
        <div>
          <OrderDetailItem
            title={"Priority"}
            value={serviceRequest?.priority}
          />
        </div>
        <div>
          <OrderDetailItem
            title={"Ordered By"}
            value={
              serviceRequest?.requester?.reference && (
                <FhirPractitionerName
                  practitionerId={
                    serviceRequest?.requester?.reference?.split("/")[1]
                  }
                />
              )
            }
          />
        </div>

        <div>
          <OrderDetailItem
            title={"Note"}
            value={serviceRequest?.note?.map((e) => e.text).join(", ")}
          />
        </div>
      </div>

      <div className="mt-4">
        {formExt?.valueCoding?.code && serviceRequest?.id && (
          <div
            style={{
              overflow: "scroll",
              paddingTop: "56.25%",
              position: "relative",
            }}
          >
            <iframe
              src={`http://localhost:4201?fhirUrl=${FHIR_URL}&orderId=${serviceRequest?.id}&q=${`${APP_SERVER_URL}/questionnaire/loinc/${formExt?.valueCoding?.code}`}&userId=${session?.userId}`}
              style={{
                border: 0,
                height: "100%",
                left: 0,
                position: "absolute",
                top: 0,
                width: "100%",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface OrderDetailItemProps {
  title: string;
  value: string | JSX.Element;
  valueSelectable?: boolean;
}

function OrderDetailItem({
  title,
  value,
  valueSelectable,
}: OrderDetailItemProps) {
  return (
    <div className="flex space-x-2">
      <div className="font-semibold text-gray-800">{title}:</div>
      <div
        className={` text-gray-600 ${
          valueSelectable && "text-sky-700 underline cursor-pointer"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
