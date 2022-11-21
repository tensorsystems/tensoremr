/* eslint-disable-next-line */

import Logo from "../img/logo_dark.png";

import {
  Redirect,
  Route,
  Switch,
  useRouteMatch,
  useLocation,
  useHistory,
} from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import PocketBaseClient from "../pocketbase-client";

import { useNotificationDispatch } from "@tensoremr/notification";

import { useState } from "react";
import OrganizationDetailsForm from "./OrganizationDetailsForm";
import AdminAccountForm from "./AdminAccountForm";
import { pocketbaseErrorMessage } from "../util";
import { ClientResponseError } from "pocketbase";
import { Organization } from "fhir/r4";
import { getOrganizationTypes } from "../api/value_set";
import { createOrganization } from "../api/organization";

export function GetStartedPage() {
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const notifDispatch = useNotificationDispatch();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const organizationTypeQuery = useQuery(["organizationTypes"], () =>
    getOrganizationTypes()
  );

  // Mutation
  const createOrganizationMutation = useMutation({
    mutationFn: createOrganization,
  });

  const handleFormSubmit = (input: any) => {
    setIsLoading(true);

    if (location.pathname === "/get-started/organization") {
      createOrgFn(input);
      return;
    }

    if (location.pathname === "/get-started/admin") {
      createAdminFn(input);
      return;
    }
  };

  // Create organization
  const createOrgFn = async (input: any) => {
    try {
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

      await createOrganizationMutation.mutateAsync(organization);

      setIsLoading(false);
      history.push("/get-started/admin");
    } catch (error) {
      setIsLoading(false);
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
  };

  // Create admin
  const createAdminFn = async (input: any) => {
    try {
      if (input.password !== input.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const userResult = await PocketBaseClient.users.create({
        email: input.email,
        password: input.password,
        passwordConfirm: input.confirmPassword,
      });

      if (userResult.profile) {
        await PocketBaseClient.records.update(
          "profiles",
          userResult.profile.id,
          {
            role: "Admin",
            active: true,
            familyName: input.familyName,
            givenName: input.givenName,
            contactNumber: input.contactNumber,
            gender: input.gender,
          }
        );

        setIsLoading(false);
        history.replace("/");
      }
    } catch (error) {
      setIsLoading(false);
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
  };

  return (
    <div className="bg-gray-700 flex items-center justify-center h-screen">
      <div className="bg-gray-700 w-screen p-4 md:p-52 z-10">
        <div className="bg-white rounded-md shadow-lg h-full w-full z-20 py-6 px-10 ">
          <div className="container mx-auto">
            <div className="flex items-center justify-center">
              <div className="flex space-x-4 items-center text-red-600 no-underline hover:no-underline font-bold md:text-2xl lg:text-4xl">
                <div>
                  <img alt="Logo" className="h-auto w-44" src={Logo} />
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className=" text-teal-700 tracking-wide font-thin">
                Let's get you started!
              </p>
            </div>

            <Switch>
              <Route path={`${match.path}/organization`}>
                <OrganizationDetailsForm
                  organizationTypes={
                    organizationTypeQuery.data?.data.expansion?.contains
                  }
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              </Route>
              <Route path={`${match.path}/admin`}>
                <AdminAccountForm
                  isLoading={isLoading}
                  onSubmit={handleFormSubmit}
                />
              </Route>
              <Route path={`${match.path}`}>
                <Redirect to={`${match.path}/organization`} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStartedPage;
