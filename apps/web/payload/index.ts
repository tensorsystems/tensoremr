import { Encounter } from "fhir/r4";

export type CreateUserInput =  {
    role: string;
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
    role: string;
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

  export type CreateEncounterInput = {
    encounter: Encounter;
    activityDefinitionName?: string;
    requesterId?: string;
    careTeams?: [string];
  }