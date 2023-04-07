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

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  PatientChartUpdateInput,
  MutationUpdatePatientChartArgs,
} from "@tensoremr/models";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Prompt } from "react-router-dom";

interface Props {
  stickieNote: string | undefined | null;
  patientChartId: string | undefined;
}

export default function Stickie({ stickieNote, patientChartId }: Props) {
  const [modified, setModified] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { register, setValue, watch } = useForm<PatientChartUpdateInput>({
    defaultValues: {
      stickieNote: stickieNote,
    },
  });

  useEffect(() => {
    if (stickieNote) {
      setValue("stickieNote", stickieNote);
    }
  }, [stickieNote, setValue]);

  const notifDispatch = useNotificationDispatch();

  const onSave = (values: any) => {
    // if (patientChartId) {
    //   const input = {
    //     ...values,
    //     id: patientChartId,
    //   };
    //   updatePatientChart({
    //     variables: {
    //       input,
    //     },
    //   });
    // }
  };

  return (
    <div className="shadow overflow-hidden h-36 bg-yellow-200">
      <div className="bg-yellow-300">
        <p className="text-xs text-gray-600 pl-2">Stickie</p>
      </div>
      <textarea
        name="stickieNote"
        className="w-full h-full bg-yellow-100 p-1 text-xs focus:outline-none border-none"
      />
    </div>
  );
}
