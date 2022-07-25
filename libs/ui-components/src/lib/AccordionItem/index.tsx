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

import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

import './index.css';

interface Props {
  title: any;
  children: any;
  open?: boolean;
  className?: string;
  headerColor?: string;
  background?: string;
  onHeadingClick?: (isOpen: boolean) => void;
}

export const AccordionItem = ({
  title,
  children,
  open,
  className,
  headerColor,
  background,
  onHeadingClick,
}: Props) => {
  const headerClassName =
    headerColor === undefined
      ? 'bg-gray-100 hover:bg-gray-200 text-black'
      : headerColor;

  const backgroundClassName =
    background === undefined ? 'bg-gray-50 p-4 shadow-md' : background;

  return (
    <div className={className}>
      <div
        className={`flex flex-row justify-between cursor-pointer p-2 rounded-lg rounded-b-none shadow-lg ${headerClassName}`}
        onClick={() => onHeadingClick && onHeadingClick(!open)}
      >
        <div>{title}</div>
        <div>
          {open ? (
            <div className="material-icons">expand_less</div>
          ) : (
            <div className="material-icons">expand_more</div>
          )}
        </div>
      </div>
      <Transition.Root
        show={open}
        as={Fragment}
        appear={true}
        enter="ease-in-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={backgroundClassName}>{children}</div>
      </Transition.Root>
    </div>
  );
};
