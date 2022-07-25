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

import React, { useState } from 'react';

interface Props {
  onCancel: () => void;
}

export const AllPatientDocuments: React.FC<Props> = ({ onCancel }) => {
  return (
    <div className="container mx-auto text-lg">
      <ul>
        <li>
          <ExpandableItem title={'17 July, 2021'} />
        </li>
        <li className="">
          <ExpandableItem
            title={'21 July, 2021 (2)'}
            body={
              <div className="mt-2 ml-8">
                <ExpandableItem title={'B-Scan Ultrasound (2)'} />
              </div>
            }
          />
        </li>
        <li>
          <ExpandableItem title={'26 July, 2021'} />
        </li>
      </ul>
    </div>
  );
};

interface ExpandableItemInterface {
  title: string;
  body?: any;
}

const ExpandableItem: React.FC<ExpandableItemInterface> = ({ title, body }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <div
        className="flex items-center text-blue-600 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <span className="material-icons">arrow_drop_down</span>
        ) : (
          <span className="material-icons">arrow_right</span>
        )}
        <p className="underline">{title}</p>
      </div>

      {open && body}
    </div>
  );
};
