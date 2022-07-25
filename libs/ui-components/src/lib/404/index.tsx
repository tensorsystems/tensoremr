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
import { useHistory } from 'react-router-dom';
import fourOfour from './404.svg';

export const Component404: React.FC = () => {
  const history = useHistory();

  return (
    <div>
      <div className="text-center">
        <p className="text-4xl font-semibold">Oops! That's an error</p>
        <p className="text-2xl font-light">
          The page you are looking for does not exist
        </p>
        <button
          type="button"
          className="px-10 py-4 bg-gradient-to-r from-green-400 to-blue-500 transform hover:scale-110 text-white rounded-md shadow-lg mt-5"
          onClick={() => {
            history.replace('/');
          }}
        >
          Back to home
        </button>
      </div>
      <div className="mt-8">
        <img className="w-full h-auto" src={fourOfour} alt="404" />
      </div>
    </div>
  );
};
