import { PhoneIcon, MailIcon, UserIcon } from "@heroicons/react/outline";
import { Button } from "@tensoremr/ui-components";
import { useForm } from "react-hook-form";
import { Label, Select, TextInput } from "flowbite-react";

interface Props {
  isLoading: boolean;
  onSubmit: (input: any) => void;
}

function AdminAccountForm(props: Props) {
  const { isLoading, onSubmit } = props;
  const { register, handleSubmit } = useForm();

  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <p className="font-semibold text-lg text-gray-700">
        Create Admin Account
      </p>
      <div className="flex space-x-5 items-center mt-5">
        <div className="w-full">
          <div className="block">
            <Label htmlFor="givenName" value="Given Name" />{" "}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="givenName"
            type="text"
            placeholder="Given Name"
            {...register("givenName", { required: true })}
          />
        </div>
        <div className="w-full">
          <div className="block">
            <Label htmlFor="familyName" value="Family name" />{" "}
            <span className="text-red-600">*</span>
          </div>
          <TextInput
            required
            id="familyName"
            type="text"
            placeholder="Family name"
            {...register("familyName", { required: true })}
          />
        </div>
      </div>
      <div className="mt-3">
        <div className="block">
          <Label htmlFor="email" value="Admin Email" />{" "}
          <span className="text-red-600">*</span>
        </div>
        <TextInput
          required
          id="email"
          type="email"
          icon={MailIcon}
          placeholder="Email"
          {...register("email", { required: true })}
        />
      </div>

      <div className="mt-3">
        <div></div>
        <div className="block">
          <Label htmlFor="contactNumber" value="Contact Number" />{" "}
          <span className="text-red-600">*</span>
        </div>
        <TextInput
          required
          type="tel"
          id="contactNumber"
          icon={PhoneIcon}
          placeholder="0911111111"
          {...register("contactNumber", { required: true })}
        />
      </div>
      <div className="mt-3">
        <div className="block">
          <Label htmlFor="gender" value="Gender" />
        </div>
        <Select
          {...register("gender")}
          name="gender"
          icon={UserIcon}
          id="gender"
        >
          <option value={"male"}>Male</option>
          <option value={"female"}>Female</option>
          <option value={"other"}>Other</option>
        </Select>
      </div>

      <div className="mt-3">
        <div className="block">
          <Label htmlFor="password" value="Password" />
        </div>
        <TextInput
          required
          id="password"
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
      </div>

      <div className="mt-3">
        <div className="block">
          <Label htmlFor="confirmPassword" value="Confirm Password" />
        </div>
        <TextInput
          required
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: true,
            minLength: {
              value: 6,
              message: "Password must have at least 6 characters",
            },
          })}
        />
      </div>
      <div className="mt-5">
        <Button
          pill={true}
          loadingText={"Loading"}
          loading={isLoading}
          type="submit"
          text="Next"
          icon="arrow_forward"
          variant="filled"
        />
      </div>
    </form>
  );
}

export default AdminAccountForm;
