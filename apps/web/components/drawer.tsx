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
import cn from "classnames";

interface Props {
  children: any;
  isOpen: boolean;
  width: "small" | "medium" | "full";
  setIsOpen: (open: boolean) => void;
}

export default function Drawer(props: Props) {
  const { children, isOpen, width, setIsOpen } = props;

  return (
    <main
      className={cn(
        "fixed  z-40 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out",
        {
          "transition-opacity opacity-100 duration-500 translate-x-0": isOpen,
          "transition-all delay-500 translate-x-full": !isOpen,
        }
      )}
    >
      <section
        className={cn(
          "right-0 overflow-scroll  absolute bg-white h-full delay-400 duration-500 ease-in-out transition-all transform rounded-sm",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
            "w-1/4": width === "small",
            "w-1/2": width === "medium",
            "left-10": width === "full",
          }
        )}
      >
        {children}
      </section>
      <section
        className="w-screen h-full cursor-pointer"
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
