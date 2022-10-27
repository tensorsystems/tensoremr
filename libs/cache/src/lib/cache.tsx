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

import { InMemoryCache, makeVar } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          },
        },
        hasAdminAccess: {
          read() {
            return hasAdminAccess();
          },
        },
        accessToken: {
          read() {
            return accessToken();
          },
        },
        newPatientCache: {
          read() {
            return newPatientCache();
          },
        },
      },
    },
  },
});

// Initializes to true if localStorage includes a 'accessToken' key,
// false otherwise
export const isLoggedInVar = makeVar<boolean>(
  !!localStorage.getItem('accessToken')
);
export const hasAdminAccess = makeVar<boolean>(
  !!localStorage.getItem('adminAccess')
);
export const accessToken = makeVar<string | null>(
  localStorage.getItem('accessToken')
);
export const newPatientCache = makeVar<any | null>(null);
