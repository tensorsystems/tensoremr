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
import React, { useEffect, useState } from "react";
import { getPatient } from "../../_api";
import useSWR from "swr";
import { Patient } from "fhir/r4";
import { PatientBasicInfo } from "./patient-basic-info";
import { Breadcrumb, Tabs } from "flowbite-react";
import {
  ClockIcon,
  PhoneIcon,
  UserIcon,
  PaperClipIcon,
  MapIcon,
} from "@heroicons/react/solid";
import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import PatientAppointments from "./patient-appointments";

export default function PatientRoute() {
  const router = useRouter();
  const { id } = router.query;
  const [crumbs, setCrumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/patients", title: "Patients", icon: "group" },
  ]);

  const query = useSWR(`patients/${id}`, () => getPatient(id as string));

  const handleEditClick = () => {
    //history.push(`/new-patient?mrn=${patientQuery.data?.mrn}`);
  };

  const patientData: Patient = query.data?.data;

  useEffect(() => {
    if (patientData?.name) {
      const name =
        patientData?.name
          .map((e) => `${e.given.join(", ")} ${e.family}`)
          .join(", ") ?? "";

      const exists = crumbs.find((e) => e.title === name);

      if (name.length > 0 && !exists) {
        setCrumbs([
          ...crumbs,
          { href: `/patients/${patientData.id}`, title: name, icon: "person" },
        ]);
      }
    }
  }, [patientData]);

  return (
    <div className="h-screen">
      <MyBreadcrumb crumbs={crumbs} />

      <PatientBasicInfo
        patient={{
          id: patientData?.id,
          mrn: patientData?.identifier?.find(
            (e) => e.type.text === "Medical record number"
          )?.value,
          name: patientData?.name
            .map((e) => `${e.given.join(", ")} ${e.family}`)
            .join(", "),
          dateOfBirth: patientData?.birthDate,
          gender: patientData?.gender,
          martialStatus: patientData?.maritalStatus?.text,
        }}
        loading={query.isLoading}
        onEditClick={handleEditClick}
      />

      <div className="mt-4">
        <div className="bg-white">
          <Tabs.Group aria-label="Default tabs">
            <Tabs.Item active={true} title="Appointments" icon={ClockIcon}>
              {patientData?.id && (
                <PatientAppointments patientId={patientData?.id} />
              )}
            </Tabs.Item>
            <Tabs.Item title="Telecom" icon={PhoneIcon}></Tabs.Item>
            <Tabs.Item title="Address" icon={MapIcon}></Tabs.Item>
            <Tabs.Item title="Contacts" icon={UserIcon}></Tabs.Item>
            <Tabs.Item title="Documents" icon={PaperClipIcon}></Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </div>
  );
}
