/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { Practitioner } from "fhir/r4";
import { Spinner } from "flowbite-react";
import useSWR from "swr";
import { getPracititioner } from "../api";
import { parsePractitionerName } from "../util/fhir";

interface Props {
  practitionerId: string;
}

export default function FhirPractitionerName({ practitionerId }: Props) {
  const practitionerQuery = useSWR(`practitioners/${practitionerId}`, () =>
    getPracititioner(practitionerId)
  );

  if (practitionerQuery.isLoading) {
    return <Spinner color="warning" aria-label="Patient loading" />;
  }

  const practitioner = practitionerQuery.data?.data as Practitioner;
  if (practitioner) {
    return <p>{parsePractitionerName(practitioner)}</p>;
  } else {
    return <div />;
  }
}
