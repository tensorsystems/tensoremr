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

import React, { useEffect, useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { IFileUploader, FileUploader } from "@tensoremr/ui-components";
import { useNotificationDispatch } from "@tensoremr/notification";
import { MutationSignupArgs, UserInput } from "@tensoremr/models";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../_context/AuthContextProvider";

const SIGN_UP = gql`
  mutation SignUp($input: UserInput!) {
    signup(input: $input) {
      id
    }
  }
`;
interface Props {
  onSuccess: () => void;
}

export const UserRegistrationForm: React.FC<Props> = ({ onSuccess }) => {
  const notifDispatch = useNotificationDispatch();
  const [userTypes, setUserTypes] = useState<Array<string>>([
    "admin",
    "nurse",
    "optical assistant",
    "optometrist",
    "pharmacist",
    "physician",
  ]);

  const [signatures, setSignatures] = useState<Array<IFileUploader>>();
  const [profilePictures, setProfilePictures] =
    useState<Array<IFileUploader>>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserInput>();
  const password = useRef({});
  password.current = watch("password", "");

  const [signup] = useMutation<any, MutationSignupArgs>(SIGN_UP, {
    onCompleted(data) {
      onSuccess();
    },
    onError(error) {
      notifDispatch({
        type: "showNotification",
        notifTitle: "Error",
        notifSubTitle: error.message,
        variant: "failure",
      });
    },
  });

  const onSubmit = (user: UserInput) => {
    if (signatures && signatures?.length > 0) {
      const file = {
        file: signatures[0].fileObject,
        name: signatures[0].name,
      };

      user.signature = file;
    }

    if (profilePictures && profilePictures?.length > 0) {
      const file = {
        file: profilePictures[0].fileObject,
        name: profilePictures[0].name,
      };

      user.profilePic = file;
    }

    signup({
      variables: {
        input: user,
      },
    });

    /*fetch(`${import.meta.env.VITE_APP_SERVER_URL}/signup`, {
      method: "POST",
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }

        return res.json();
      })
      .then((data) => {
        onSuccess();
        history.replace("/");
      })
      .catch((error) => {
        error.json().then((data: any) => {
          notifDispatch({
            type: "show",
            notifTitle: "Error",
            notifSubTitle: data.message,
            variant: "failure",
          });
        });
      });*/
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
          Create Account
        </p>

        <div className="grid grid-cols-2 gap-16 mt-10">
          <div>
            <p className="text-lg font-semibold tracking-wide text-gray-700 uppercase">
              Basic Information
            </p>
            <hr />
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12">
                <label
                  htmlFor="userTypeIds"
                  className="block text-sm font-medium text-gray-700"
                >
                  Account Type
                </label>
                <select
                  required
                  {...register("userTypeIds", { required: true })}
                  className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {userTypes.map((e: any) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="namePrefix"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prefix
                </label>
                <input
                  required
                  type="text"
                  id="namePrefix"
                  placeholder="Prefix"
                  {...register("namePrefix", { required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-5">
                <label
                  htmlFor="givenName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Given name
                </label>
                <input
                  required
                  type="text"
                  id="givenName"
                  placeholder="Given Name"
                  {...register("givenName", { required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-5">
                <label
                  htmlFor="familyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Family name
                </label>
                <input
                  required
                  type="text"
                  id="familyName"
                  placeholder="Family Name"
                  {...register("familyName", { required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <hr className="col-span-12" />

              <div className="col-span-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  required
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Number
                </label>
                <input
                  required
                  id="contactNumber"
                  type="contactNumber"
                  placeholder="Contact number"
                  {...register("email", {
                    required: true,
                  })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  required
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password", {
                    required: true,
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  required
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              {errors.password && <p>{errors.password.message}</p>}

              <div className="col-span-12 py-3 mt-2 bg-gray-50 text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="ml-2">Register</span>
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
                accept={"image"}
                values={signatures}
                onAdd={handleSignatureChange}
                onDelete={() => setSignatures([])}
                onError={(message) => {
                  notifDispatch({
                    type: "showNotification",
                    notifTitle: "Error",
                    notifSubTitle: message,
                    variant: "failure",
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
                accept={"image"}
                values={profilePictures}
                onAdd={handleProfilePictureChange}
                onDelete={() => setProfilePictures([])}
                onError={(message) => {
                  notifDispatch({
                    type: "showNotification",
                    notifTitle: "Error",
                    notifSubTitle: message,
                    variant: "failure",
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
