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

import React, { useEffect, useState } from "react";
import classnames from "classnames";

import { fromJS, List, Map } from "immutable";
import { HomePages } from "./home-tabs/pages";
import Link from "next/link";
import { UserRoleClaim } from "supertokens-auth-react/recipe/userroles";
import Session from "supertokens-auth-react/recipe/session";

export const Actionbar: React.FC = () => {
  const claimValue: any = Session.useClaimValue(UserRoleClaim);

  const actions: any = fromJS([
    Map(fromJS(HomePages.find((e) => e.route === "/"))),
    Map(fromJS(HomePages.find((e) => e.route === "/patient-queue"))),
  ]);

  const [pages, setPages] = useState<List<any>>(actions);

  useEffect(() => {
    if (!claimValue.loading) {
      let newPages: List<any> = pages;

      const newPatientsIdx = newPages.findIndex((e) => {
        return e?.get("title") === "New patient";
      });

      const appointmentsIdx = newPages.findIndex((e) => {
        return e?.get("title") === "Appointments";
      });

      const schedulesIdx = newPages.findIndex((e) => {
        return e?.get("title") === "Schedules";
      });

      const patientsIdx = newPages.findIndex((e) => {
        return e?.get("title") === "Patients";
      });

      const diagnosticIdx = newPages.findIndex((e) => {
        return e?.get("title") === "Diagnostic orders";
      });

      const encountersIdx = newPages.findIndex((e) => {
        return e?.get("title") === "Encounters";
      });

      const tasksIdx = newPages.findIndex((e) => {
        return e?.get("title") === "Tasks";
      });

      const careTeamsIdx = newPages.findIndex((e) => {
        return e?.get("title") === "Care Teams";
      });

      const labIdx = newPages.findIndex(
        (e) => e?.get("title") === "Lab orders"
      );
      const treatmentIdx = newPages.findIndex(
        (e) => e?.get("title") === "Treatment orders"
      );
      const surgicalIdx = newPages.findIndex(
        (e) => e?.get("title") === "Surgical orders"
      );

      const followupIdx = newPages.findIndex(
        (e) => e?.get("title") === "Follow-Up orders"
      );

      const referralIdx = newPages.findIndex(
        (e) => e?.get("title") === "Referrals"
      );

      if (encountersIdx === -1) {
        newPages = newPages.push(
          fromJS(fromJS(HomePages.find((e) => e.route === "/encounters")))
        );
      }

      if (newPatientsIdx === -1) {
        newPages = newPages.push(
          fromJS(HomePages.find((e) => e.route === "/patients/create"))
        );
      }

      if (patientsIdx === -1) {
        newPages = newPages.push(
          fromJS(fromJS(HomePages.find((e) => e.route === "/patients")))
        );
      }

      if (careTeamsIdx === -1) {
        newPages = newPages.push(
          fromJS(fromJS(HomePages.find((e) => e.route === "/care-teams")))
        );
      }

      const adminIdx = newPages.findIndex((e) => e?.get("title") === "Admin");

      if (claimValue?.value?.includes("receptionist")) {
        if (diagnosticIdx === -1) {
          newPages = newPages.push(
            fromJS(
              fromJS(
                HomePages.find(
                  (e) => e.route === "/diagnostic-orders?status=ORDERED"
                )
              )
            )
          );
        }

        if (tasksIdx === -1) {
          newPages = newPages.push(
            fromJS(fromJS(HomePages.find((e) => e.route === "/tasks")))
          );
        }

        if (labIdx === -1) {
          newPages = newPages.push(
            fromJS(
              HomePages.find((e) => e.route === "/lab-orders?status=ORDERED")
            )
          );
        }

        if (treatmentIdx === -1) {
          newPages = newPages.push(
            fromJS(
              HomePages.find(
                (e) => e.route === "/treatment-orders?status=ORDERED"
              )
            )
          );
        }

        if (surgicalIdx === -1) {
          newPages = newPages.push(
            fromJS(
              HomePages.find(
                (e) => e.route === "/surgical-orders?status=ORDERED"
              )
            )
          );
        }

        if (followupIdx === -1) {
          newPages = newPages.push(
            fromJS(
              HomePages.find(
                (e) => e.route === "/followup-orders?status=ORDERED"
              )
            )
          );
        }

        if (referralIdx === -1) {
          newPages = newPages.push(
            fromJS(HomePages.find((e) => e.route === "/referrals"))
          );
        }
      }

      if (
        (claimValue?.value?.includes("receptionist") ||
          claimValue?.value?.includes("admin") ||
          claimValue?.value?.includes("ict") ||
          claimValue?.value?.includes("nurse") ||
          claimValue?.value?.includes("physician")) &&
        appointmentsIdx !== -1
      ) {
        newPages = newPages.push(
          fromJS(HomePages.find((e) => e.route === "/appointments"))
        );
      }

      if (
        (claimValue?.value?.includes("receptionist") ||
          claimValue?.value?.includes("admin") ||
          claimValue?.value?.includes("ict") ||
          claimValue?.value?.includes("physician")) &&
        appointmentsIdx !== -1
      ) {
        newPages = newPages.push(
          fromJS(HomePages.find((e) => e.route === "/schedules"))
        );
      }

      if (
        adminIdx === -1 &&
        (claimValue?.value?.includes("admin") ||
          claimValue?.value?.includes("ict"))
      ) {
        newPages = newPages.push(
          fromJS(HomePages.find((e) => e.route === "/admin"))
        );
      }

      // if (data?.notifs) {
      //   newPages = newPages.withMutations((ctx) => {
      //     if (diagnosticIdx !== -1) {
      //       ctx.setIn(
      //         [diagnosticIdx, "notifs"],
      //         data.notifs.diagnosticProcedureOrders
      //       );
      //     }

      //     if (labIdx !== -1) {
      //       ctx.setIn([labIdx, "notifs"], data.notifs.labOrders);
      //     }

      //     if (treatmentIdx !== -1) {
      //       ctx.setIn([treatmentIdx, "notifs"], data.notifs.treatmentOrders);
      //     }

      //     if (surgicalIdx !== -1) {
      //       ctx.setIn([surgicalIdx, "notifs"], data.notifs.surgicalOrders);
      //     }

      //     if (followupIdx !== -1) {
      //       ctx.setIn([followupIdx, "notifs"], data.notifs.followUpOrders);
      //     }

      //     if (referralIdx !== -1) {
      //       ctx.setIn([referralIdx, "notifs"], data.notifs.referralOrders);
      //     }

      //     if (adminIdx !== -1) {
      //       ctx.setIn([adminIdx, "notifs"], data.notifs.paymentWaivers);
      //     }
      //   });
      // }

      setPages(newPages);
    }
  }, [pages, claimValue]);

  return (
    <div className="bg-gray-200">
      <header className="bg-white shadow">
        <div className="mx-auto py-2 px-4 sm:px-6 lg:px-8">
          <div className="gap-2 w-full flex flex-wrap -m-1 my-1">
            {pages.toJS().map((e: any, i) => (
              <Chip key={i} action={e} />
            ))}
          </div>
        </div>
      </header>
    </div>
  );
};

const Chip: React.FC<{
  action: { title: string; icon: string; route: string; notifs?: number };
}> = ({ action }) => {
  return (
    <div
      className={classnames(
        "flex space-x-2 items-center bg-gray-200 h-8 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400",
        {
          "px-3": !action.notifs,
          "px-2": action.notifs,
        }
      )}
    >
      <Link href={action.route}>
        <div className="flex space-x-1 items-center text-gray-600 hover:text-teal-600">
          <div className="material-symbols-outlined">{action.icon}</div>
          <div>{action.title}</div>
        </div>
      </Link>

      <Link href={action.route} target="_blank">
        <div className="flex items-center space-x-1 text-gray-500 hover:text-yellow-600">
          <div
            className="material-symbols-outlined"
            style={{ fontSize: "16px" }}
          >
            open_in_new
          </div>
        </div>
      </Link>
      {action.notifs !== undefined && action.notifs !== 0 && (
        <div className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center shadow-inner">
          {action.notifs}
        </div>
      )}
    </div>
  );
};
