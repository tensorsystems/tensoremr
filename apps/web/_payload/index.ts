
export type CreateUserInput =  {
    accountType: string;
    namePrefix: string;
    givenName: string;
    familyName: string;
    email: string;
    contactNumber: string;
    password: string;
    confirmPassword: string;
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
    profiePicture?: string;
    signature?: string;
  }
  
  export type SaveAppointmentResponseInput = {
    participationStatus: string;
    appointmentId: string;
    participantId: string;
  }