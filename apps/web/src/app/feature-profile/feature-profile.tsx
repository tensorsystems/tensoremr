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

import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FileUploader, IFileUploader } from '@tensoremr/ui-components';
import { XIcon } from '@heroicons/react/outline';
import {
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  ChangePasswordInput,
  MutationChangePasswordArgs,
  MutationUpdateUserArgs,
  Query,
  QueryUserArgs,
} from '@tensoremr/models';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { useNotificationDispatch } from '@tensoremr/notification';
import { ProfileTabs, Tabs } from '@tensoremr/ui-components';
import ReactLoading from 'react-loading';
import { useForm } from 'react-hook-form';
import { getFileUrl } from '@tensoremr/util';

const customStyles = {
  content: {
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    padding: 40,
    border: 'none',
    backgroundColor: 'white',
    borderRadius: 20,
    zIndex: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(40px)',
    zIndex: 20,
  },
};

const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      active
      createdAt
      userTypes {
        id
        title
      }
      signature {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
      profilePic {
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

const UPDATE_USER = gql`
  mutation UpdateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      id
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      id
    }
  }
`;

export const ProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();

  const notifDispatch = useNotificationDispatch();
  const history = useHistory();

  const [signatures, setSignatures] = useState<Array<IFileUploader>>();
  const [profilePictures, setProfilePictures] =
    useState<Array<IFileUploader>>();
  const [tabValue, setTabValue] = useState('Files');

  const match = useRouteMatch();

  const { data } = useQuery<Query, QueryUserArgs>(GET_USER, {
    variables: {
      id: profileId,
    },
  });

  const { register, handleSubmit, reset } = useForm<ChangePasswordInput>();

  const [updateUser, updateUserResult] = useMutation<
    any,
    MutationUpdateUserArgs
  >(UPDATE_USER, {
    onCompleted(data) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'User info updated successfully',
        variant: 'success',
      });
    },
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const [changePassword, changePasswordResult] = useMutation<
    any,
    MutationChangePasswordArgs
  >(CHANGE_PASSWORD, {
    onCompleted(data) {
      reset();
      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'Password changed successfully',
        variant: 'success',
      });
    },
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  useEffect(() => {
    const user = data?.user;

    if (user?.signature) {
      const fileUrl = getFileUrl({
        baseUrl: process.env['NX_APP_SERVER_URL'],
        fileName: user?.signature.fileName,
        hash: user?.signature.hash,
        extension: user?.signature.extension,
      });

      const sig = {
        id: user?.signature.id,
        fileUrl: fileUrl,
        name: user?.signature.fileName ?? '',
        size: user?.signature.size,
        createdAt: user?.signature.createdAt,
        contentType: user?.signature.contentType ?? '',
      };

      setSignatures([sig]);
    }

    if (user?.profilePic) {
      const fileUrl = getFileUrl({
        baseUrl: process.env['NX_APP_SERVER_URL'],
        fileName: user?.profilePic.fileName,
        hash: user?.profilePic.hash,
        extension: user?.profilePic.extension,
      });

      const profilePic = {
        id: user?.profilePic.id,
        fileUrl: fileUrl,
        name: user?.profilePic.fileName ?? '',
        size: user?.profilePic.size,
        createdAt: user?.profilePic.createdAt,
        contentType: user?.profilePic.contentType ?? '',
      };

      setProfilePictures([profilePic]);
    }
  }, [data?.user]);

  const handleSignatureChange = (change: Array<IFileUploader>) => {
    setSignatures(change);
  };

  const handleProfilePictureChange = (change: Array<IFileUploader>) => {
    setProfilePictures(change);
  };

  const onFileSubmit = () => {
    const user: any = {
      id: data?.user.id,
      firstName: data?.user.firstName,
      lastName: data?.user.lastName,
      email: data?.user.email,
      userTypeIds: data?.user.userTypes.map((e) => e?.id),
      active: data?.user.active === true,
    };

    if (
      data?.user &&
      signatures &&
      signatures.length > 0 &&
      signatures[0].fileObject
    ) {
      const file = {
        file: signatures[0].fileObject,
        name: signatures[0].name,
      };

      user.signature = file;
    }

    if (
      data?.user &&
      profilePictures &&
      profilePictures.length > 0 &&
      profilePictures[0].fileObject
    ) {
      const file = {
        file: profilePictures[0].fileObject,
        name: profilePictures[0].name,
      };

      user.profilePic = file;
    }

    updateUser({
      variables: {
        input: user,
      },
    });
  };

  const onChangePassword = (input: ChangePasswordInput) => {
    changePassword({
      variables: {
        input,
      },
    });
  };

  return (
    <div>
      <Modal isOpen={true} style={customStyles}>
        <div className="flex justify-between">
          <p className="text-4xl font-bold text-gray-800">{`${data?.user.firstName} ${data?.user.lastName}`}</p>
          <button
            type="button"
            onClick={() => {
              history.goBack();
            }}
          >
            <XIcon className="w-10 h-10 text-gray-700" />
          </button>
        </div>
        <hr className="border-teal-500 mt-5" />

        <div className="flex mt-5 space-x-3">
          <p className="material-icons text-teal-800">work</p>
          <p className="font-semibold">
            {data?.user.userTypes.map((e) => e?.title).join(', ')}
          </p>
        </div>

        <div className="flex mt-2 space-x-3">
          <p className="material-icons text-teal-800">mail</p>
          <p className="font-semibold">{data?.user.email}</p>
        </div>

        <div className="flex mt-2 space-x-3">
          <p className="material-icons text-teal-800">schedule</p>
          <p className="font-semibold">
            {data?.user.createdAt &&
              format(parseISO(data?.user.createdAt), 'MMM d, y')}
          </p>
        </div>

        <div className="mt-5">
          <ul className="list-reset flex border-b">
            <Tabs
              value={tabValue}
              onChange={(value: string) => setTabValue(value)}
              tabs={ProfileTabs}
            />
          </ul>
        </div>

        <Switch>
          <Route path={`${match.path}/files`}>
            <div className="mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-5">
                  Your signature
                </label>
                <FileUploader
                  multiSelect={false}
                  accept={'image'}
                  values={signatures}
                  onAdd={handleSignatureChange}
                  onDelete={() => setSignatures([])}
                  onError={(message) =>
                    notifDispatch({
                      type: 'show',
                      notifTitle: 'Error',
                      notifSubTitle: message,
                      variant: 'failure',
                    })
                  }
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
                  onError={(message) =>
                    notifDispatch({
                      type: 'show',
                      notifTitle: 'Error',
                      notifSubTitle: message,
                      variant: 'failure',
                    })
                  }
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
                  onClick={() => onFileSubmit()}
                >
                  {updateUserResult.loading ? (
                    // @ts-ignore
                    <ReactLoading
                      type={'cylon'}
                      color={'white'}
                      height={30}
                      width={30}
                      className="inline-block"
                    />
                  ) : (
                    <p>Save</p>
                  )}
                </button>
              </div>
            </div>
          </Route>
          <Route path={`${match.path}/password`}>
            <form className="mt-5" onSubmit={handleSubmit(onChangePassword)}>
              <div className="mt-4">
                <input
                  required
                  type="password"
                  ref={register({ required: true })}
                  name="previousPassword"
                  placeholder="Old password"
                  className="border rounded-md w-full border-gray-200"
                />
              </div>

              <div className="mt-4">
                <input
                  required
                  type="password"
                  ref={register({ required: true })}
                  name="password"
                  placeholder="New password"
                  className="border rounded-md w-full border-gray-200"
                />
              </div>
              <div className="mt-4">
                <input
                  required
                  type="password"
                  ref={register({ required: true })}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  className="border rounded-md w-full border-gray-200"
                />
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
                >
                  {changePasswordResult.loading ? (
                    // @ts-ignore
                    <ReactLoading
                      type={'cylon'}
                      color={'white'}
                      height={30}
                      width={30}
                      className="inline-block"
                    />
                  ) : (
                    <p>Change password</p>
                  )}
                </button>
              </div>
            </form>
          </Route>
        </Switch>
      </Modal>
    </div>
  );
};
