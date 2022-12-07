
export type CreateUserInput =  {
  accountType: string;
  namePrefix: string;
  givenName: string;
  familyName: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  photo: string;
  profiePicture?: string;
  signature?: string;
}


export type UpdateUserInput =  {
  id: string;
  accountType: string;
  namePrefix: string;
  givenName: string;
  familyName: string;
  email: string;
  contactNumber: string;
  enabled: boolean;
  password: string;
  confirmPassword: string;
  photo: string;
  profiePicture?: string;
  signature?: string;
}