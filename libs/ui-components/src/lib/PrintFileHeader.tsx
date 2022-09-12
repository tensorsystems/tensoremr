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

import { QRCodeSVG } from 'qrcode.react';
import { gql, useQuery } from '@apollo/client';
import { Query } from '@tensoremr/models';

const GET_ORGANIZATION_DETAILS = gql`
  query GetOrganizationDetails {
    organizationDetails {
      id
      name
      phoneNo
      phoneNo2
      address
      address2
      website
      email
      lanIpAddress
      logoId
      logo {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
    }
  }
`;

export const PrintFileHeader = ({ qrUrl }: { qrUrl: string }) => {
  const { data } = useQuery<Query, any>(GET_ORGANIZATION_DETAILS);

  const hasLogo =
    data?.organizationDetails.logo !== null &&
    data?.organizationDetails.logo !== undefined;
  const hasWebsite = (data?.organizationDetails.website ?? 0) > 0;
  const hasPhoneNo =
    (data?.organizationDetails.phoneNo?.length ?? 0) > 0 ||
    (data?.organizationDetails.phoneNo2?.length ?? 0) > 0;

  const hasAddress =
    (data?.organizationDetails.address?.length ?? 0) > 0 ||
    (data?.organizationDetails.address2?.length ?? 0) > 0;

  return (
    <div className="flex justify-between items-center mt-10 text-sm">
      <div className="flex-1">
        {hasLogo ? (
          <img
            // @ts-ignore
            src={`${import.meta.env.VITE_APP_SERVER_URL}/files/${
              data?.organizationDetails?.logo?.fileName
            }_${data?.organizationDetails?.logo?.hash}.${
              data?.organizationDetails?.logo?.extension
            }`}
            alt="Logo"
            className="h-auto w-36"
          />
        ) : (
          <p className="text-lg w-auto text-center">
            {data?.organizationDetails.name}
          </p>
        )}
      </div>

      <div className="flex-1 items-center justify-center flex">
        <QRCodeSVG size={60} value={'www.tensorsystems.net'} />
      </div>

      <div className="text-gray-700 flex-1">
        {hasWebsite && (
          <div className="flex items-center space-x-2">
            <p className="material-icons">language</p>
            <p>{data?.organizationDetails.website}</p>
          </div>
        )}
        {hasAddress && (
          <div className="flex items-center space-x-2 ">
            <p className="material-icons">place</p>
            <p>{`${data?.organizationDetails.address}`}</p>
          </div>
        )}
        {hasPhoneNo && (
          <div className="flex items-center space-x-2 ">
            <p className="material-icons">call</p>
            <p>{`${data?.organizationDetails.phoneNo} ${
              data?.organizationDetails.phoneNo2 &&
              ' / ' + data?.organizationDetails.phoneNo2
            }`}</p>
          </div>
        )}
      </div>
    </div>
  );
};
