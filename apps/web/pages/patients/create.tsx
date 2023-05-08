import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IFileUploader } from "../../components/file-uploader";
import useSWR from "swr";
import {
  createPatient,
  getAdministrativeGenders,
  getMartialStatuses,
  getPatientContactRelationships,
  searchPatients,
  updatePatient,
} from "../../api";
import {
  CalendarIcon,
  CalculatorIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { MenuComponent } from "../../components/menu-component";
import cn from "classnames";
import { Menu } from "@headlessui/react";
import Button from "../../components/button";
import useSWRMutation from "swr/mutation";
import { Patient, PatientContact } from "fhir/r4";
import { format, subMonths, subYears } from "date-fns";
import MyBreadcrumb from "../../components/breadcrumb";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function NewPatient() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>();
  const router = useRouter();

  // State
  const [updateId, setUpdateId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ageInput, setAgeInput] = useState<"default" | "manual" | "months">(
    "default"
  );
  const [scheduleOnSave, setScheduleSave] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Array<IFileUploader>>([]);
  const [paperRecordDocument, setPaperRecordDocument] = useState<
    Array<IFileUploader>
  >([]);
  const [similarPatients, setSimilarPatients] = useState<Array<Patient>>([]);
  const [ignoreSimilarPatients, setIgnoreSimilarPatients] =
    useState<boolean>(false);

  const [telecomsCount, setTelecomsCount] = useState<number>(1);
  const [addressesCount, setAddressesCount] = useState<number>(1);
  const [contactsCount, setContactsCount] = useState<number>(0);

  useEffect(() => {
    if (telecomsCount > 1) {
      document.getElementById("telecom:" + (telecomsCount - 1))?.focus();
    }
  }, [telecomsCount]);

  useEffect(() => {
    if (addressesCount > 1) {
      document.getElementById("address:" + (addressesCount - 1))?.focus();
    }
  }, [addressesCount]);

  useEffect(() => {
    if (contactsCount > 1) {
      document.getElementById("contact:" + (contactsCount - 1))?.focus();
    }
  }, [contactsCount]);

  // Query
  const gendersQuery = useSWR("genders", () => getAdministrativeGenders());
  const martialStatusQuery = useSWR("martialStatuses", () =>
    getMartialStatuses()
  );
  const contactRelationshipsQuery = useSWR("patientContactRelationships", () =>
    getPatientContactRelationships()
  );

  // Mutations
  const createPatientMutation = useSWRMutation("patients", (key, { arg }) =>
    createPatient(arg)
  );
  const updatePatientMutation = useSWRMutation("patients", (key, { arg }) =>
    updatePatient(arg)
  );

  const fetchUpdatePatient = async (updateId: string) => {
    // TO-DO
  };

  const findSimilarPatients = async (data: any) => {
    try {
      const params = `given=${data.nameGiven}&family=${data.nameFamily}`;
      const result: Patient[] =
        (await searchPatients(params)).data?.entry?.map(
          (e) => e.resource as Patient
        ) ?? [];

      if (result.length > 0) {
        setSimilarPatients(result);
        return true;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }

    return false;
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    if (!ignoreSimilarPatients) {
      if (data.nameGiven && data.nameFamily) {
        const hasSimilarPatients = await findSimilarPatients(data);
        if (hasSimilarPatients) {
          setIsLoading(false);
          return;
        }
      }
    }

    // Date of birth
    let dateOfBirth = data.birthDate;
    if (ageInput === "manual") {
      dateOfBirth = subYears(new Date(), data.birthDate as number);
    } else if (ageInput === "months") {
      dateOfBirth = subMonths(new Date(), data.birthDate as number);
    }

    // Gender
    const gender = gendersQuery?.data?.data.expansion?.contains.find(
      (e) => e.code === data.gender
    )?.code;

    // Martial Status
    const martialStatus =
      martialStatusQuery?.data?.data.expansion?.contains.find(
        (e) => e.code === data.martialStatus
      );

    // Contacts
    const contacts: PatientContact[] = [];
    if (data.contact?.length > 0) {
      data.contact.forEach((e) => {
        const relationship =
          contactRelationshipsQuery?.data?.data.expansion?.contains.find(
            (r) => r.code === e.relationship
          );

        const contact: PatientContact = {
          relationship: relationship
            ? [
                {
                  coding: [
                    {
                      code: relationship.code,
                      display: relationship.display,
                      system: relationship.system,
                    },
                  ],
                  text: relationship.display,
                },
              ]
            : undefined,
          name: e.name ? e.name : undefined,
          telecom: [e.telecom ? e.telecom : undefined],
          address: e.address ? e.address : undefined,
        };
        contacts.push(contact);
      });
    }

    // Telecoms
    const telecoms = data.telecom?.filter((e) => e.value !== "");

    const patient: Patient = {
      resourceType: "Patient",
      active: true,
      name:
        data.nameGiven && data.nameFamily
          ? [
              {
                given: [
                  data.nameGiven?.charAt(0).toUpperCase() +
                    data.nameGiven?.slice(1).toLowerCase(),
                ],
                family:
                  data.nameFamily?.charAt(0).toUpperCase() +
                  data.nameFamily?.slice(1).toLowerCase(),
              },
            ]
          : undefined,
      telecom: telecoms
        ? telecoms?.map((e) => ({ ...e, rank: parseInt(e.rank) }))
        : undefined,
      gender: gender,
      birthDate: dateOfBirth
        ? format(new Date(dateOfBirth), "yyyy-MM-dd")
        : undefined,
      deceasedBoolean: data.deceased === "true",
      address: data.address?.map((e) => ({
        city: e.city?.length > 0 ? e.city : undefined,
        country: e.country?.length > 0 ? e.country : undefined,
        district: e.district?.length > 0 ? e.district : undefined,
        postalCode: e.postalCode?.length > 0 ? e.postalCode : undefined,
        state: e.state?.length > 0 ? e.state : undefined,
        text: e.text?.length > 0 ? e.text : undefined,
        type: e.type?.length > 0 ? e.type : undefined,
        use: e.use?.length > 0 ? e.use : undefined,
        line: e?.line?.filter((e) => e.length > 0) ?? undefined,
      })),
      maritalStatus: martialStatus
        ? {
            coding: [
              {
                code: martialStatus.code,
                display: martialStatus.display,
                system: martialStatus.system,
              },
            ],
            text: martialStatus.display,
          }
        : undefined,
      contact: contacts,
    };

    try {
      const result = await createPatientMutation.trigger(patient);

      toast.success(
        `Patient  ${data.nameGiven} ${data.nameFamily} has been saved successfully`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );

      resetAll();

      router.replace(`/patients/${result?.data?.id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }

    setIsLoading(false);
  };

  const resetAll = () => {
    reset();
    setAgeInput("default");
    setDocuments([]);
    setPaperRecordDocument([]);
    setScheduleSave(false);
    setSimilarPatients([]);
    setIgnoreSimilarPatients(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MyBreadcrumb
        crumbs={[
          { href: "/", title: "Home", icon: "home" },
          { href: "/patients", title: "Patients", icon: "group" },
          { href: "/patients/create", title: "Create", icon: "add" },
        ]}
      />
      <div className="bg-gray-50 p-4 rounded-md shadow-lg">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  General Info
                </h3>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 shadow-md">
              <div className="shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-2">
                      <label
                        htmlFor="nameGiven"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Given name
                      </label>
                      <input
                        id="nameGiven"
                        type="text"
                        {...register("nameGiven")}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="nameFamily"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Family name
                      </label>
                      <input
                        type="text"
                        id="nameFamily"
                        {...register("nameFamily")}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="namePrefix"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name prefix
                      </label>
                      <input
                        type="text"
                        id="namePrefix"
                        {...register("namePrefix")}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="birthDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        <span>
                          {ageInput === "default" && "Date of Birth"}
                          {ageInput === "manual" && "Age In Years"}
                          {ageInput === "months" && "Age In Months"}
                        </span>
                      </label>
                      <div className="flex mt-1">
                        <input
                          autoComplete="off"
                          type={ageInput === "default" ? "date" : "number"}
                          {...register("birthDate", { min: 0 })}
                          onWheel={(event) => event.currentTarget.blur()}
                          className="block w-full sm:text-md border-gray-300 border rounded-md rounded-r-none"
                        />
                        <MenuComponent
                          title={"Options"}
                          id={"dateOfBirthOptions"}
                          color={"bg-gray-500 text-white hover:bg-gray-600"}
                          rounded={"rounded-md rounded-l-none"}
                          menus={
                            <div className="px-1 py-1">
                              <Menu.Item>
                                <button
                                  type="button"
                                  className={`${
                                    ageInput === "default"
                                      ? "bg-teal-500 text-white"
                                      : "text-gray-900"
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                  onClick={() => setAgeInput("default")}
                                >
                                  <CalendarIcon
                                    className="w-5 h-5 mr-2 text-teal-700"
                                    aria-hidden="true"
                                  />
                                  Date of Birth
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  type="button"
                                  className={`${
                                    ageInput === "manual"
                                      ? "bg-teal-500 text-white"
                                      : "text-gray-900"
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                  onClick={() => setAgeInput("manual")}
                                >
                                  <CalculatorIcon
                                    className="w-5 h-5 mr-2 text-teal-700"
                                    aria-hidden="true"
                                  />
                                  Enter Age In Years
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  type="button"
                                  className={`${
                                    ageInput === "months"
                                      ? "bg-teal-500 text-white"
                                      : "text-gray-900"
                                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                  onClick={() => setAgeInput("months")}
                                >
                                  <CalculatorIcon
                                    className="w-5 h-5 mr-2 text-teal-700"
                                    aria-hidden="true"
                                  />
                                  Enter Age In Months
                                </button>
                              </Menu.Item>
                            </div>
                          }
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        {...register("gender")}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option></option>
                        {gendersQuery.data?.data.expansion?.contains.map(
                          (e) => (
                            <option key={e.code} value={e.code}>
                              {e.display}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="martialStatus"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Martial Status
                      </label>
                      <select
                        id="martialStatus"
                        {...register("martialStatus")}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option></option>
                        {martialStatusQuery.data?.data.expansion?.contains.map(
                          (e) => (
                            <option key={e.code} value={e.code}>
                              {e.display}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="deceased"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Deceased
                      </label>
                      <select
                        id="deceased"
                        {...register("deceased")}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value={"false"}>No</option>
                        <option value={"true"}>Yes</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Comment
                      </label>
                      <input
                        id="comment"
                        type="text"
                        {...register("comment")}
                        className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 flex space-x-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Telecom
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setTelecomsCount(telecomsCount + 1);
                  }}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2 ">
              {Array(telecomsCount)
                .fill(telecomsCount)
                .map((e, index) => (
                  <div
                    id={"telecom:" + index}
                    tabIndex={index}
                    key={index}
                    className={cn("overflow-scroll shadow-md", {
                      "mt-4": index !== 0,
                    })}
                  >
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <p className="text-sm text-gray-600">{`Telecom ${
                        index + 1
                      }`}</p>
                      <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="col-span-6">
                          <label
                            htmlFor="system"
                            className="block text-sm font-medium text-gray-700"
                          >
                            System
                          </label>
                          <select
                            id="telecomSystem"
                            {...register(`telecom.${index}.system`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="phone">Phone</option>
                            <option value="fax">Fax</option>
                            <option value="email">Email</option>
                            <option value="pager">Pager</option>
                            <option value="url">URL</option>
                            <option value="sms">SMS</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="value"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Value
                          </label>
                          <input
                            id="telecomValue"
                            type="text"
                            {...register(`telecom.${index}.value`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="telecomUse"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Use
                          </label>
                          <select
                            id="use"
                            {...register(`telecom.${index}.use`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6">
                          <label
                            htmlFor="telecomRank"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Rank
                          </label>
                          <select
                            id="rank"
                            {...register(`telecom.${index}.rank`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 flex space-x-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Address
                </h3>
                <button
                  type="button"
                  onClick={() => setAddressesCount(addressesCount + 1)}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {Array(addressesCount)
                .fill(addressesCount)
                .map((e, index) => (
                  <div
                    id={"address:" + index}
                    tabIndex={index}
                    key={index}
                    className={cn("overflow-scroll shadow-md", {
                      "mt-4": index !== 0,
                    })}
                  >
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <p className="text-sm text-gray-600">{`Address ${
                        index + 1
                      }`}</p>
                      <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Type
                          </label>
                          <select
                            id="addressType"
                            {...register(`address.${index}.type`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="postal">Postal</option>
                            <option value="physical">Physical</option>
                            <option value="both">Both</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressUse"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Use
                          </label>
                          <select
                            id="addressUse"
                            {...register(`address.${index}.use`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressText"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Text
                          </label>
                          <input
                            id="addressText"
                            type="text"
                            {...register(`address.${index}.text`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressLine"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Line
                          </label>
                          <input
                            id="addressLine"
                            type="text"
                            {...register(`address.${index}.line.0`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressLine2"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Line 2
                          </label>
                          <input
                            id="addressLine2"
                            type="text"
                            {...register(`address.${index}.line.1`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressCity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <input
                            id="addressCity"
                            type="text"
                            {...register(`address.${index}.city`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressDistrict"
                            className="block text-sm font-medium text-gray-700"
                          >
                            District
                          </label>
                          <input
                            id="addressDistrict"
                            type="text"
                            {...register(`address.${index}.district`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressState"
                            className="block text-sm font-medium text-gray-700"
                          >
                            State
                          </label>
                          <input
                            id="addressState"
                            type="text"
                            {...register(`address.${index}.state`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressPostalCode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Postal Code
                          </label>
                          <input
                            id="addressPostalCode"
                            type="text"
                            {...register(`address.${index}.postalCode`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="addressCountry"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country
                          </label>
                          <input
                            id="addressCountry"
                            type="text"
                            {...register(`address.${index}.country`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 flex space-x-2">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Contacts
                </h3>
                <button
                  type="button"
                  onClick={() => setContactsCount(contactsCount + 1)}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {Array(contactsCount)
                .fill(contactsCount)
                .map((e, index) => (
                  <div
                    id={"contact:" + index}
                    tabIndex={index}
                    key={index}
                    className={cn("overflow-scroll shadow-md", {
                      "mt-4": index !== 0,
                    })}
                  >
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <p className="text-sm text-gray-600">{`Contact ${
                        index + 1
                      }`}</p>
                      <div className="grid grid-cols-12 gap-6 mt-5">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="relationship"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Relationship
                          </label>
                          <select
                            id="relationship"
                            {...register(`contact.${index}.relationship`)}
                            className="mt-1 block w-full py-[6px] px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option></option>
                            {contactRelationshipsQuery.data?.data.expansion?.contains.map(
                              (e) => (
                                <option value={e?.code} key={e?.code}>
                                  {e?.display}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactGivenName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Given Name
                          </label>
                          <input
                            id="text"
                            type="text"
                            {...register(`contact.${index}.name.given`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactFamilyName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Family Name
                          </label>
                          <input
                            id="text"
                            type="text"
                            {...register(`contact.${index}.name.family`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactTelecomSystem"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Telecom System
                          </label>
                          <select
                            id="contactTelecomSystem"
                            {...register(`contact.${index}.telecom.system`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="phone">Phone</option>
                            <option value="fax">Fax</option>
                            <option value="email">Email</option>
                            <option value="pager">Pager</option>
                            <option value="url">URL</option>
                            <option value="sms">SMS</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactTelecomValue"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Telecom Value
                          </label>
                          <input
                            id="contactTelecomValue"
                            type="text"
                            {...register(`contact.${index}.telecom.value`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactTelecomValue"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Telecom Use
                          </label>
                          <select
                            id="contactTelecomValue"
                            {...register(`contact.${index}.telecom.use`)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressType"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Type
                          </label>
                          <select
                            id="contactAddressType"
                            {...register(`contact.${index}.address.type`)}
                            className="mt-1 block w-full py-[6px] px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="postal">Postal</option>
                            <option value="physical">Physical</option>
                            <option value="both">Both</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressUse"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Use
                          </label>
                          <select
                            id="contactAddressUse"
                            {...register(`contact.${index}.address.use`)}
                            className="mt-1 block w-full py-[6px] px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="temp">Temporary</option>
                            <option value="old">Old</option>
                            <option value="mobile">Mobile</option>
                          </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressText"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address
                          </label>
                          <input
                            id="contactAddressText"
                            type="text"
                            {...register(`contact.${index}.address.text`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressLine"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Line
                          </label>
                          <input
                            id="contactAddressLine"
                            type="text"
                            {...register(`contact.${index}.address.line.0`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressLine2"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Address Line 2
                          </label>
                          <input
                            id="contactAddressLine2"
                            type="text"
                            {...register(`contact.${index}.address.line.1`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressCity"
                            className="block text-sm font-medium text-gray-700"
                          >
                            City
                          </label>
                          <input
                            id="contactAddressCity"
                            type="text"
                            {...register(`contact.${index}.address.city`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressDistrict"
                            className="block text-sm font-medium text-gray-700"
                          >
                            District
                          </label>
                          <input
                            id="contactAddressDistrict"
                            type="text"
                            {...register(`contact.${index}.address.district`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressState"
                            className="block text-sm font-medium text-gray-700"
                          >
                            State
                          </label>
                          <input
                            id="contactAddressState"
                            type="text"
                            {...register(`contact.${index}.address.state`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressPostalCode"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Postal Code
                          </label>
                          <input
                            id="contactAddressPostalCode"
                            type="text"
                            {...register(`contact.${index}.address.postalCode`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="contactAddressCountry"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Country
                          </label>
                          <input
                            id="contactAddressCountry"
                            type="text"
                            {...register(`contact.${index}.address.country`)}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200"></div>
          </div>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1"></div>

          <div className="mt-5 md:mt-0 md:col-span-2 flex space-x-6">
            <div className="py-3 bg-gray-50 w-full">
              <div
                hidden={ignoreSimilarPatients || similarPatients.length === 0}
                className="mb-4 bg-yellow-100 p-3 rounded-md shadow-sm"
              >
                <div className="flex space-x-2 items-center  ml-4">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <p className="text-sm text-yellow-500 font-semibold">
                    Similar Patients Found
                  </p>
                </div>
                <div className="mt-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="">
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          MRN
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Phone Number
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-1 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Date of Birth
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {similarPatients.map((e) => {
                        const mrn =
                          e.identifier?.find((e) =>
                            e.type.coding.find((t) => t.code === "MR")
                          )?.value ?? "";
                        const name =
                          e.name?.map(
                            (e) => `${e.given.join(", ")}, ${e.family}`
                          ) ?? "";
                        const contactNumber =
                          e.telecom?.find((e) => e.system === "phone").value ??
                          "";

                        return (
                          <tr key={e.id} className="hover:bg-yellow-200">
                            <td className="px-6 py-2 text-sm text-yellow-800 underline cursor-pointer">
                              {mrn}
                            </td>
                            <td className="px-6 py-2 text-sm text-yellow-800">
                              {name}
                            </td>
                            <td className="px-6 py-2 text-sm text-yellow-800">
                              {contactNumber}
                            </td>
                            <td className="px-6 py-2 text-sm text-yellow-800">
                              {e.birthDate}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="ml-6 mt-2 underline">
                    <button
                      type="button"
                      onClick={() => {
                        setIgnoreSimilarPatients(true);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 rounded-sm px-4 text-yellow-200 shadow-sm"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              </div>

              <Button
                pill={true}
                loading={isLoading}
                loadingText={"Saving"}
                type="submit"
                text={"Save"}
                icon="save"
                variant="filled"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
