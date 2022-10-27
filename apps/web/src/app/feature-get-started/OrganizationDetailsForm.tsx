import {
  LibraryIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  MapIcon,
  OfficeBuildingIcon,
} from '@heroicons/react/solid';
import { Button } from '@tensoremr/ui-components';
import { Label, TextInput, Select } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { Record } from 'pocketbase';
import { useEffect } from 'react';

interface Props {
  defaultValues?: Record;
  isLoading: boolean;
  onSubmit: (input: any) => void;
  organizationTypes?: Array<Record>;
}

function OrganizationDetailsForm(props: Props) {
  const { organizationTypes, defaultValues, isLoading, onSubmit } = props;
  const { register, setValue, handleSubmit } = useForm();

  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.name);
      setValue('type', defaultValues.type);
      setValue('contactNumber', defaultValues.telecom.value);
      setValue('email', defaultValues.email.value);
      setValue('country', defaultValues.address.country);
      setValue('state', defaultValues.address.state);
      setValue('district', defaultValues.address.district);
      setValue('city', defaultValues.address.city);
      setValue('streetAddress', defaultValues.address.line);
      setValue('streetAddress2', defaultValues.address.line2);
    }
  }, [defaultValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 mt-5 gap-x-6 gap-y-2">
        <div>
          <div className="block">
            <Label htmlFor="name" value="Organization Name" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            id="name"
            name="name"
            type="text"
            ref={register({ required: true })}
            required
            placeholder="ABC Hospital"
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="type" value="Organization Type" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <Select
            required
            id="type"
            name="type"
            icon={LibraryIcon}
            ref={register({ required: true })}
          >
            {organizationTypes?.map((type) => (
              <option value={type.id} key={type.id}>
                {type.display}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="block">
            <Label htmlFor="contactNumber" value="Contact Number" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="contactNumber"
            type="tel"
            name="contactNumber"
            placeholder="0911111111"
            icon={PhoneIcon}
            ref={register({ required: true })}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="email" value="Contact Email" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="email"
            type="email"
            name="email"
            placeholder="info@organization.org"
            icon={MailIcon}
            ref={register({ required: true })}
          />
        </div>
      </div>

      <hr className="my-5" />

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <div>
          <div className="block">
            <Label htmlFor="country" value="Country" />{' '}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="country"
            name="country"
            type="text"
            placeholder="Country"
            icon={GlobeIcon}
            ref={register({ required: true })}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="state" value="State" />
          </div>
          <TextInput
            id="state"
            name="state"
            type="text"
            placeholder="State"
            icon={MapIcon}
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="district" value="District" />
          </div>
          <TextInput
            id="district"
            name="district"
            type="text"
            placeholder="District"
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="city" value="City" />
          </div>
          <TextInput
            id="city"
            name="city"
            type="text"
            placeholder="City"
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="streetAddress" value="Street Address" />
          </div>
          <TextInput
            id="streetAddress"
            name="streetAddress"
            type="text"
            icon={OfficeBuildingIcon}
            ref={register}
          />
        </div>
        <div>
          <div className="block">
            <Label htmlFor="streetAddress2" value="Street Address 2" />
          </div>
          <TextInput
            id="streetAddress2"
            name="streetAddress2"
            type="text"
            icon={OfficeBuildingIcon}
            ref={register}
          />
        </div>
      </div>
      <div className="mt-5">
        <Button
          pill={true}
          loadingText={'Loading'}
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
