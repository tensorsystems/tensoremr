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

import {
  PhoneIcon,
  MailIcon,
  DesktopComputerIcon,
  LinkIcon,
  ChatIcon,
  PrinterIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/solid';

export const Telecom: React.FC<{
  system: string | undefined;
  value: string | undefined;
  use: string | undefined;
}> = ({ system, value, use }) => {
  let icon;

  if(system === "phone") {
    icon = <PhoneIcon className="w-6 h-6 text-gray-500" />
  } else if(system === "fax") {
    icon = <PrinterIcon className="w-6 h-6 text-gray-500" />
  } else if(system === "email") {
    icon = <MailIcon className="w-6 h-6 text-gray-500" />
  } else if(system === "pager") {
    icon = <DesktopComputerIcon className="w-6 h-6 text-gray-500" />
  } else if(system === "url") {
    icon = <LinkIcon className="w-6 h-6 text-gray-500" />
  } else if(system === "sms") {
    icon = <ChatIcon className="w-6 h-6 text-gray-500" />
  } else {
    icon = <QuestionMarkCircleIcon className="w-6 h-6 text-gray-500" />
  }

  return (
    <div className="mt-4 inline-block border rounded-md">
      <div className="flex space-x-2  ">
        <div className="bg-gray-200 flex items-center justify-center px-2 py-2 rounded-md rounded-r-none">
          {icon}
        </div>
        <div className="flex pr-8">
          <div>
            <p className="text-teal-700 text-semibold">{value}</p>
            <p className="text-sm text-gray-400">{use}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
