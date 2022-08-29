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

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { IFileUploader, FileUploader } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  MutationResetPasswordArgs,
  MutationUpdateUserArgs,
  User,
} from '@tensoremr/models';
import { gql, useMutation } from '@apollo/client';
import { getFileUrl } from '@tensoremr/util';

const UPDATE_USER = gql`
  mutation UpdateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      id
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($id: ID!) {
    resetPassword(id: $id) {
      id
    }
  }
`;

interface Props {
  values: User;
  onSuccess: () => void;
  onResetSuccess: () => void;
}

export const UserUpdateForm: React.FC<Props> = ({
  values,
  onSuccess,
  onResetSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const [userTypes, setUserTypes] = useState([]);
  const [signatures, setSignatures] = useState<Array<IFileUploader>>();
  const [profilePictures, setProfilePictures] =
    useState<Array<IFileUploader>>();
  const { register, handleSubmit, watch, reset } = useForm<any>();
  const password = useRef({});
  password.current = watch('password', '');

  useEffect(() => {
    reset({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      userTypeIds: values.userTypes.map((e) => e?.id.toString()),
      active: values.active,
    });

    if (values.signature) {
      const sig = {
        id: values?.signature.id,
        fileUrl: getFileUrl({
          baseUrl: process.env['NX_APP_SERVER_URL'],
          fileName: values?.signature.fileName,
          hash: values?.signature.hash,
          extension: values?.signature.extension,
        }),
        name: values?.signature.fileName ?? '',
        size: values?.signature.size,
        createdAt: values?.signature.createdAt,
        contentType: values?.signature.contentType ?? '',
      };

      setSignatures([sig]);
    }

    if (values.profilePic) {
      const profilePic = {
        id: values?.profilePic.id,
        fileUrl: getFileUrl({
          baseUrl: process.env['NX_APP_SERVER_URL'],
          fileName: values?.profilePic.fileName,
          hash: values?.profilePic.hash,
          extension: values?.profilePic.extension,
        }),
        name: values?.profilePic.fileName ?? '',
        size: values?.profilePic.size,
        createdAt: values?.profilePic.createdAt,
        contentType: values?.profilePic.contentType ?? '',
      };

      setProfilePictures([profilePic]);
    }
  }, [values, userTypes]);

  const [update, { error }] = useMutation<any, MutationUpdateUserArgs>(
    UPDATE_USER,
    {
      onCompleted(data) {
        onSuccess();
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const [resetPassword] = useMutation<any, MutationResetPasswordArgs>(
    RESET_PASSWORD,
    {
      onCompleted(data) {
        onResetSuccess();
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  useEffect(() => {
    fetch(`${process.env['NX_APP_SERVER_URL']}/userTypes`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setUserTypes(data);
      })
      .catch((error) => {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      });
  }, []);

  const onSubmit = (user: any) => {
    user.id = values.id;

    if (signatures && signatures?.length > 0 && signatures[0].fileObject) {
      const file = {
        file: signatures[0].fileObject,
        name: signatures[0].name,
      };

      user.signature = file;
    }

    if (
      profilePictures &&
      profilePictures?.length > 0 &&
      profilePictures[0].fileObject
    ) {
      const file = {
        file: profilePictures[0].fileObject,
        name: profilePictures[0].name,
      };

      user.profilePic = file;
    }

    user.active = user.active === 'true';

    update({
      variables: {
        input: user,
      },
    });
  };

  const handleSignatureChange = (change: Array<IFileUploader>) => {
    setSignatures(change);
  };

  const handleProfilePictureChange = (change: Array<IFileUploader>) => {
    setProfilePictures(change);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="mt-2 text-3xl text-gray-800 font-bold tracking-wide">
          Update
        </p>

        <div className="grid grid-cols-2 gap-16 mt-10">
          <div>
            <p className="text-lg font-semibold tracking-wide text-gray-700 uppercase">
              Basic Information
            </p>
            <hr />
            <div className="grid grid-cols-2 gap-6 mt-5">
              <div className="col-span-2 sm:col-span-2">
                <label
                  htmlFor="active"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  name="active"
                  required
                  ref={register({ required: true })}
                  className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value={'true'}>Active</option>
                  <option value={'false'}>Inactive</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <label
                  htmlFor="userTypeIds"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Type
                </label>
                <select
                  name="userTypeIds"
                  required
                  multiple
                  ref={register({ required: true })}
                  className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {userTypes.map((e: any) => (
                    <option key={e.ID} value={e.ID}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 sm:col-span-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  ref={register({ required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-1 sm:col-span-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  ref={register({ required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-2 sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  ref={register({
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-2 sm:col-span-2">
                {error && (
                  <p className="text-red-600">Error: {error.message}</p>
                )}
              </div>

              <div className="col-span-1 sm:col-span-1">
                <button
                  type="button"
                  className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    resetPassword({
                      variables: {
                        id: values.id,
                      },
                    });
                  }}
                >
                  <span className="ml-2">Reset Password</span>
                </button>
              </div>

              <div className="col-span-1 sm:col-span-1 bg-gray-50 text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="ml-2">Update</span>
                </button>
              </div>
            </div>
          </div>

          <div className="px-7">
            <div>
              <p className="text-lg font-semibold tracking-wide text-gray-700 uppercase">
                Documents
              </p>
              <hr />
              <label className="block text-sm font-medium text-gray-700 mt-5">
                Your signature
              </label>
              <FileUploader
                multiSelect={false}
                accept={'image'}
                values={signatures}
                onAdd={handleSignatureChange}
                onDelete={() => setSignatures([])}
                onError={(message) => {
                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Error',
                    notifSubTitle: message,
                    variant: 'failure',
                  });
                }}
              />
            </div>

            <div className="col-span-2 sm:col-span-2 mt-10">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <FileUploader
                multiSelect={false}
                accept={'image'}
                values={profilePictures}
                onAdd={handleProfilePictureChange}
                onDelete={() => setProfilePictures([])}
                onError={(message) => {
                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Error',
                    notifSubTitle: message,
                    variant: 'failure',
                  });
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
