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

import { Spinner } from "flowbite-react";
import useSWR from "swr";
import { getOneUser } from "../api";

interface Props {
  userId: string;
}

export default function FhirUserName({ userId }: Props) {
  const userQuery = useSWR(`users/${userId}`, () => getOneUser(userId));

  if (userQuery.isLoading) {
    return <Spinner color="warning" aria-label="Patient loading" />;
  }

  const user = userQuery.data?.data;
  if (user) {
    return <span>{`${user.firstName} ${user.lastName}`}</span>;
  } else {
    return <span />;
  }
}
