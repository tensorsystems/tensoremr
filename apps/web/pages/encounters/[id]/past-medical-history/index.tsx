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
import { ReactElement } from "react";
import { NextPageWithLayout } from "../../../_app";
import { EncounterLayout } from "..";
import { Spinner } from "flowbite-react";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { format, parseISO } from "date-fns";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import { CreateDisorderForm } from "./create-disorder-form";
import useSWR from "swr";
import { getConditions, getEncounter } from "../../../../api";
import { Condition, Encounter } from "fhir/r4";
import { CreateSurgicalHistoryForm } from "./create-surgical-history-form";

const PastMedicalHistory: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const disordersQuery = useSWR("disorders", () =>
    getConditions(
      { page: 1, size: 200 },
      `encounter=${id}&category=problem-list-item&type=disorder-history`
    )
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const disorders: Condition[] =
    disordersQuery?.data?.data?.entry?.map((e) => e.resource as Condition) ??
    [];

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Past Medical History
      </p>

      <hr className="mt-3" />

      <div className="grid grid-cols-2 gap-3 auto-rows-fr mt-5">
        <HistoryComponent
          title="Past Disorders"
          items={disorders.map((e) => ({
            id: e.id,
            title: e.code?.text,
            subTitle:
              e.note?.length > 0
                ? e.note.map((n) => n.text).join(", ")
                : undefined,
            subTitle2: e.clinicalStatus.text,
            createdAt: e.recordedDate
          }))}
          locked={false}
          loading={false}
          onAddClick={() => {
            if (encounter) {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <div className="px-8 py-6">
                    <div className="float-right">
                      <button
                        onClick={() => {
                          bottomSheetDispatch({
                            type: "hide",
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-8 w-8 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <CreateDisorderForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Condition saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        disordersQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <HistoryComponent
          title="Surgical History"
          items={[]}
          locked={false}
          loading={false}
          onAddClick={() => {
            if (encounter) {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <div className="px-8 py-6">
                    <div className="float-right">
                      <button
                        onClick={() => {
                          bottomSheetDispatch({
                            type: "hide",
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-8 w-8 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <CreateSurgicalHistoryForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Surgical history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        //disordersQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <HistoryComponent
          title="Mental State"
          items={[]}
          locked={false}
          loading={false}
        />

        <HistoryComponent
          title="Immunization"
          items={[]}
          locked={false}
          loading={false}
        />

        <HistoryComponent
          title="Allergy"
          items={[]}
          locked={false}
          loading={false}
        />

        <HistoryComponent
          title="Intolerance"
          items={[]}
          locked={false}
          loading={false}
        />

        <HistoryComponent
          title="Hospitalizations"
          items={[]}
          locked={false}
          loading={false}
        />

        <HistoryComponent
          title="Other"
          items={[]}
          locked={false}
          loading={false}
        />
      </div>
    </div>
  );
};

PastMedicalHistory.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default PastMedicalHistory;

interface HistoryComponentItem {
  id: string;
  title: string;
  subTitle?: string;
  subTitle2?: string;
  createdAt?: string;
}

interface HistoryComponentProps {
  title: string;
  items: Array<HistoryComponentItem>;
  locked: boolean;
  loading?: boolean;
  onAddClick?: () => void;
  onUpdate?: (item: any) => void;
  onDelete?: (id: string) => void;
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({
  title,
  items,
  locked,
  loading,
  onAddClick,
  onUpdate,
  onDelete,
}) => {
  if (loading) {
    return (
      <HistoryComponentLayout
        title={title}
        locked={locked}
        onAddClick={onAddClick}
      >
        <div className="h-20 flex items-center justify-center">
          <Spinner color="warning" aria-label="Button loading" />
        </div>
      </HistoryComponentLayout>
    );
  }

  if (items && items.length === 0) {
    return (
      <HistoryComponentLayout
        title={title}
        locked={locked}
        onAddClick={onAddClick}
      >
        <div className="bg-gray-50 mt-3 h-32 flex rounded-sm shadow-inner">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons md-inbox"></div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      </HistoryComponentLayout>
    );
  }

  return (
    <HistoryComponentLayout
      title={title}
      locked={locked}
      onAddClick={onAddClick}
    >
      <ul className="mt-3">
        {items &&
          items.map((item) => {
            const pertinence: "Positive" | "Negative" = "Positive";
            // const findingContext = item.attributes?.find(
            //   (e: ClinicalFindingAttribute) => e.attributeTypeId === "408729009"
            // );

            // if (findingContext) {
            //   if (findingContext.attributeId === "410516002") {
            //     pertinence = "Negative";
            //   } else {
            //     pertinence = "Positive";
            //   }
            // }

            return (
              <li
                key={item?.id}
                className="flex justify-between border-t border-gray-200 py-2 px-2"
              >
                <div className="flex space-x-3 items-center">
                  <div>
                    {pertinence === "Positive" ? (
                      <PlusCircleIcon className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <MinusCircleIcon className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex space-x-2 items-center">
                    <div>
                      <div className="flex items-center space-x-4">
                      <p className="text-gray-700 break-words">{item?.title}</p>
                      {item.createdAt && (
                      <div className="text-gray-500 italic text-sm min-w-fit">
                        <p>- {format(parseISO(item.createdAt), "MMM d, y")}</p>
                      </div>
                    )}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {item?.subTitle}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {item?.subTitle2}
                      </div>
                    </div>
                  
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className=" "
                    onClick={() => {
                      if (item.id) {
                        const choice = window.confirm(
                          "Are you sure you want to delete this item?"
                        );
                        if (choice) {
                          onDelete(item.id);
                        }
                      }
                    }}
                  >
                    <TrashIcon className="h-5 w-5 text-red-400 hover:text-red-600" />
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </HistoryComponentLayout>
  );
};

interface HistoryComponentLayoutProps {
  title: string;
  children: any;
  locked: boolean;
  onAddClick?: () => void;
}

function HistoryComponentLayout(props: HistoryComponentLayoutProps) {
  const { title, locked, children, onAddClick } = props;

  return (
    <div className="rounded-md shadow-lg border border-gray-100 bg-zinc-50 p-4">
      <div className="flex justify-between items-center">
        <p className="tracking-wide font-semibold text-gray-800 text-lg">
          {title}
        </p>
        <button
          className="border border-teal-800 px-3 py-1 rounded-lg flex space-x-1 items-center text-teal-800 hover:bg-teal-500 hover:text-white"
          onClick={onAddClick}
          disabled={locked}
          type="button"
        >
          <p className="material-icons md-add"></p>
          <div>Add</div>
        </button>
      </div>
      {children}
    </div>
  );
}
