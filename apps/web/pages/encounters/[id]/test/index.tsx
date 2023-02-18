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

const q = {
  "code": [
    {
      "code": "71406-3",
      "display": "CMS - review of systems panel",
      "system": "http://loinc.org"
    }
  ],
  "title": "CMS - review of systems panel",
  "resourceType": "Questionnaire",
  "status": "draft",
  "meta": {
    "profile": [
      "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire|2.7"
    ],
    "tag": [
      {
        "code": "lformsVersion: 33.0.0"
      }
    ]
  },
  "item": [
    {
      "type": "string",
      "code": [
        {
          "code": "71407-1",
          "display": "CMS - constitutional symptoms panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71407-1",
      "text": "CMS - constitutional symptoms panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71408-9",
          "display": "CMS - eye panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71408-9",
      "text": "CMS - eye panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71409-7",
          "display": "CMS - ear-nose-mouth-throat panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71409-7",
      "text": "CMS - ear-nose-mouth-throat panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71410-5",
          "display": "CMS - cardiovascular panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71410-5",
      "text": "CMS - cardiovascular panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71411-3",
          "display": "CMS - respiratory panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71411-3",
      "text": "CMS - respiratory panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71412-1",
          "display": "CMS - gastrointestinal panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71412-1",
      "text": "CMS - gastrointestinal panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71413-9",
          "display": "CMS - genitourinary panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71413-9",
      "text": "CMS - genitourinary panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71414-7",
          "display": "CMS - musculoskeletal panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71414-7",
      "text": "CMS - musculoskeletal panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71415-4",
          "display": "CMS - integumentary panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71415-4",
      "text": "CMS - integumentary panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71416-2",
          "display": "CMS - neurological panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71416-2",
      "text": "CMS - neurological panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71417-0",
          "display": "CMS - psychiatric panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71417-0",
      "text": "CMS - psychiatric panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71418-8",
          "display": "CMS - endocrine panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71418-8",
      "text": "CMS - endocrine panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71419-6",
          "display": "CMS - hematologic - lymphatic panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71419-6",
      "text": "CMS - hematologic - lymphatic panel"
    },
    {
      "type": "string",
      "code": [
        {
          "code": "71420-4",
          "display": "CMS - allergic - immunologic panel",
          "system": "http://loinc.org"
        }
      ],
      "required": false,
      "linkId": "/71420-4",
      "text": "CMS - allergic - immunologic panel"
    }
  ]
};
const TestPage: NextPageWithLayout = () => {
  useEffect(() => {
    
    if (window.LForms) {
      console.log("Test", window.LForms);
      window.LForms.Util.addFormToPage(q, "myFormContainer", {});
    }
  }, []);

  return (
    <>
      <div className="bg-slate-50 p-5">
        <div id="myFormContainer"></div>
      </div>
    </>
  );
};

TestPage.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default TestPage;
