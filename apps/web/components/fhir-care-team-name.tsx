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

import { CareTeam } from "fhir/r4";
import { Spinner } from "flowbite-react";
import useSWR from "swr";
import { getCareTeam } from "../api";

interface Props {
  id: string;
}

export default function FhirCareTeamName({ id }: Props) {
  const careTeamQuery = useSWR(`careTeams/${id}`, () => getCareTeam(id));

  if (careTeamQuery.isLoading) {
    return <Spinner color="warning" aria-label="Care team loading" />;
  }

  const careTeam = careTeamQuery.data?.data as CareTeam;
  if (careTeam) {
    return <span>{careTeam.name}</span>;
  } else {
    return <span />;
  }
}
