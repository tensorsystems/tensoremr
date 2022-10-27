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

import React, { useEffect, useState } from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import { AppointmentsListPage } from './AppointmentsListPage';
import { parseJwt } from '@tensoremr/util';
import { AppointmentPage } from './AppointmentPage';
import { Page } from '@tensoremr/models';

export const Appointments: React.FC<{
  onUpdateTab: (page: any) => void;
  onAddPage: (page: Page) => void;
  onTabClose: (route: string) => void;
}> = ({ onUpdateTab, onAddPage, onTabClose }) => {
  const match = useRouteMatch();
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token !== null) {
      const claim = parseJwt(token);
      setUserType(claim.UserType);
    }
  }, []);

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:appointmentId`}>
          <AppointmentPage
            onUpdateTab={onUpdateTab}
            onAddPage={onAddPage}
            onTabClose={onTabClose}
          />
        </Route>
        <Route path={match.path}>
          <AppointmentsListPage onAddPage={onAddPage} />
        </Route>
      </Switch>
    </div>
  );
};
