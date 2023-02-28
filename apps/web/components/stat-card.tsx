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

import React from "react";

interface Props {
  title: string;
  figure: number;
  onClick?: () => void;
}
export default function StatCard({ title, figure, onClick }: Props) {
  return (
    <div
      className="md:flex-1 bg-white shadow-md rounded-lg h-34 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <p className="text-gray-400">{title}</p>
        <p className="text-teal-800 font-semibold text-3xl">{figure}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-b-lg">
        <p className="text-teal-700 hover:text-teal-800 font-semibold text-sm tracking-wide">
          VIEW ALL
        </p>
      </div>
    </div>
  );
}
