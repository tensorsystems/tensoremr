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

import { Breadcrumb } from "flowbite-react";

export interface IBreadcrumb {
  href: string;
  title: string;
  icon?: string;
}

interface Props {
  crumbs: IBreadcrumb[];
}

export default function MyBreadcrumb({ crumbs }: Props) {
  return (
    <Breadcrumb
      aria-label="Solid background breadcrumb"
      className="bg-gray-50 py-3 px-5 dark:bg-gray-900 mb-5 mt-2 shadow-md rounded-md"
    >
      {crumbs.map((e) => (
        <Breadcrumb.Item key={e.title} href={e.href}>
          <div className="flex items-center space-x-2">
            <span className={`material-icons text-teal-600 md-${e.icon}`}></span>
            <span>{e.title}</span>
          </div>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
