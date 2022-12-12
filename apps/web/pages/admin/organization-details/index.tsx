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

import { useNotificationDispatch } from "@tensoremr/notification";
import { Organization } from "fhir/r4";
import { ReactElement, useEffect, useState } from "react";
import { AdminLayout } from "..";
import { NextPageWithLayout } from "../../_app";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  getAllOrganizations,
  getOrganizationTypes,
  updateOrganization,
} from "../../../_api";
import OrganizationForm from "../../../components/organization-form";

const OrganizationDetails: NextPageWithLayout = () => {
  const notifDispatch = useNotificationDispatch();
  const { trigger } = useSWRMutation("Organization", (key, { arg }) =>
    updateOrganization(arg)
  );

  // State
  const [organizationDefaultValues, setOrganizationDefaultValues] =
    useState<Organization>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const organizationTypesQuery = useSWR(
    "organizationTypes",
    getOrganizationTypes
  );
  const organizationsQuery = useSWR("organizations", getAllOrganizations);

  useEffect(() => {
    if (organizationTypesQuery?.error) {
      notifDispatch({
        type: "showNotification",
        notifTitle: "Error",
        notifSubTitle: organizationTypesQuery?.error.message,
        variant: "failure",
      });
    }
  }, [organizationTypesQuery?.error]);

  useEffect(() => {
    if (organizationsQuery.data?.data) {
      const bundle = organizationsQuery.data?.data;

      if (bundle.entry?.length > 0) {
        const resource = bundle.entry[0].resource as Organization;
        setOrganizationDefaultValues(resource);
      }
    }
  }, [organizationsQuery.data]);

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      if (!organizationDefaultValues?.id) {
        throw new Error("Something went wrong");
      }

      const organizationType =
        organizationTypesQuery?.data?.data.expansion?.contains.find(
          (e: any) => e.code === input.type
        );

      if (!organizationType) {
        throw new Error("Something went wrong");
      }

      const addressLine = [];

      if (input.streetAddress) {
        addressLine.push(input.streetAddress);
      }

      if (input.streetAddress2) {
        addressLine.push(input.streetAddress2);
      }

      const organization: Organization = {
        id: organizationDefaultValues.id,
        resourceType: "Organization",
        active: true,
        type: [
          {
            coding: [
              {
                system: organizationType.system,
                version: organizationTypesQuery?.data?.data.version,
                code: organizationType.code,
                display: organizationType.display,
                userSelected: true,
              },
            ],
            text: organizationType.display,
          },
        ],
        name: input.name,
        telecom: [
          {
            value: input.contactNumber,
            system: "phone",
            use: "work",
            rank: 1,
          },
          {
            value: input.email,
            system: "email",
            use: "work",
            rank: 2,
          },
        ],
        address: [
          {
            use: "work",
            type: "physical",
            line: addressLine,
            city: input.city,
            district: input.district,
            state: input.state,
            country: input.country,
          },
        ],
      };

      organization.id = organizationDefaultValues.id;

      await trigger(organization);

      notifDispatch({
        type: "showNotification",
        notifTitle: "Success",
        notifSubTitle: "Organization info updated successfully",
        variant: "success",
      });
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
    <div className="bg-white shadow-md rounded-md p-4">
      <p className="font-semibold text-lg text-gray-800">
        Organization details
      </p>
      <hr className="my-4" />
      <OrganizationForm
        isLoading={isLoading}
        defaultValues={organizationDefaultValues}
        organizationTypes={
          organizationTypesQuery?.data?.data.expansion?.contains
        }
        onSubmit={onSubmit}
      />
    </div>
  );
};

OrganizationDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default OrganizationDetails;
