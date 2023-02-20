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

import Script from "next/script";
import { ReactElement, useEffect, useRef } from "react";
import { EncounterLayout } from "..";
import { NextPageWithLayout } from "../../../_app";

import "lforms/dist/lforms/webcomponent/styles.css";
import Button from "../../../../components/button";

const q = {
  code: [
    {
      system: "http://loinc.org",
      code: "71406-3",
      display: "CMS - review of systems panel",
    },
  ],
  title: "Review of systems",
  resourceType: "Questionnaire",
  status: "draft",
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire|2.7",
    ],
    tag: [
      {
        code: "lformsVersion: 33.0.0",
      },
    ],
  },
  item: [
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71407-1",
          display: "CMS - constitutional symptoms panel",
        },
      ],
      required: false,
      linkId: "/71407-1",
      text: "Constitutional ",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71408-9",
          display: "CMS - eye panel",
        },
      ],
      required: false,
      linkId: "/71408-9",
      text: "Eye",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71409-7",
          display: "CMS - ear-nose-mouth-throat panel",
        },
      ],
      required: false,
      linkId: "/71409-7",
      text: "ENT",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71410-5",
          display: "CMS - cardiovascular panel",
        },
      ],
      required: false,
      linkId: "/71410-5",
      text: "Cardiovascular",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71411-3",
          display: "CMS - respiratory panel",
        },
      ],
      required: false,
      linkId: "/71411-3",
      text: "Respiratory",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71412-1",
          display: "CMS - gastrointestinal panel",
        },
      ],
      required: false,
      linkId: "/71412-1",
      text: "Gastrointestinal",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71413-9",
          display: "CMS - genitourinary panel",
        },
      ],
      required: false,
      linkId: "/71413-9",
      text: "Genitourinary",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71414-7",
          display: "CMS - musculoskeletal panel",
        },
      ],
      required: false,
      linkId: "/71414-7",
      text: "Musculoskeletal",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71415-4",
          display: "CMS - integumentary panel",
        },
      ],
      required: false,
      linkId: "/71415-4",
      text: "Integumentary",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71416-2",
          display: "CMS - neurological panel",
        },
      ],
      required: false,
      linkId: "/71416-2",
      text: "Neurological",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71417-0",
          display: "CMS - psychiatric panel",
        },
      ],
      required: false,
      linkId: "/71417-0",
      text: "Psychiatric",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71418-8",
          display: "CMS - endocrine panel",
        },
      ],
      required: false,
      linkId: "/71418-8",
      text: "Endocrine",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71419-6",
          display: "CMS - hematologic - lymphatic panel",
        },
      ],
      required: false,
      linkId: "/71419-6",
      text: "Hematologic - lymphatic ",
    },
    {
      type: "string",
      code: [
        {
          system: "http://loinc.org",
          code: "71420-4",
          display: "CMS - allergic - immunologic panel",
        },
      ],
      required: false,
      linkId: "/71420-4",
      text: "Allergic - immunologic",
    },
  ],
};

const TestPage: NextPageWithLayout = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.LForms) {
      window.LForms.Util.addFormToPage(q, "myFormContainer", {});
    }
  }, []);

  return (
    <>
      <div className="bg-slate-50 p-5">
        <div id="myFormContainer" ref={ref}></div>
        <div className="mt-5">
          <Button
            loading={false}
            loadingText={"Saving"}
            type="submit"
            text="Save"
            icon="save"
            variant="filled"
            disabled={false}
            onClick={() => {
              const test = window.LForms.Util.getFormData(
                ref.current,
                false,
                false
              );
              console.log("Test", test);
            }}
          />
        </div>
      </div>
    </>
  );
};

TestPage.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default TestPage;
