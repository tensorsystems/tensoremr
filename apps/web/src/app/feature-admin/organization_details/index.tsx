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

import React, { useState } from "react";
import { useEffect } from "react";
import { useNotificationDispatch } from "@tensoremr/notification";
import PocketBaseClient from "../../pocketbase-client";
import OrganizationDetailsForm from "../../feature-get-started/OrganizationDetailsForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClientResponseError } from "pocketbase";
import { pocketbaseErrorMessage } from "../../util";
import {
  getAllOrganizations,
  updateOrganization,
} from "../../api/organization";
import { Organization } from "fhir/r4";
import { getOrganizationTypes } from "../../api";

export const OrganizationDetails: React.FC = () => {
  const notifDispatch = useNotificationDispatch();

  // State
  const [organizationDefaultValues, setOrganizationDefaultValues] =
    useState<Organization>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const queryOrganizationDetails = useQuery(["organization"], () =>
    getAllOrganizations()
  );

  // Query
  const organizationTypeQuery = useQuery(["organizationTypes"], () =>
    getOrganizationTypes()
  );

  // Mutation
  const updateOrganizationMutation = useMutation({
    mutationFn: updateOrganization,
  });

  useEffect(() => {
    if (queryOrganizationDetails.data?.data) {
      const bundle = queryOrganizationDetails.data?.data;

      if (bundle.entry?.length > 0) {
        const resource = bundle.entry[0].resource as Organization;
        setOrganizationDefaultValues(resource);
      }
    }
  }, [queryOrganizationDetails.data]);

  const getDefaultValues = async (organization: any) => {
    try {
      const defaultValues = { ...organization };

      if (organization.telecom) {
        const contactNumber = await PocketBaseClient.records.getOne(
          "contact_points",
          organization.telecom
        );

        defaultValues.telecom = contactNumber;
      }

      if (organization.email) {
        const email = await PocketBaseClient.records.getOne(
          "contact_points",
          organization.email
        );

        defaultValues.email = email;
      }

      if (organization.address) {
        const address = await PocketBaseClient.records.getOne(
          "address",
          organization.address
        );

        defaultValues.address = address;
      }

      setOrganizationDefaultValues(defaultValues);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof ClientResponseError) {
        if (!error.isAbort) {
          notifDispatch({
            type: "showNotification",
            notifTitle: "Error",
            notifSubTitle: pocketbaseErrorMessage(error) ?? "",
            variant: "failure",
          });
        }
      } else if (error instanceof Error) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.message,
          variant: "failure",
        });
      }

      console.error(error);
    }
  };

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      if (!organizationDefaultValues?.id) {
        throw new Error("Something went wrong");
      }

      const organizationType =
        organizationTypeQuery.data?.data.expansion?.contains.find(
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
                version: organizationTypeQuery.data?.data.version,
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

      await updateOrganizationMutation.mutateAsync({
        id: organizationDefaultValues.id,
        data: organization,
      });

      notifDispatch({
        type: "showNotification",
        notifTitle: "Success",
        notifSubTitle: "Organization info updated successfully",
        variant: "success",
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: pocketbaseErrorMessage(error) ?? "",
          variant: "failure",
        });
      } else if (error instanceof Error) {
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
      <OrganizationDetailsForm
        isLoading={isLoading}
        defaultValues={organizationDefaultValues}
        organizationTypes={organizationTypeQuery.data?.data.expansion?.contains}
        onSubmit={onSubmit}
      />
    </div>
  );
};
