/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpOnSquareIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import "./app.css";

const q = {
  code: [
    {
      code: "74728-7",
      display:
        "Vital signs, weight, height, head circumference, oximetry, BMI, & BSA panel",
    },
  ],
  title:
    "Vital signs, weight, height, head circumference, oximetry, BMI, & BSA panel",
  resourceType: "Questionnaire",
  status: "draft",
  meta: {
    profile: [
      "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire|2.7",
    ],
    tag: [
      {
        code: "lformsVersion: 33.1.2",
      },
    ],
  },
  item: [
    {
      type: "decimal",
      code: [
        {
          code: "2710-2",
          display: "SaO2 % BldC Oximetry",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "%",
          },
        },
      ],
      required: false,
      linkId: "/2710-2",
      text: "SaO2 % BldC Oximetry",
    },
    {
      type: "quantity",
      code: [
        {
          code: "3141-9",
          display: "Weight Measured",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption",
          valueCoding: {
            display: "lbs",
          },
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption",
          valueCoding: {
            display: "kgs",
          },
        },
      ],
      required: false,
      linkId: "/3141-9",
      text: "Weight Measured",
      initial: [
        {
          valueQuantity: {
            unit: "lbs",
          },
        },
      ],
    },
    {
      type: "decimal",
      code: [
        {
          code: "8287-5",
          display: "Head Circumf OFC by Tape measure",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "cm",
          },
        },
      ],
      required: false,
      linkId: "/8287-5",
      text: "Head Circumf OFC by Tape measure",
    },
    {
      type: "quantity",
      code: [
        {
          code: "8302-2",
          display: "Bdy height",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption",
          valueCoding: {
            display: "inches",
          },
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption",
          valueCoding: {
            display: "feet",
          },
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption",
          valueCoding: {
            display: "centimeters",
          },
        },
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unitOption",
          valueCoding: {
            display: "meters",
          },
        },
      ],
      required: false,
      linkId: "/8302-2",
      text: "Bdy height",
      initial: [
        {
          valueQuantity: {
            unit: "inches",
          },
        },
      ],
    },
    {
      type: "decimal",
      code: [
        {
          code: "8310-5",
          display: "Body temperature",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "Cel",
          },
        },
      ],
      required: false,
      linkId: "/8310-5",
      text: "Body temperature",
    },
    {
      type: "decimal",
      code: [
        {
          code: "8462-4",
          display: "BP dias",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "mm[Hg]",
          },
        },
      ],
      required: false,
      linkId: "/8462-4",
      text: "BP dias",
    },
    {
      type: "decimal",
      code: [
        {
          code: "8480-6",
          display: "BP sys",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "mm[Hg]",
          },
        },
      ],
      required: false,
      linkId: "/8480-6",
      text: "BP sys",
    },
    {
      type: "decimal",
      code: [
        {
          code: "8867-4",
          display: "Heart rate",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "{beats}/min",
          },
        },
      ],
      required: false,
      linkId: "/8867-4",
      text: "Heart rate",
    },
    {
      type: "decimal",
      code: [
        {
          code: "9279-1",
          display: "Resp rate",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "{breaths}/min",
          },
        },
      ],
      required: false,
      linkId: "/9279-1",
      text: "Resp rate",
    },
    {
      type: "decimal",
      code: [
        {
          code: "3140-1",
          display: "BSA Derived",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "m2",
          },
        },
      ],
      required: false,
      linkId: "/3140-1",
      text: "BSA Derived",
    },
    {
      type: "decimal",
      code: [
        {
          code: "39156-5",
          display: "BMI",
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
          valueCoding: {
            display: "kg/m2",
          },
        },
      ],
      required: false,
      linkId: "/39156-5",
      text: "BMI",
    },
  ],
};

export function App() {
  const ref = useRef(null);
  const [orderStatus, setOrderStatus] = useState<string>("completed");

  console.log("q", getQueryVariable("qsdf"));
  useEffect(() => {
    // @ts-ignore
    if (window.LForms) {
      // @ts-ignore
      window.LForms.Util.addFormToPage(q, "myFormContainer", {});
    }
  }, []);

  return (
    <div style={{}}>
      <div ref={ref} id="myFormContainer"></div>
      <div className="mt-4 flex space-x-3 px-2">
        <div className="flex-1">
          <button className="w-full py-2 rounded-md shadow-md bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br text-white focus:ring-4 focus:outline-none focus:ring-teal-300 font-semibold flex items-start justify-center space-x-2">
            <ArrowUpOnSquareIcon className="w-5 h-5" />
            <span>Save</span>
          </button>
        </div>
        <div className="flex-1">
          {orderStatus === "completed" ? (
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
