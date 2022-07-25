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

import { useHistory } from 'react-router-dom';
import { UserRegistrationForm } from '@tensoremr/ui-components';

interface Props {
  onFailure: (message: string) => void;
}

export const RegisterPage: React.FC<Props> = ({ onFailure }) => {
  const history = useHistory();

  const handleRegistrationSuccess = () => {
    history.replace('/');
  };

  return (
    <div className="h-screen w-screen bg-gray-600 p-16">
      <div className="h-full w-full bg-white rounded-lg shadow-xl p-5 overflow-scroll">
        <UserRegistrationForm
          onSuccess={handleRegistrationSuccess}
          onFailure={onFailure}
        />
      </div>
    </div>
  );
};
