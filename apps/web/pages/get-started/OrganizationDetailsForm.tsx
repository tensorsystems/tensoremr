import {
  LibraryIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  MapIcon,
  OfficeBuildingIcon,
} from "@heroicons/react/solid";
import Button from "../../components/button";
import { Label, TextInput, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Coding, Organization } from "fhir/r4";

interface Props {
  defaultValues?: Organization;
  isLoading: boolean;
  onSubmit: (input: any) => void;
  organizationTypes?: Array<Coding>;
}

function OrganizationDetailsForm(props: Props) {
  const { organizationTypes, defaultValues, isLoading, onSubmit } = props;
  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name);

      const type = defaultValues.type?.at(0)?.coding?.at(0)?.code;
      if(type) {
        setValue("type", type);
      }
     

      const contactNumber = defaultValues.telecom?.find(
        (e) => e.system === "phone"
      );

      if (contactNumber) {
        setValue("contactNumber", contactNumber.value);
      }

      const email = defaultValues.telecom?.find((e) => e.system === "email");
      if (email) {
        setValue("email", email.value);
      }

      if (defaultValues.address) {
        setValue("country", defaultValues.address[0].country);
        setValue("state", defaultValues.address[0].state);
        setValue("district", defaultValues.address[0].district);
        setValue("city", defaultValues.address[0].city);
        setValue("streetAddress", defaultValues.address[0].line?.at(0));
        setValue("streetAddress2", defaultValues.address[0].line?.at(1));
      }
    }
  }, [defaultValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 mt-5 gap-x-6 gap-y-2">
        <div>
          <div className="block">
            <Label htmlFor="name" value="Organization Name" />{" "}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="name"
            type="text"
            {...register("name", { required: true })}
            placeholder="ABC Hospital"
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="type" value="Organization Type" />{" "}
            <span className="text-red-600">*</span>
          </div>
          <Select
            required
            id="type"
            icon={LibraryIcon}
            {...register("type", { required: true })}
          >
            {organizationTypes?.map((type) => (
              <option value={type.code} key={type.code}>
                {type.display}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="block">
            <Label htmlFor="contactNumber" value="Contact Number" />{" "}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="contactNumber"
            type="tel"
            placeholder="0911111111"
            icon={PhoneIcon}
            {...register("contactNumber", { required: true })}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="email" value="Contact Email" />{" "}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="email"
            type="email"
            placeholder="info@organization.org"
            icon={MailIcon}
            {...register("email", { required: true })}
          />
        </div>
      </div>

      <hr className="my-5" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div>
          <div className="block">
            <Label htmlFor="country" value="Country" />{" "}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="country"
            type="text"
            placeholder="Country"
            icon={GlobeIcon}
            {...register("country", { required: true })}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="state" value="State" />
          </div>
          <TextInput
            id="state"
            type="text"
            placeholder="State"
            icon={MapIcon}
            {...register("state")}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="district" value="District" />
          </div>
          <TextInput
            type="text"
            id="district"
            placeholder="District"
            {...register("district")}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="city" value="City" />
          </div>
          <TextInput
            id="city"
            type="text"
            placeholder="City"
            {...register("city")}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="streetAddress" value="Street Address" />
          </div>
          <TextInput
            type="text"
            id="streetAddress"
            icon={OfficeBuildingIcon}
            {...register("streetAddress")}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="streetAddress2" value="Street Address 2" />
          </div>
          <TextInput
            type="text"
            id="streetAddress2"
            icon={OfficeBuildingIcon}
            {...register("streetAddress2")}
          />
        </div>
      </div>
      <div className="mt-5">
        <Button
          pill={true}
          loadingText={"Loading"}
          loading={isLoading}
          type="submit"
          text="Save"
          icon="save"
          variant="filled"
        />
      </div>
    </form>
  );
}

export default OrganizationDetailsForm;
