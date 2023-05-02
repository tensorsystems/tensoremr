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

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useNotificationDispatch } from "@tensoremr/notification";
import { createUser, getOneUser, updateUser } from "../../../api";
import { AxiosError } from "axios";
import { toBase64 } from "../../../util";
import { Spinner } from "flowbite-react";
import Button from "../../../components/button";
import { FileUploader, IFileUploader } from "../../../components/file-uploader";
import { useSWRConfig } from "swr";
import { CreateUserInput, UpdateUserInput } from "../../../payload";

interface Props {
  updateId?: string;
  onSuccess: () => void;
}

const userTypes: Array<string> = [
  "ict",
  "nurse",
  "optical assistant",
  "optometrist",
  "pharmacist",
  "doctor",
  "receptionist",
];

const CreateUserForm: React.FC<Props> = ({ updateId, onSuccess }) => {
  const notifDispatch = useNotificationDispatch();
  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [signatures, setSignatures] = useState<Array<IFileUploader>>();
  const [profilePictures, setProfilePictures] =
    useState<Array<IFileUploader>>();
  const [error, setError] = useState<string>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateUserInput | UpdateUserInput>();
  const password = useRef({});
  password.current = watch("password", "");

  useEffect(() => {
    if (updateId) {
      setIsUserLoading(true);
      getOneUser(updateId)
        .then((resp) => {
          const data = resp.data;

          setValue("id", data.id);
          setValue("email", data?.traits.email);
          setValue("enabled", data.enabled);
          setValue("givenName", data.traits?.name?.given ?? "");
          setValue("namePrefix", data.traits?.name?.prefix ?? "");
          setValue("familyName", data.traits?.name?.family ?? "");
          setValue("role", data.traits?.role);
          setValue("contactNumber", data.traits?.contactNumber ?? "");
          setIsUserLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsUserLoading(false);
        });
    }
  }, [updateId]);

  const onSubmit = async (user: CreateUserInput | UpdateUserInput) => {
    setIsLoading(true);
    if (profilePictures && profilePictures?.length > 0) {
      if (profilePictures[0].fileObject) {
        user.profiePicture = (await toBase64(
          profilePictures[0].fileObject
        )) as string;
      }
    }

    if (signatures && signatures?.length > 0) {
      if (signatures[0].fileObject) {
        user.signature = (await toBase64(signatures[0].fileObject)) as string;
      }
    }

    try {
      if (updateId) {
        await mutate("updateUser", updateUser(user as UpdateUserInput));
      } else {
        await mutate("createUser", createUser(user as CreateUserInput));
      }

      onSuccess();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error", error);
        if (error.response?.data) {
          setError(error.response?.data);
        }
      }
    }

    setIsLoading(false);
  };

  console.log("Error", error);

  const handleSignatureChange = (change: Array<IFileUploader>) => {
    setSignatures(change);
  };

  const handleProfilePictureChange = (change: Array<IFileUploader>) => {
    setProfilePictures(change);
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center w-full">
        <Spinner color="warning" aria-label="Button loading" />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="mt-2 text-3xl text-gray-800 font-bold tracking-wide">
          {updateId ? "Update Account" : "Create Account"}
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
                  {...register("role", { required: true })}
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
                  Name Prefix
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
                  {...register("contactNumber", {
                    required: true,
                  })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md bg-gray-100 border-gray-300 border rounded-md"
                />
              </div>

              {error && <p className="text-red-500 col-span-12">{error}</p>}

              <div className="col-span-12 py-3 mt-2 bg-gray-50 text-right">
                <Button
                  loading={isLoading}
                  type="submit"
                  loadingText={"Saving"}
                  text={updateId ? "Update" : "Register"}
                  icon="save"
                  variant="filled"
                  disabled={false}
                  onClick={() => null}
                />
              </div>
            </div>
          </div>

          <div className="px-7">
            <div>
              <p className="text-lg font-semibold tracking-wide text-gray-700 uppercase">
                Files
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

export default CreateUserForm;
