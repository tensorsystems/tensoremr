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
  differenceInMonths,
  differenceInYears,
  format,
  parseISO,
} from 'date-fns';
import _ from 'lodash';

export const formatDate = (date: string) => {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};

export function getParsedJwt<
  T extends object = { [k: string]: string | number }
>(token: string): T | undefined {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return undefined;
  }
}

export const parseJwt: any = (token: string) => {
  if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  groupOn: K | ((i: T) => string | undefined | null)
): Record<string, T[]> => {
  const groupFn =
    typeof groupOn === 'function' ? groupOn : (o: T) => o[groupOn];

  return Object.fromEntries(
    array.reduce((acc, obj) => {
      const groupKey = groupFn(obj);
      return acc.set(groupKey, [...(acc.get(groupKey) || []), obj]);
    }, new Map())
  ) as Record<string, T[]>;
};

interface FileUrlParams {
  baseUrl: string | undefined;
  fileName: string;
  hash: string;
  extension: string;
}

export function getFileUrl({
  baseUrl,
  fileName,
  hash,
  extension,
}: FileUrlParams) {
  let fileUrl = `${baseUrl}/files/${fileName}`;

  if (hash.length !== 0) {
    fileUrl = fileUrl.concat(`_${hash}.${extension}`);
  } else {
    fileUrl = fileUrl.concat(`.${extension}`);
  }

  return fileUrl;
}

export const getEyewearRxNames = (data: any | undefined) => {
  const names = [];

  data?.bifocal && names.push('Bifocal');
  data?.glareFree && names.push('Glare Free');
  data?.glass && names.push('Glass');
  data?.photoChromatic && names.push('Photo Chromatic');
  data?.polarized && names.push('Polarized');
  data?.polarizedClip && names.push('Polarized Clip');
  data?.plastic && names.push('Plastic');
  data?.progressive && names.push('Progressive');
  data?.scratchResistant && names.push('Scratch Resistant');
  data?.singleVision && names.push('Single Vision');
  data?.twoSeparateGlasses && names.push('Two separate glasses');
  data?.highIndex && names.push('High Index');
  data?.tint && names.push('Tint');
  data?.blueCut && names.push('Blue Cut');

  return names.join(' / ');
};

export const getPatientAge = (dateOfBirth: any) => {
  const years = differenceInYears(new Date(), parseISO(dateOfBirth));

  if (years === 0) {
    const months = differenceInMonths(new Date(), parseISO(dateOfBirth));
    return `${months} months old`;
  }

  return `${years} years old`;
};

export const groupByHpiComponentType = (hpiComponents: any | undefined) => {
  if (hpiComponents) {
    const grouped = _.groupBy(hpiComponents, 'hpiComponentType.title');
    const entries = Object.entries(grouped);

    return entries;
  }

  return null;
};
