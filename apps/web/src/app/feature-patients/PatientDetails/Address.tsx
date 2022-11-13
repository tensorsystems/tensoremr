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

import { Record } from 'pocketbase';

export const Address: React.FC<{
  address: Record | undefined;
}> = ({ address }) => {
  return (
    <div className="grid grid-cols-3 gap-y-4">
      <Item title="Type" value={address?.type} />
      <Item title="Use" value={address?.use} />
      <Item title="Text" value={address?.text} />
      <Item title="Address Line" value={address?.line} />
      <Item title="Address Line 2" value={address?.line2} />
      <Item title="City" value={address?.city} />
      <Item title="District" value={address?.district} />
      <Item title="State" value={address?.state} />
      <Item title="Postal Code" value={address?.postalCode} />
      <Item title="Country" value={address?.country} />
    </div>
  );
};

interface ItemProps {
  title: string;
  value: string;
}

const Item: React.FC<ItemProps> = ({ title, value }) => {
  return (
    <div>
      <p>{title}</p>
      <p className="text-sm text-gray-500">{value}</p>
    </div>
  );
};
