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

import React from 'react';
import cn from 'classnames';
import { Spinner } from 'flowbite-react';

interface Props {
  type: 'button' | 'submit';
  variant: 'filled' | 'outline';
  text: string;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  pill?: boolean;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({
  type,
  text,
  icon,
  disabled,
  variant,
  loading,
  pill,
  loadingText,
  onClick,
}) => {
  if (variant === 'filled') {
    return (
      <Filled type={type} pill={pill} disabled={disabled} onClick={onClick}>
        <div className="flex justify-center items-center space-x-4">
          {loading && <Spinner color="warning" aria-label="Button loading" />}
          {icon && !loading && <p className={`material-symbols-outlined`}>{icon}</p>}
          {loading && loadingText ? <p>{loadingText}</p> : <p>{text}</p>}
        </div>
      </Filled>
    );
  } else if (variant === 'outline') {
    return (
      <Outline type={type} pill={pill} disabled={disabled} onClick={onClick}>
        <div className="flex justify-center items-center space-x-4">
          {loading && <Spinner color="warning" aria-label="Button loading" />}
          {icon && !loading && <p className={`material-symbols-outlined`}>{icon}</p>}
          {loading && loadingText ? <p>{loadingText}</p> : <p>{text}</p>}
        </div>
      </Outline>
    );
  } else {
    return (
      <button type="button" onClick={onClick && onClick}>
        {text}
      </button>
    );
  }
};

export default Button;

interface ButtonVariantProps {
  pill?: boolean;
  disabled?: boolean;
  children: JSX.Element;
  onClick?: () => void;
  type: 'button' | 'submit';
}

const Filled: React.FC<ButtonVariantProps> = ({
  pill,
  type,
  children,
  disabled,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick && onClick}
      className={cn(
        `w-full shadow-md px-5 py-2 tracking-wide uppercase font-semibold`,
        {
          [`bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br text-white focus:ring-4 focus:outline-none focus:ring-teal-300`]:
            !disabled,
          'bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 opacity-60 text-white focus:ring-4 focus:outline-none focus:ring-teal-300':
            disabled,
          'rounded-full': pill,
          'rounded-md': !pill,
        }
      )}
    >
      {children}
    </button>
  );
};

const Outline: React.FC<ButtonVariantProps> = ({
  pill,
  type,
  children,
  disabled,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick && onClick}
      className={cn(
        `w-full shadow-md px-5 py-2 tracking-wide uppercase font-semibold`,
        {
          [`border-2 border-teal-400 focus:ring-4 hover: focus:outline-none hover:from-teal-400 hover:via-teal-500 hover:to-teal-600 hover:bg-gradient-to-br hover:text-white focus:ring-teal-300 text-teal-500`]:
            !disabled,
          'border-2 border-teal-400 opacity-60 text-white focus:ring-4 focus:outline-none focus:ring-teal-300':
            disabled,
          'rounded-full': pill,
          'rounded-md': !pill,
        }
      )}
    >
      {children}
    </button>
  );
};
