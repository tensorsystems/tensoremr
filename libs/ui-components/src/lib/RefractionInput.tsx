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

import cn from 'classnames';

interface Props {
  name: string;
  value: string | undefined | null;
  register: any;
  readOnly: boolean | undefined;
  onChange?: (value: any) => void;
}

export default function RefractionInput(props: Props) {
  const { name, register, value, readOnly, onChange } = props;

  return (
    <input
      type="text"
      name={name}
      ref={register}
      readOnly={readOnly}
      onChange={onChange}
      className={cn(
        'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
        {
          'bg-gray-400': readOnly && value?.length === 0,
        }
      )}
    />
  );
}
