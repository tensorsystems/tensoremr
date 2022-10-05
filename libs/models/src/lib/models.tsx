import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
  Upload: any;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Allergy = {
  __typename?: 'Allergy';
  id: Scalars['ID'];
  issueOccurrence: Scalars['String'];
  issueOutcome: Scalars['String'];
  issueReaction: Scalars['String'];
  issueSeverity: Scalars['String'];
  patientHistoryId: Scalars['ID'];
  title: Scalars['String'];
};

export type AllergyConnection = Connection & {
  __typename?: 'AllergyConnection';
  edges: Array<Maybe<AllergyEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AllergyEdge = {
  __typename?: 'AllergyEdge';
  node: Allergy;
};

export type AllergyFilter = {
  id?: InputMaybe<Scalars['ID']>;
  patientHistoryId?: InputMaybe<Scalars['ID']>;
};

export type AllergyInput = {
  issueOccurrence?: InputMaybe<Scalars['String']>;
  issueOutcome?: InputMaybe<Scalars['String']>;
  issueReaction?: InputMaybe<Scalars['String']>;
  issueSeverity?: InputMaybe<Scalars['String']>;
  patientHistoryId: Scalars['ID'];
  title: Scalars['String'];
};

export type AllergyUpdateInput = {
  id: Scalars['ID'];
  issueOccurrence?: InputMaybe<Scalars['String']>;
  issueOutcome?: InputMaybe<Scalars['String']>;
  issueReaction?: InputMaybe<Scalars['String']>;
  issueSeverity?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Amendment = {
  __typename?: 'Amendment';
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  note: Scalars['String'];
  patientChartId: Scalars['ID'];
};

export type AmendmentFilter = {
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type AmendmentInput = {
  note: Scalars['String'];
  patientChartId: Scalars['ID'];
};

export type AmendmentUpdateInput = {
  id: Scalars['ID'];
  note?: InputMaybe<Scalars['String']>;
};

export type Appointment = {
  __typename?: 'Appointment';
  appointmentStatus: AppointmentStatus;
  checkInTime: Scalars['Time'];
  checkedInTime?: Maybe<Scalars['Time']>;
  checkedOutTime?: Maybe<Scalars['Time']>;
  credit: Scalars['Boolean'];
  emergency?: Maybe<Scalars['Boolean']>;
  files: Array<Maybe<File>>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  medicalDepartment?: Maybe<Scalars['String']>;
  patient: Patient;
  patientChart: PatientChart;
  patientId: Scalars['ID'];
  payments: Array<Maybe<Payment>>;
  phoneNo: Scalars['String'];
  providerName: Scalars['String'];
  queueId: Scalars['ID'];
  queueName: Scalars['String'];
  room: Room;
  userId: Scalars['ID'];
  visitType: VisitType;
};

export type AppointmentConnection = Connection & {
  __typename?: 'AppointmentConnection';
  edges: Array<AppointmentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AppointmentEdge = {
  __typename?: 'AppointmentEdge';
  node: Appointment;
};

export type AppointmentFilter = {
  appointmentStatusId?: InputMaybe<Scalars['ID']>;
  checkInTime?: InputMaybe<Scalars['Time']>;
  checkedInTime?: InputMaybe<Scalars['Time']>;
  checkedOutTime?: InputMaybe<Scalars['Time']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  roomId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
  visitTypeId?: InputMaybe<Scalars['ID']>;
};

export type AppointmentInput = {
  billingId?: InputMaybe<Scalars['ID']>;
  checkInTime: Scalars['Time'];
  checkedInTime?: InputMaybe<Scalars['Time']>;
  checkedOutTime?: InputMaybe<Scalars['Time']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  emergency?: InputMaybe<Scalars['Boolean']>;
  fileIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  invoiceNo?: InputMaybe<Scalars['String']>;
  medicalDepartment?: InputMaybe<Scalars['String']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId: Scalars['ID'];
  paymentIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  roomId: Scalars['ID'];
  userId: Scalars['ID'];
  visitTypeId: Scalars['ID'];
};

export type AppointmentSearchInput = {
  appointmentStatusId?: InputMaybe<Scalars['String']>;
  checkInTime?: InputMaybe<Scalars['Time']>;
  patientId?: InputMaybe<Scalars['ID']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
  visitTypeId?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type AppointmentStatus = {
  __typename?: 'AppointmentStatus';
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type AppointmentStatusConnection = Connection & {
  __typename?: 'AppointmentStatusConnection';
  edges: Array<Maybe<AppointmentStatusEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AppointmentStatusEdge = {
  __typename?: 'AppointmentStatusEdge';
  node: AppointmentStatus;
};

export type AppointmentStatusInput = {
  title: Scalars['String'];
};

export type AppointmentUpdateInput = {
  appointmentStatusId?: InputMaybe<Scalars['ID']>;
  checkInTime?: InputMaybe<Scalars['Time']>;
  checkedInTime?: InputMaybe<Scalars['Time']>;
  checkedOutTime?: InputMaybe<Scalars['Time']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  emergency?: InputMaybe<Scalars['Boolean']>;
  fileIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  medicalDepartment?: InputMaybe<Scalars['String']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  paymentIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  providerName?: InputMaybe<Scalars['String']>;
  roomId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
  visitTypeId?: InputMaybe<Scalars['ID']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Billing = {
  __typename?: 'Billing';
  code: Scalars['String'];
  credit: Scalars['Boolean'];
  id: Scalars['ID'];
  item: Scalars['String'];
  price: Scalars['Float'];
  remark: Scalars['String'];
};

export type BillingConnection = Connection & {
  __typename?: 'BillingConnection';
  edges: Array<Maybe<BillingEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type BillingEdge = {
  __typename?: 'BillingEdge';
  node: Billing;
};

export type BillingFilter = {
  code?: InputMaybe<Scalars['String']>;
  item?: InputMaybe<Scalars['String']>;
};

export type BillingInput = {
  code: Scalars['String'];
  credit: Scalars['Boolean'];
  item: Scalars['String'];
  price: Scalars['Float'];
  remark: Scalars['String'];
};

export type ChangePasswordInput = {
  confirmPassword: Scalars['String'];
  password: Scalars['String'];
  previousPassword: Scalars['String'];
};

export type Chat = {
  __typename?: 'Chat';
  chatMembers: Array<Maybe<ChatMember>>;
  chatMessages: Array<Maybe<ChatMessage>>;
  chatMutes: Array<Maybe<ChatMute>>;
  chatUnreadMessages: Array<Maybe<ChatUnreadMessage>>;
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  recentMessage: Scalars['String'];
  updatedAt: Scalars['Time'];
};

export type ChatDelete = {
  __typename?: 'ChatDelete';
  chatId: Scalars['ID'];
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  userId: Scalars['ID'];
};

export type ChatInput = {
  message: Scalars['String'];
  recipientId: Scalars['ID'];
};

export type ChatMember = {
  __typename?: 'ChatMember';
  chatId: Scalars['ID'];
  displayName: Scalars['String'];
  id: Scalars['ID'];
  photoUrl?: Maybe<Scalars['String']>;
  userId: Scalars['ID'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type ChatMessage = {
  __typename?: 'ChatMessage';
  body: Scalars['String'];
  chatId: Scalars['ID'];
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  userId: Scalars['ID'];
};

export type ChatMessageInput = {
  body: Scalars['String'];
  chatId: Scalars['ID'];
};

export type ChatMute = {
  __typename?: 'ChatMute';
  chatId: Scalars['ID'];
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  userId: Scalars['ID'];
};

export type ChatUnreadMessage = {
  __typename?: 'ChatUnreadMessage';
  chatId: Scalars['ID'];
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  userId: Scalars['ID'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type ChiefComplaint = {
  __typename?: 'ChiefComplaint';
  hpiComponents: Array<Maybe<HpiComponent>>;
  id: Scalars['ID'];
  patientChartId: Scalars['ID'];
  title: Scalars['String'];
};

export type ChiefComplaintConnection = Connection & {
  __typename?: 'ChiefComplaintConnection';
  edges: Array<Maybe<ChiefComplaintEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ChiefComplaintEdge = {
  __typename?: 'ChiefComplaintEdge';
  node: ChiefComplaint;
};

export type ChiefComplaintFilter = {
  id?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type ChiefComplaintInput = {
  hpiComponentIds: Array<InputMaybe<Scalars['ID']>>;
  patientChartId: Scalars['ID'];
  title: Scalars['String'];
};

export type ChiefComplaintOrder = {
  direction: OrderDirection;
  field: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type ChiefComplaintType = {
  __typename?: 'ChiefComplaintType';
  active: Scalars['Boolean'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type ChiefComplaintTypeConnection = Connection & {
  __typename?: 'ChiefComplaintTypeConnection';
  edges: Array<Maybe<ChiefComplaintTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ChiefComplaintTypeEdge = {
  __typename?: 'ChiefComplaintTypeEdge';
  node: ChiefComplaintType;
};

export type ChiefComplaintTypeInput = {
  title: Scalars['String'];
};

export type ChiefComplaintTypeUpdateInput = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type ChiefComplaintUpdateInput = {
  hpiComponentIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  patientChartId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type ClinicalFinding = {
  __typename?: 'ClinicalFinding';
  attributes: Array<ClinicalFindingAttribute>;
  authority?: Maybe<Scalars['String']>;
  conceptId?: Maybe<Scalars['String']>;
  conceptTerm: Scalars['String'];
  createdAt: Scalars['Time'];
  createdById: Scalars['ID'];
  freeTextNote?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  parentConceptId?: Maybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  updatedAt: Scalars['Time'];
  updatedById: Scalars['ID'];
};

export type ClinicalFindingAttribute = {
  __typename?: 'ClinicalFindingAttribute';
  attributeId: Scalars['String'];
  attributeTerm: Scalars['String'];
  attributeTypeId: Scalars['String'];
  clinicalFindingId: Scalars['ID'];
  id: Scalars['ID'];
};

export type ClinicalFindingConnection = Connection & {
  __typename?: 'ClinicalFindingConnection';
  edges: Array<ClinicalFindingEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ClinicalFindingEdge = {
  __typename?: 'ClinicalFindingEdge';
  node: ClinicalFinding;
};

export type ClinicalFindingFilter = {
  conceptId?: InputMaybe<Scalars['String']>;
  conceptTerm?: InputMaybe<Scalars['String']>;
  parentConceptId?: InputMaybe<Scalars['String']>;
  patientChartId?: InputMaybe<Scalars['String']>;
  patientId?: InputMaybe<Scalars['String']>;
};

export type ClinicalFindingInput = {
  attributes?: InputMaybe<Array<Scalars['String']>>;
  conceptId: Scalars['String'];
  freeTextNote?: InputMaybe<Scalars['String']>;
  patientChartId: Scalars['Int'];
  term: Scalars['String'];
};

export type ClinicalFindingUpdateInput = {
  conceptId?: InputMaybe<Scalars['String']>;
  freeTextNote?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  term?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Concept = {
  __typename?: 'Concept';
  active: Scalars['String'];
  definitionStatusId: Scalars['String'];
  fsn: Scalars['String'];
  moduleId: Scalars['String'];
  sctid: Scalars['String'];
};

export type ConceptAttributes = {
  __typename?: 'ConceptAttributes';
  associatedFinding?: Maybe<Scalars['String']>;
  findingContext?: Maybe<Scalars['String']>;
  subjectRelationshipContext?: Maybe<Scalars['String']>;
  temporalContext?: Maybe<Scalars['String']>;
};

export type ConceptChild = {
  __typename?: 'ConceptChild';
  childrenCount: Scalars['Int'];
  concept: Concept;
  description: ConceptDescription;
};

export type ConceptDescription = {
  __typename?: 'ConceptDescription';
  acceptabilityId: Scalars['String'];
  caseSignificanceId: Scalars['String'];
  descriptionType: Scalars['String'];
  languageCode: Scalars['String'];
  moduleId: Scalars['String'];
  nodetype: Scalars['String'];
  refsetId: Scalars['String'];
  sctid: Scalars['String'];
  term: Scalars['String'];
  typeId: Scalars['String'];
};

export type ConfirmFollowUpOrderInput = {
  billingId?: InputMaybe<Scalars['ID']>;
  checkInTime: Scalars['Time'];
  followUpId: Scalars['ID'];
  followUpOrderId: Scalars['ID'];
  invoiceNo?: InputMaybe<Scalars['String']>;
  roomId: Scalars['ID'];
};

export type ConfirmFollowUpOrderResult = {
  __typename?: 'ConfirmFollowUpOrderResult';
  billingId?: Maybe<Scalars['ID']>;
  followUpId: Scalars['ID'];
  followUpOrder: FollowUpOrder;
  invoiceNo?: Maybe<Scalars['String']>;
};

export type ConfirmReferralOrderInput = {
  billingId?: InputMaybe<Scalars['ID']>;
  checkInTime?: InputMaybe<Scalars['Time']>;
  invoiceNo?: InputMaybe<Scalars['String']>;
  referralId: Scalars['ID'];
  referralOrderId: Scalars['ID'];
  roomId?: InputMaybe<Scalars['ID']>;
};

export type ConfirmReferralOrderResult = {
  __typename?: 'ConfirmReferralOrderResult';
  billingId?: Maybe<Scalars['ID']>;
  invoiceNo?: Maybe<Scalars['String']>;
  referralId: Scalars['ID'];
  referralOrder: ReferralOrder;
};

export type ConfirmSurgicalOrderInput = {
  checkInTime: Scalars['Time'];
  invoiceNo?: InputMaybe<Scalars['String']>;
  roomId: Scalars['ID'];
  surgicalOrderId: Scalars['ID'];
  surgicalProcedureId: Scalars['ID'];
};

export type ConfirmSurgicalOrderResult = {
  __typename?: 'ConfirmSurgicalOrderResult';
  invoiceNo: Scalars['String'];
  surgicalOrder: SurgicalOrder;
  surgicalProcedureId: Scalars['ID'];
};

export type ConfirmTreatmentOrderInput = {
  checkInTime: Scalars['Time'];
  invoiceNo?: InputMaybe<Scalars['String']>;
  roomId: Scalars['ID'];
  treatmentId: Scalars['ID'];
  treatmentOrderId: Scalars['ID'];
};

export type ConfirmTreatmentOrderResult = {
  __typename?: 'ConfirmTreatmentOrderResult';
  invoiceNo: Scalars['String'];
  treatmentId: Scalars['ID'];
  treatmentOrder: TreatmentOrder;
};

export type Connection = {
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DateOfBirthInput = {
  ageInMonths?: InputMaybe<Scalars['Int']>;
  ageInYears?: InputMaybe<Scalars['Int']>;
  dateOfBirth?: InputMaybe<Scalars['Time']>;
  inputType: DateOfBirthInputType;
};

export enum DateOfBirthInputType {
  AgeMonth = 'AGE_MONTH',
  AgeYear = 'AGE_YEAR',
  Date = 'DATE'
}

export enum Destination {
  Physician = 'PHYSICIAN',
  Preexam = 'PREEXAM',
  Preoperation = 'PREOPERATION',
  Reception = 'RECEPTION'
}

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Diagnosis = {
  __typename?: 'Diagnosis';
  abbreviatedDescription?: Maybe<Scalars['String']>;
  categoryCode?: Maybe<Scalars['String']>;
  categoryTitle?: Maybe<Scalars['String']>;
  diagnosisCode?: Maybe<Scalars['String']>;
  fullCode?: Maybe<Scalars['String']>;
  fullDescription: Scalars['String'];
  id: Scalars['ID'];
};

export type DiagnosisConnection = Connection & {
  __typename?: 'DiagnosisConnection';
  edges: Array<Maybe<DiagnosisEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DiagnosisEdge = {
  __typename?: 'DiagnosisEdge';
  node: Diagnosis;
};

export type DiagnosisInput = {
  abbreviatedDescription?: InputMaybe<Scalars['String']>;
  categoryCode?: InputMaybe<Scalars['String']>;
  categoryTitle?: InputMaybe<Scalars['String']>;
  diagnosisCode?: InputMaybe<Scalars['String']>;
  fullDescription: Scalars['String'];
};

export type DiagnosisOrder = {
  direction: OrderDirection;
  field: Scalars['String'];
};

export type DiagnosisUpdateInput = {
  abbreviatedDescription?: InputMaybe<Scalars['String']>;
  categoryCode?: InputMaybe<Scalars['String']>;
  categoryTitle?: InputMaybe<Scalars['String']>;
  diagnosisCode?: InputMaybe<Scalars['String']>;
  fullDescription?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DiagnosticProcedure = {
  __typename?: 'DiagnosticProcedure';
  createdAt: Scalars['Time'];
  diagnosticProcedureOrderID: Scalars['ID'];
  diagnosticProcedureType: DiagnosticProcedureType;
  diagnosticProcedureTypeId?: Maybe<Scalars['ID']>;
  diagnosticProcedureTypeTitle: Scalars['String'];
  dicomStudyUid?: Maybe<Scalars['String']>;
  documents: Array<Maybe<File>>;
  farPd?: Maybe<Scalars['String']>;
  generalText?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images: Array<Maybe<File>>;
  leftDistanceFinalAxis?: Maybe<Scalars['String']>;
  leftDistanceFinalCyl?: Maybe<Scalars['String']>;
  leftDistanceFinalSph?: Maybe<Scalars['String']>;
  leftDistanceObjectiveAxis?: Maybe<Scalars['String']>;
  leftDistanceObjectiveCyl?: Maybe<Scalars['String']>;
  leftDistanceObjectiveSph?: Maybe<Scalars['String']>;
  leftDistanceSubjectiveAxis?: Maybe<Scalars['String']>;
  leftDistanceSubjectiveCyl?: Maybe<Scalars['String']>;
  leftDistanceSubjectiveSph?: Maybe<Scalars['String']>;
  leftNearFinalAxis?: Maybe<Scalars['String']>;
  leftNearFinalCyl?: Maybe<Scalars['String']>;
  leftNearFinalSph?: Maybe<Scalars['String']>;
  leftNearObjectiveAxis?: Maybe<Scalars['String']>;
  leftNearObjectiveCyl?: Maybe<Scalars['String']>;
  leftNearObjectiveSph?: Maybe<Scalars['String']>;
  leftNearSubjectiveAxis?: Maybe<Scalars['String']>;
  leftNearSubjectiveCyl?: Maybe<Scalars['String']>;
  leftNearSubjectiveSph?: Maybe<Scalars['String']>;
  leftVisualAcuity?: Maybe<Scalars['String']>;
  modalities?: Maybe<Scalars['String']>;
  nearPd?: Maybe<Scalars['String']>;
  orderNote: Scalars['String'];
  patientChartId: Scalars['ID'];
  payments: Array<Payment>;
  receptionNote: Scalars['String'];
  rightDistanceFinalAxis?: Maybe<Scalars['String']>;
  rightDistanceFinalCyl?: Maybe<Scalars['String']>;
  rightDistanceFinalSph?: Maybe<Scalars['String']>;
  rightDistanceObjectiveAxis?: Maybe<Scalars['String']>;
  rightDistanceObjectiveCyl?: Maybe<Scalars['String']>;
  rightDistanceObjectiveSph?: Maybe<Scalars['String']>;
  rightDistanceSubjectiveAxis?: Maybe<Scalars['String']>;
  rightDistanceSubjectiveCyl?: Maybe<Scalars['String']>;
  rightDistanceSubjectiveSph?: Maybe<Scalars['String']>;
  rightNearFinalAxis?: Maybe<Scalars['String']>;
  rightNearFinalCyl?: Maybe<Scalars['String']>;
  rightNearFinalSph?: Maybe<Scalars['String']>;
  rightNearObjectiveAxis?: Maybe<Scalars['String']>;
  rightNearObjectiveCyl?: Maybe<Scalars['String']>;
  rightNearObjectiveSph?: Maybe<Scalars['String']>;
  rightNearSubjectiveAxis?: Maybe<Scalars['String']>;
  rightNearSubjectiveCyl?: Maybe<Scalars['String']>;
  rightNearSubjectiveSph?: Maybe<Scalars['String']>;
  rightVisualAcuity?: Maybe<Scalars['String']>;
  status: DiagnosticProcedureStatus;
};

export type DiagnosticProcedureConnection = Connection & {
  __typename?: 'DiagnosticProcedureConnection';
  edges: Array<Maybe<DiagnosticProcedureEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DiagnosticProcedureDeleteFileInput = {
  diagnosticProcedureId: Scalars['ID'];
  fileId: Scalars['ID'];
};

export type DiagnosticProcedureEdge = {
  __typename?: 'DiagnosticProcedureEdge';
  node: DiagnosticProcedure;
};

export type DiagnosticProcedureFilter = {
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type DiagnosticProcedureInput = {
  diagnosticProcedureOrderId: Scalars['ID'];
  documentIds: Array<InputMaybe<Scalars['ID']>>;
  farPd?: InputMaybe<Scalars['String']>;
  generalText?: InputMaybe<Scalars['String']>;
  imageIds: Array<InputMaybe<Scalars['ID']>>;
  leftDistanceFinalAxis?: InputMaybe<Scalars['String']>;
  leftDistanceFinalCyl?: InputMaybe<Scalars['String']>;
  leftDistanceFinalSph?: InputMaybe<Scalars['String']>;
  leftDistanceObjectiveAxis?: InputMaybe<Scalars['String']>;
  leftDistanceObjectiveCyl?: InputMaybe<Scalars['String']>;
  leftDistanceObjectiveSph?: InputMaybe<Scalars['String']>;
  leftDistanceSubjectiveAxis?: InputMaybe<Scalars['String']>;
  leftDistanceSubjectiveCyl?: InputMaybe<Scalars['String']>;
  leftDistanceSubjectiveSph?: InputMaybe<Scalars['String']>;
  leftEyeImageIds: Array<InputMaybe<Scalars['ID']>>;
  leftEyeSketcheIds: Array<InputMaybe<Scalars['ID']>>;
  leftNearFinalAxis?: InputMaybe<Scalars['String']>;
  leftNearFinalCyl?: InputMaybe<Scalars['String']>;
  leftNearFinalSph?: InputMaybe<Scalars['String']>;
  leftNearObjectiveAxis?: InputMaybe<Scalars['String']>;
  leftNearObjectiveCyl?: InputMaybe<Scalars['String']>;
  leftNearObjectiveSph?: InputMaybe<Scalars['String']>;
  leftNearSubjectiveAxis?: InputMaybe<Scalars['String']>;
  leftNearSubjectiveCyl?: InputMaybe<Scalars['String']>;
  leftNearSubjectiveSph?: InputMaybe<Scalars['String']>;
  leftVisualAcuity?: InputMaybe<Scalars['String']>;
  nearPd?: InputMaybe<Scalars['String']>;
  orderId: Scalars['ID'];
  patientChartId: Scalars['ID'];
  rightDistanceFinalAxis?: InputMaybe<Scalars['String']>;
  rightDistanceFinalCyl?: InputMaybe<Scalars['String']>;
  rightDistanceFinalSph?: InputMaybe<Scalars['String']>;
  rightDistanceObjectiveAxis?: InputMaybe<Scalars['String']>;
  rightDistanceObjectiveCyl?: InputMaybe<Scalars['String']>;
  rightDistanceObjectiveSph?: InputMaybe<Scalars['String']>;
  rightDistanceSubjectiveAxis?: InputMaybe<Scalars['String']>;
  rightDistanceSubjectiveCyl?: InputMaybe<Scalars['String']>;
  rightDistanceSubjectiveSph?: InputMaybe<Scalars['String']>;
  rightEyeImageIds: Array<InputMaybe<Scalars['ID']>>;
  rightEyeSketcheIds: Array<InputMaybe<Scalars['ID']>>;
  rightNearFinalAxis?: InputMaybe<Scalars['String']>;
  rightNearFinalCyl?: InputMaybe<Scalars['String']>;
  rightNearFinalSph?: InputMaybe<Scalars['String']>;
  rightNearObjectiveAxis?: InputMaybe<Scalars['String']>;
  rightNearObjectiveCyl?: InputMaybe<Scalars['String']>;
  rightNearObjectiveSph?: InputMaybe<Scalars['String']>;
  rightNearSubjectiveAxis?: InputMaybe<Scalars['String']>;
  rightNearSubjectiveCyl?: InputMaybe<Scalars['String']>;
  rightNearSubjectiveSph?: InputMaybe<Scalars['String']>;
  rightVisualAcuity?: InputMaybe<Scalars['String']>;
};

export type DiagnosticProcedureOrder = {
  __typename?: 'DiagnosticProcedureOrder';
  createdAt?: Maybe<Scalars['Time']>;
  diagnosticProcedures: Array<DiagnosticProcedure>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  phoneNo: Scalars['String'];
  status: DiagnosticProcedureOrderStatus;
  userName: Scalars['String'];
};

export type DiagnosticProcedureOrderConnection = Connection & {
  __typename?: 'DiagnosticProcedureOrderConnection';
  edges: Array<DiagnosticProcedureOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DiagnosticProcedureOrderEdge = {
  __typename?: 'DiagnosticProcedureOrderEdge';
  node: DiagnosticProcedureOrder;
};

export type DiagnosticProcedureOrderFilter = {
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum DiagnosticProcedureOrderStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type DiagnosticProcedureOrderUpdateInput = {
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  orderNote?: InputMaybe<Scalars['String']>;
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  phoneNo?: InputMaybe<Scalars['String']>;
  receptionNote?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<DiagnosticProcedureOrderStatus>;
  userName?: InputMaybe<Scalars['String']>;
};

export enum DiagnosticProcedureStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type DiagnosticProcedureType = {
  __typename?: 'DiagnosticProcedureType';
  active: Scalars['Boolean'];
  billings: Array<Maybe<Billing>>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type DiagnosticProcedureTypeConnection = Connection & {
  __typename?: 'DiagnosticProcedureTypeConnection';
  edges: Array<Maybe<DiagnosticProcedureTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DiagnosticProcedureTypeEdge = {
  __typename?: 'DiagnosticProcedureTypeEdge';
  node: DiagnosticProcedureType;
};

export type DiagnosticProcedureTypeInput = {
  active: Scalars['Boolean'];
  billingIds: Array<InputMaybe<Scalars['ID']>>;
  title: Scalars['String'];
};

export type DiagnosticProcedureTypeUpdateInput = {
  active: Scalars['Boolean'];
  billingIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type DiagnosticProcedureUpdateInput = {
  documents?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  farPd?: InputMaybe<Scalars['String']>;
  generalText?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  images?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  leftDistanceFinalAxis?: InputMaybe<Scalars['String']>;
  leftDistanceFinalCyl?: InputMaybe<Scalars['String']>;
  leftDistanceFinalSph?: InputMaybe<Scalars['String']>;
  leftDistanceObjectiveAxis?: InputMaybe<Scalars['String']>;
  leftDistanceObjectiveCyl?: InputMaybe<Scalars['String']>;
  leftDistanceObjectiveSph?: InputMaybe<Scalars['String']>;
  leftDistanceSubjectiveAxis?: InputMaybe<Scalars['String']>;
  leftDistanceSubjectiveCyl?: InputMaybe<Scalars['String']>;
  leftDistanceSubjectiveSph?: InputMaybe<Scalars['String']>;
  leftNearFinalAxis?: InputMaybe<Scalars['String']>;
  leftNearFinalCyl?: InputMaybe<Scalars['String']>;
  leftNearFinalSph?: InputMaybe<Scalars['String']>;
  leftNearObjectiveAxis?: InputMaybe<Scalars['String']>;
  leftNearObjectiveCyl?: InputMaybe<Scalars['String']>;
  leftNearObjectiveSph?: InputMaybe<Scalars['String']>;
  leftNearSubjectiveAxis?: InputMaybe<Scalars['String']>;
  leftNearSubjectiveCyl?: InputMaybe<Scalars['String']>;
  leftNearSubjectiveSph?: InputMaybe<Scalars['String']>;
  leftVisualAcuity?: InputMaybe<Scalars['String']>;
  nearPd?: InputMaybe<Scalars['String']>;
  rightDistanceFinalAxis?: InputMaybe<Scalars['String']>;
  rightDistanceFinalCyl?: InputMaybe<Scalars['String']>;
  rightDistanceFinalSph?: InputMaybe<Scalars['String']>;
  rightDistanceObjectiveAxis?: InputMaybe<Scalars['String']>;
  rightDistanceObjectiveCyl?: InputMaybe<Scalars['String']>;
  rightDistanceObjectiveSph?: InputMaybe<Scalars['String']>;
  rightDistanceSubjectiveAxis?: InputMaybe<Scalars['String']>;
  rightDistanceSubjectiveCyl?: InputMaybe<Scalars['String']>;
  rightDistanceSubjectiveSph?: InputMaybe<Scalars['String']>;
  rightNearFinalAxis?: InputMaybe<Scalars['String']>;
  rightNearFinalCyl?: InputMaybe<Scalars['String']>;
  rightNearFinalSph?: InputMaybe<Scalars['String']>;
  rightNearObjectiveAxis?: InputMaybe<Scalars['String']>;
  rightNearObjectiveCyl?: InputMaybe<Scalars['String']>;
  rightNearObjectiveSph?: InputMaybe<Scalars['String']>;
  rightNearSubjectiveAxis?: InputMaybe<Scalars['String']>;
  rightNearSubjectiveCyl?: InputMaybe<Scalars['String']>;
  rightNearSubjectiveSph?: InputMaybe<Scalars['String']>;
  rightVisualAcuity?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<DiagnosticProcedureStatus>;
};

export type Edge = {
  node: Room;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type ExamCategory = {
  __typename?: 'ExamCategory';
  active: Scalars['Boolean'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type ExamCategoryConnection = Connection & {
  __typename?: 'ExamCategoryConnection';
  edges: Array<ExamCategoryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ExamCategoryEdge = {
  __typename?: 'ExamCategoryEdge';
  node: ExamCategory;
};

export type ExamCategoryInput = {
  title: Scalars['String'];
};

export type ExamCategoryUpdateInput = {
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type ExamFinding = {
  __typename?: 'ExamFinding';
  examCategory: ExamCategory;
  examCategoryId: Scalars['ID'];
  id: Scalars['ID'];
  pertinence: Scalars['Boolean'];
  title: Scalars['String'];
};

export type ExamFindingConnection = Connection & {
  __typename?: 'ExamFindingConnection';
  edges: Array<ExamFindingEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ExamFindingEdge = {
  __typename?: 'ExamFindingEdge';
  node: ExamFinding;
};

export type ExamFindingInput = {
  examCategoryId: Scalars['ID'];
  pertinence: Scalars['Boolean'];
  title: Scalars['String'];
};

export type ExamFindingUpdateInput = {
  examCategoryId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  pertinence?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type EyewearPrescription = {
  __typename?: 'EyewearPrescription';
  bifocal?: Maybe<Scalars['Boolean']>;
  blueCut?: Maybe<Scalars['Boolean']>;
  eyewearPrescriptionOrderId: Scalars['ID'];
  glareFree?: Maybe<Scalars['Boolean']>;
  glass?: Maybe<Scalars['Boolean']>;
  highIndex?: Maybe<Scalars['Boolean']>;
  history: Scalars['Boolean'];
  id: Scalars['ID'];
  photoChromatic?: Maybe<Scalars['Boolean']>;
  plastic?: Maybe<Scalars['Boolean']>;
  prescribedDate?: Maybe<Scalars['Time']>;
  progressive?: Maybe<Scalars['Boolean']>;
  scratchResistant?: Maybe<Scalars['Boolean']>;
  singleVision?: Maybe<Scalars['Boolean']>;
  status: Scalars['String'];
  tint?: Maybe<Scalars['Boolean']>;
  twoSeparateGlasses?: Maybe<Scalars['Boolean']>;
};

export type EyewearPrescriptionConnection = Connection & {
  __typename?: 'EyewearPrescriptionConnection';
  edges: Array<Maybe<EyewearPrescriptionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type EyewearPrescriptionEdge = {
  __typename?: 'EyewearPrescriptionEdge';
  node: EyewearPrescription;
};

export type EyewearPrescriptionFilter = {
  history?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

export type EyewearPrescriptionInput = {
  bifocal?: InputMaybe<Scalars['Boolean']>;
  blueCut?: InputMaybe<Scalars['Boolean']>;
  eyewearShopId: Scalars['ID'];
  glareFree?: InputMaybe<Scalars['Boolean']>;
  glass?: InputMaybe<Scalars['Boolean']>;
  highIndex?: InputMaybe<Scalars['Boolean']>;
  history: Scalars['Boolean'];
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  photoChromatic?: InputMaybe<Scalars['Boolean']>;
  plastic?: InputMaybe<Scalars['Boolean']>;
  prescribedDate?: InputMaybe<Scalars['Time']>;
  progressive?: InputMaybe<Scalars['Boolean']>;
  scratchResistant?: InputMaybe<Scalars['Boolean']>;
  singleVision?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Scalars['String']>;
  tint?: InputMaybe<Scalars['Boolean']>;
  twoSeparateGlasses?: InputMaybe<Scalars['Boolean']>;
};

export type EyewearPrescriptionOrder = {
  __typename?: 'EyewearPrescriptionOrder';
  createdAt?: Maybe<Scalars['Time']>;
  eyewearPrescriptions: Array<Maybe<EyewearPrescription>>;
  eyewearShop: EyewearShop;
  eyewearShopId: Scalars['ID'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  phoneNo: Scalars['String'];
  status: Scalars['String'];
  userName: Scalars['String'];
};

export type EyewearPrescriptionOrderConnection = Connection & {
  __typename?: 'EyewearPrescriptionOrderConnection';
  edges: Array<EyewearPrescriptionOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type EyewearPrescriptionOrderEdge = {
  __typename?: 'EyewearPrescriptionOrderEdge';
  node: EyewearPrescriptionOrder;
};

export type EyewearPrescriptionOrderUpdateInput = {
  id: Scalars['ID'];
  pharmacyId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

export type EyewearPrescriptionUpdateInput = {
  bifocal?: InputMaybe<Scalars['Boolean']>;
  blueCut?: InputMaybe<Scalars['Boolean']>;
  glareFree?: InputMaybe<Scalars['Boolean']>;
  glass?: InputMaybe<Scalars['Boolean']>;
  highIndex?: InputMaybe<Scalars['Boolean']>;
  history?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  photoChromatic?: InputMaybe<Scalars['Boolean']>;
  plastic?: InputMaybe<Scalars['Boolean']>;
  prescribedDate?: InputMaybe<Scalars['Time']>;
  progressive?: InputMaybe<Scalars['Boolean']>;
  scratchResistant?: InputMaybe<Scalars['Boolean']>;
  singleVision?: InputMaybe<Scalars['Boolean']>;
  status?: InputMaybe<Scalars['String']>;
  tint?: InputMaybe<Scalars['Boolean']>;
  twoSeparateGlasses?: InputMaybe<Scalars['Boolean']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type EyewearShop = {
  __typename?: 'EyewearShop';
  active: Scalars['Boolean'];
  address: Scalars['String'];
  country: Scalars['String'];
  id: Scalars['ID'];
  inHouse: Scalars['Boolean'];
  phone: Scalars['String'];
  region: Scalars['String'];
  title: Scalars['String'];
};

export type EyewearShopConnection = Connection & {
  __typename?: 'EyewearShopConnection';
  edges: Array<Maybe<EyewearShopEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type EyewearShopEdge = {
  __typename?: 'EyewearShopEdge';
  node: EyewearShop;
};

export type EyewearShopInput = {
  active: Scalars['Boolean'];
  address: Scalars['String'];
  country: Scalars['String'];
  inHouse: Scalars['Boolean'];
  phone: Scalars['String'];
  region: Scalars['String'];
  title: Scalars['String'];
};

export type EyewearShopUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  inHouse?: InputMaybe<Scalars['Boolean']>;
  phone?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type FamilyIllness = {
  __typename?: 'FamilyIllness';
  description: Scalars['String'];
  id: Scalars['ID'];
  patientHistoryId: Scalars['ID'];
  title: Scalars['String'];
};

export type FamilyIllnessInput = {
  description: Scalars['String'];
  patientHistoryId: Scalars['ID'];
  title: Scalars['String'];
};

export type FamilyIllnessUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type FavoriteChiefComplaint = {
  __typename?: 'FavoriteChiefComplaint';
  chiefComplaintType: ChiefComplaintType;
  chiefComplaintTypeId: Scalars['ID'];
  id: Scalars['ID'];
  user: User;
  userId: Scalars['ID'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type FavoriteDiagnosis = {
  __typename?: 'FavoriteDiagnosis';
  diagnosis: Diagnosis;
  diagnosisId: Scalars['ID'];
  id: Scalars['ID'];
  user: User;
  userId: Scalars['ID'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type FavoriteMedication = {
  __typename?: 'FavoriteMedication';
  directionToPatient: Scalars['String'];
  generic: Scalars['Boolean'];
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  medication: Scalars['String'];
  refill: Scalars['Int'];
  rxCui?: Maybe<Scalars['String']>;
  sig: Scalars['String'];
  substitutionAllowed: Scalars['Boolean'];
  synonym?: Maybe<Scalars['String']>;
  tty?: Maybe<Scalars['String']>;
  user: User;
  userId: Scalars['ID'];
};

export type FavoriteMedicationConnection = Connection & {
  __typename?: 'FavoriteMedicationConnection';
  edges: Array<Maybe<FavoriteMedicationEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FavoriteMedicationEdge = {
  __typename?: 'FavoriteMedicationEdge';
  node: FavoriteMedication;
};

export type FavoriteMedicationFilter = {
  id?: InputMaybe<Scalars['ID']>;
  medication?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type FavoriteMedicationInput = {
  directionToPatient?: InputMaybe<Scalars['String']>;
  generic?: InputMaybe<Scalars['Boolean']>;
  language?: InputMaybe<Scalars['String']>;
  medication?: InputMaybe<Scalars['String']>;
  refill?: InputMaybe<Scalars['Int']>;
  rxCui?: InputMaybe<Scalars['String']>;
  sig?: InputMaybe<Scalars['String']>;
  substitutionAllowed?: InputMaybe<Scalars['Boolean']>;
  synonym?: InputMaybe<Scalars['String']>;
  tty?: InputMaybe<Scalars['String']>;
};

export type FavoriteMedicationUpdateInput = {
  directionToPatient?: InputMaybe<Scalars['String']>;
  generic?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  language?: InputMaybe<Scalars['String']>;
  medication?: InputMaybe<Scalars['String']>;
  refill?: InputMaybe<Scalars['Int']>;
  rxCui?: InputMaybe<Scalars['String']>;
  sig?: InputMaybe<Scalars['String']>;
  substitutionAllowed?: InputMaybe<Scalars['Boolean']>;
  synonym?: InputMaybe<Scalars['String']>;
  tty?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type File = {
  __typename?: 'File';
  contentType: Scalars['String'];
  createdAt?: Maybe<Scalars['Time']>;
  extension: Scalars['String'];
  fileName: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  size: Scalars['Int'];
};

export type FileConnection = Connection & {
  __typename?: 'FileConnection';
  edges: Array<Maybe<FileEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FileEdge = {
  __typename?: 'FileEdge';
  node: File;
};

export type FileInput = {
  contentType: Scalars['String'];
  fileName: Scalars['String'];
  size: Scalars['Int'];
};

export type FileUpdateInput = {
  fileName: Scalars['String'];
  id: Scalars['ID'];
};

export type FileUpload = {
  file: Scalars['Upload'];
  name: Scalars['String'];
};

export type FollowUp = {
  __typename?: 'FollowUp';
  followUpOrderId: Scalars['ID'];
  id: Scalars['ID'];
  patientChartId: Scalars['ID'];
  receptionNote: Scalars['String'];
  status: FollowUpStatus;
};

export type FollowUpConnection = Connection & {
  __typename?: 'FollowUpConnection';
  edges: Array<FollowUpEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FollowUpEdge = {
  __typename?: 'FollowUpEdge';
  node: FollowUp;
};

export type FollowUpFilter = {
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type FollowUpInput = {
  followUpOrderId: Scalars['ID'];
  patientChartId: Scalars['ID'];
  status: FollowUpStatus;
};

export type FollowUpOrder = {
  __typename?: 'FollowUpOrder';
  createdAt?: Maybe<Scalars['Time']>;
  firstName: Scalars['String'];
  followUps: Array<FollowUp>;
  id: Scalars['ID'];
  lastName: Scalars['String'];
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  phoneNo: Scalars['String'];
  status: FollowUpOrderStatus;
  userName: Scalars['String'];
};

export type FollowUpOrderConnection = Connection & {
  __typename?: 'FollowUpOrderConnection';
  edges: Array<FollowUpOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FollowUpOrderEdge = {
  __typename?: 'FollowUpOrderEdge';
  node: FollowUpOrder;
};

export type FollowUpOrderFilter = {
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum FollowUpOrderStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export enum FollowUpStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type FollowUpUpdateInput = {
  id: Scalars['ID'];
  status?: InputMaybe<FollowUpStatus>;
};

export type HealthCheckReport = {
  __typename?: 'HealthCheckReport';
  db: Scalars['Boolean'];
  health: Scalars['String'];
};

export type HomeStats = {
  __typename?: 'HomeStats';
  checkedIn: Scalars['Int'];
  checkedOut: Scalars['Int'];
  scheduled: Scalars['Int'];
};

export type HpiComponent = {
  __typename?: 'HpiComponent';
  hpiComponentType: HpiComponentType;
  hpiComponentTypeId: Scalars['ID'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type HpiComponentConnection = Connection & {
  __typename?: 'HpiComponentConnection';
  edges: Array<Maybe<HpiComponentEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type HpiComponentEdge = {
  __typename?: 'HpiComponentEdge';
  node: HpiComponent;
};

export type HpiComponentInput = {
  hpiComponentTypeId: Scalars['ID'];
  title: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type HpiComponentType = {
  __typename?: 'HpiComponentType';
  description: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type HpiComponentTypeConnection = Connection & {
  __typename?: 'HpiComponentTypeConnection';
  edges: Array<Maybe<HpiComponentTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type HpiComponentTypeEdge = {
  __typename?: 'HpiComponentTypeEdge';
  node: HpiComponentType;
};

export type HpiComponentTypeInput = {
  description: Scalars['String'];
  title: Scalars['String'];
};

export type HpiComponentTypeOrder = {
  direction: OrderDirection;
  field: Scalars['String'];
};

export type HpiComponentTypeUpdateInput = {
  description: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type HpiComponentUpdateInput = {
  hpiComponentTypeId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type HpiFilter = {
  hpiComponentTypeId?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Lab = {
  __typename?: 'Lab';
  bacterologyAfb1Active?: Maybe<Scalars['Boolean']>;
  bacterologyAfb1Date?: Maybe<Scalars['Time']>;
  bacterologyAfb1Results?: Maybe<Scalars['String']>;
  bacterologyAfb2Active?: Maybe<Scalars['Boolean']>;
  bacterologyAfb2Date?: Maybe<Scalars['Time']>;
  bacterologyAfb2Results?: Maybe<Scalars['String']>;
  bacterologyAfb3Active?: Maybe<Scalars['Boolean']>;
  bacterologyAfb3Date?: Maybe<Scalars['Time']>;
  bacterologyAfb3Results?: Maybe<Scalars['String']>;
  bacterologyCultureActive?: Maybe<Scalars['Boolean']>;
  bacterologyCultureDate?: Maybe<Scalars['Time']>;
  bacterologyCultureResults?: Maybe<Scalars['String']>;
  bacterologyGramStainActive?: Maybe<Scalars['Boolean']>;
  bacterologyGramStainDate?: Maybe<Scalars['Time']>;
  bacterologyGramStainResults?: Maybe<Scalars['String']>;
  bacterologyKohActive?: Maybe<Scalars['Boolean']>;
  bacterologyKohDate?: Maybe<Scalars['Time']>;
  bacterologyKohResults?: Maybe<Scalars['String']>;
  bacterologySampleActive?: Maybe<Scalars['Boolean']>;
  bacterologySampleDate?: Maybe<Scalars['Time']>;
  bacterologySampleResults?: Maybe<Scalars['String']>;
  bacterologyWetFilmActive?: Maybe<Scalars['Boolean']>;
  bacterologyWetFilmDate?: Maybe<Scalars['Time']>;
  bacterologyWetFilmResults?: Maybe<Scalars['String']>;
  cbcBloodFilmActive?: Maybe<Scalars['Boolean']>;
  cbcBloodFilmDate?: Maybe<Scalars['Time']>;
  cbcBloodFilmResults?: Maybe<Scalars['String']>;
  cbcBloodGroupActive?: Maybe<Scalars['Boolean']>;
  cbcBloodGroupDate?: Maybe<Scalars['Time']>;
  cbcBloodGroupResults?: Maybe<Scalars['String']>;
  cbcEsrActive?: Maybe<Scalars['Boolean']>;
  cbcEsrDate?: Maybe<Scalars['Time']>;
  cbcEsrResults?: Maybe<Scalars['String']>;
  cbcHctActive?: Maybe<Scalars['Boolean']>;
  cbcHctDate?: Maybe<Scalars['Time']>;
  cbcHctResults?: Maybe<Scalars['String']>;
  cbcHgbActive?: Maybe<Scalars['Boolean']>;
  cbcHgbDate?: Maybe<Scalars['Time']>;
  cbcHgbResults?: Maybe<Scalars['String']>;
  cbcPltActive?: Maybe<Scalars['Boolean']>;
  cbcPltDate?: Maybe<Scalars['Time']>;
  cbcPltResults?: Maybe<Scalars['String']>;
  cbcRhActive?: Maybe<Scalars['Boolean']>;
  cbcRhDate?: Maybe<Scalars['Time']>;
  cbcRhResults?: Maybe<Scalars['String']>;
  cbcWbcActive?: Maybe<Scalars['Boolean']>;
  cbcWbcDate?: Maybe<Scalars['Time']>;
  cbcWbcResults?: Maybe<Scalars['String']>;
  chemistryAlkalinePhosphatesActive?: Maybe<Scalars['Boolean']>;
  chemistryAlkalinePhosphatesDate?: Maybe<Scalars['Time']>;
  chemistryAlkalinePhosphatesResults?: Maybe<Scalars['String']>;
  chemistryBilirubinDirectActive?: Maybe<Scalars['Boolean']>;
  chemistryBilirubinDirectDate?: Maybe<Scalars['Time']>;
  chemistryBilirubinDirectResults?: Maybe<Scalars['String']>;
  chemistryBilirubinTotalActive?: Maybe<Scalars['Boolean']>;
  chemistryBilirubinTotalDate?: Maybe<Scalars['Time']>;
  chemistryBilirubinTotalResults?: Maybe<Scalars['String']>;
  chemistryBunActive?: Maybe<Scalars['Boolean']>;
  chemistryBunDate?: Maybe<Scalars['Time']>;
  chemistryBunResults?: Maybe<Scalars['String']>;
  chemistryCholestrolActive?: Maybe<Scalars['Boolean']>;
  chemistryCholestrolDate?: Maybe<Scalars['Time']>;
  chemistryCholestrolResults?: Maybe<Scalars['String']>;
  chemistryCreatnineActive?: Maybe<Scalars['Boolean']>;
  chemistryCreatnineDate?: Maybe<Scalars['Time']>;
  chemistryCreatnineResults?: Maybe<Scalars['String']>;
  chemistryFbsRbsActive?: Maybe<Scalars['Boolean']>;
  chemistryFbsRbsDate?: Maybe<Scalars['Time']>;
  chemistryFbsRbsResults?: Maybe<Scalars['String']>;
  chemistryHdlActive?: Maybe<Scalars['Boolean']>;
  chemistryHdlDate?: Maybe<Scalars['Time']>;
  chemistryHdlResults?: Maybe<Scalars['String']>;
  chemistryLdlActive?: Maybe<Scalars['Boolean']>;
  chemistryLdlDate?: Maybe<Scalars['Time']>;
  chemistryLdlResults?: Maybe<Scalars['String']>;
  chemistrySgotActive?: Maybe<Scalars['Boolean']>;
  chemistrySgotDate?: Maybe<Scalars['Time']>;
  chemistrySgotResults?: Maybe<Scalars['String']>;
  chemistrySgptActive?: Maybe<Scalars['Boolean']>;
  chemistrySgptDate?: Maybe<Scalars['Time']>;
  chemistrySgptResults?: Maybe<Scalars['String']>;
  chemistryTotalProteinActive?: Maybe<Scalars['Boolean']>;
  chemistryTotalProteinDate?: Maybe<Scalars['Time']>;
  chemistryTotalProteinResults?: Maybe<Scalars['String']>;
  chemistryTriglyceridesActive?: Maybe<Scalars['Boolean']>;
  chemistryTriglyceridesDate?: Maybe<Scalars['Time']>;
  chemistryTriglyceridesResults?: Maybe<Scalars['String']>;
  chemistryUreaActive?: Maybe<Scalars['Boolean']>;
  chemistryUreaDate?: Maybe<Scalars['Time']>;
  chemistryUreaResults?: Maybe<Scalars['String']>;
  chemistryUricAcidActive?: Maybe<Scalars['Boolean']>;
  chemistryUricAcidDate?: Maybe<Scalars['Time']>;
  chemistryUricAcidResults?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  documents: Array<Maybe<File>>;
  electrolytesCa2PlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesCa2PlusDate?: Maybe<Scalars['Time']>;
  electrolytesCa2PlusResults?: Maybe<Scalars['String']>;
  electrolytesClMinusActive?: Maybe<Scalars['Boolean']>;
  electrolytesClMinusDate?: Maybe<Scalars['Time']>;
  electrolytesClMinusResults?: Maybe<Scalars['String']>;
  electrolytesKPlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesKPlusDate?: Maybe<Scalars['Time']>;
  electrolytesKPlusResults?: Maybe<Scalars['String']>;
  electrolytesMg2PlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesMg2PlusDate?: Maybe<Scalars['Time']>;
  electrolytesMg2PlusResults?: Maybe<Scalars['String']>;
  electrolytesNaPlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesNaPlusDate?: Maybe<Scalars['Time']>;
  electrolytesNaPlusResults?: Maybe<Scalars['String']>;
  electrolytesPMinusActive?: Maybe<Scalars['Boolean']>;
  electrolytesPMinusDate?: Maybe<Scalars['Time']>;
  electrolytesPMinusResults?: Maybe<Scalars['String']>;
  generalText?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images: Array<Maybe<File>>;
  labOrderId: Scalars['ID'];
  labType: LabType;
  labTypeId?: Maybe<Scalars['ID']>;
  labTypeTitle: Scalars['String'];
  leftEyeImages: Array<Maybe<File>>;
  leftEyeSketches: Array<Maybe<File>>;
  leftEyeText?: Maybe<Scalars['String']>;
  liverAlpActive?: Maybe<Scalars['Boolean']>;
  liverAlpDate?: Maybe<Scalars['Time']>;
  liverAlpResults?: Maybe<Scalars['String']>;
  liverAltsgptActive?: Maybe<Scalars['Boolean']>;
  liverAltsgptDate?: Maybe<Scalars['Time']>;
  liverAltsgptResults?: Maybe<Scalars['String']>;
  liverAstsgotActive?: Maybe<Scalars['Boolean']>;
  liverAstsgotDate?: Maybe<Scalars['Time']>;
  liverAstsgotResults?: Maybe<Scalars['String']>;
  liverCoagulationInrActive?: Maybe<Scalars['Boolean']>;
  liverCoagulationInrDate?: Maybe<Scalars['Time']>;
  liverCoagulationInrResults?: Maybe<Scalars['String']>;
  liverCoagulationPtActive?: Maybe<Scalars['Boolean']>;
  liverCoagulationPtDate?: Maybe<Scalars['Time']>;
  liverCoagulationPtResults?: Maybe<Scalars['String']>;
  liverCoagulationPttActive?: Maybe<Scalars['Boolean']>;
  liverCoagulationPttDate?: Maybe<Scalars['Time']>;
  liverCoagulationPttResults?: Maybe<Scalars['String']>;
  microscopyBacteriaActive?: Maybe<Scalars['Boolean']>;
  microscopyBacteriaDate?: Maybe<Scalars['Time']>;
  microscopyBacteriaResults?: Maybe<Scalars['String']>;
  microscopyCastsActive?: Maybe<Scalars['Boolean']>;
  microscopyCastsDate?: Maybe<Scalars['Time']>;
  microscopyCastsResults?: Maybe<Scalars['String']>;
  microscopyCrystalsActive?: Maybe<Scalars['Boolean']>;
  microscopyCrystalsDate?: Maybe<Scalars['Time']>;
  microscopyCrystalsResults?: Maybe<Scalars['String']>;
  microscopyEpitCellsActive?: Maybe<Scalars['Boolean']>;
  microscopyEpitCellsDate?: Maybe<Scalars['Time']>;
  microscopyEpitCellsResults?: Maybe<Scalars['String']>;
  microscopyHcgActive?: Maybe<Scalars['Boolean']>;
  microscopyHcgDate?: Maybe<Scalars['Time']>;
  microscopyHcgResults?: Maybe<Scalars['String']>;
  microscopyRbcActive?: Maybe<Scalars['Boolean']>;
  microscopyRbcDate?: Maybe<Scalars['Time']>;
  microscopyRbcResults?: Maybe<Scalars['String']>;
  microscopyWbcActive?: Maybe<Scalars['Boolean']>;
  microscopyWbcDate?: Maybe<Scalars['Time']>;
  microscopyWbcResults?: Maybe<Scalars['String']>;
  orderNote: Scalars['String'];
  patientChartId: Scalars['ID'];
  payments: Array<Payment>;
  receptionNote: Scalars['String'];
  renalBunActive?: Maybe<Scalars['Boolean']>;
  renalBunDate?: Maybe<Scalars['Time']>;
  renalBunResults?: Maybe<Scalars['String']>;
  renalCrActive?: Maybe<Scalars['Boolean']>;
  renalCrDate?: Maybe<Scalars['Time']>;
  renalCrResults?: Maybe<Scalars['String']>;
  rightEyeImages: Array<Maybe<File>>;
  rightEyeSketches: Array<Maybe<File>>;
  rightEyeText?: Maybe<Scalars['String']>;
  serologyAsoActive?: Maybe<Scalars['Boolean']>;
  serologyAsoDate?: Maybe<Scalars['Time']>;
  serologyAsoResults?: Maybe<Scalars['String']>;
  serologyHbsAgActive?: Maybe<Scalars['Boolean']>;
  serologyHbsAgDate?: Maybe<Scalars['Time']>;
  serologyHbsAgResults?: Maybe<Scalars['String']>;
  serologyHcvAbActive?: Maybe<Scalars['Boolean']>;
  serologyHcvAbDate?: Maybe<Scalars['Time']>;
  serologyHcvAbResults?: Maybe<Scalars['String']>;
  serologyHpayloryAgActive?: Maybe<Scalars['Boolean']>;
  serologyHpayloryAgDate?: Maybe<Scalars['Time']>;
  serologyHpayloryAgResults?: Maybe<Scalars['String']>;
  serologyHpyloryAbActive?: Maybe<Scalars['Boolean']>;
  serologyHpyloryAbDate?: Maybe<Scalars['Time']>;
  serologyHpyloryAbResults?: Maybe<Scalars['String']>;
  serologyRfActive?: Maybe<Scalars['Boolean']>;
  serologyRfDate?: Maybe<Scalars['Time']>;
  serologyRfResults?: Maybe<Scalars['String']>;
  serologyVdrlActive?: Maybe<Scalars['Boolean']>;
  serologyVdrlDate?: Maybe<Scalars['Time']>;
  serologyVdrlResults?: Maybe<Scalars['String']>;
  serologyWeilFelixActive?: Maybe<Scalars['Boolean']>;
  serologyWeilFelixDate?: Maybe<Scalars['Time']>;
  serologyWeilFelixResults?: Maybe<Scalars['String']>;
  serologyWidalHActive?: Maybe<Scalars['Boolean']>;
  serologyWidalHDate?: Maybe<Scalars['Time']>;
  serologyWidalHResults?: Maybe<Scalars['String']>;
  serologyWidalOActive?: Maybe<Scalars['Boolean']>;
  serologyWidalODate?: Maybe<Scalars['Time']>;
  serologyWidalOResults?: Maybe<Scalars['String']>;
  status: LabStatus;
  stoolConcentrationActive?: Maybe<Scalars['Boolean']>;
  stoolConcentrationDate?: Maybe<Scalars['Time']>;
  stoolConcentrationResults?: Maybe<Scalars['String']>;
  stoolConsistencyActive?: Maybe<Scalars['Boolean']>;
  stoolConsistencyDate?: Maybe<Scalars['Time']>;
  stoolConsistencyResults?: Maybe<Scalars['String']>;
  stoolOccultBloodActive?: Maybe<Scalars['Boolean']>;
  stoolOccultBloodDate?: Maybe<Scalars['Time']>;
  stoolOccultBloodResults?: Maybe<Scalars['String']>;
  stoolOpActive?: Maybe<Scalars['Boolean']>;
  stoolOpDate?: Maybe<Scalars['Time']>;
  stoolOpResults?: Maybe<Scalars['String']>;
  thyroidFreeT3Active?: Maybe<Scalars['Boolean']>;
  thyroidFreeT3Date?: Maybe<Scalars['Time']>;
  thyroidFreeT3Results?: Maybe<Scalars['String']>;
  thyroidTotalT4Active?: Maybe<Scalars['Boolean']>;
  thyroidTotalT4Date?: Maybe<Scalars['Time']>;
  thyroidTotalT4Results?: Maybe<Scalars['String']>;
  thyroidTshActive?: Maybe<Scalars['Boolean']>;
  thyroidTshDate?: Maybe<Scalars['Time']>;
  thyroidTshResults?: Maybe<Scalars['String']>;
  urinalysisAppearanceActive?: Maybe<Scalars['Boolean']>;
  urinalysisAppearanceDate?: Maybe<Scalars['Time']>;
  urinalysisAppearanceResults?: Maybe<Scalars['String']>;
  urinalysisBilirubinActive?: Maybe<Scalars['Boolean']>;
  urinalysisBilirubinDate?: Maybe<Scalars['Time']>;
  urinalysisBilirubinResults?: Maybe<Scalars['String']>;
  urinalysisBloodActive?: Maybe<Scalars['Boolean']>;
  urinalysisBloodDate?: Maybe<Scalars['Time']>;
  urinalysisBloodResults?: Maybe<Scalars['String']>;
  urinalysisColorActive?: Maybe<Scalars['Boolean']>;
  urinalysisColorDate?: Maybe<Scalars['Time']>;
  urinalysisColorResults?: Maybe<Scalars['String']>;
  urinalysisGlucoseActive?: Maybe<Scalars['Boolean']>;
  urinalysisGlucoseDate?: Maybe<Scalars['Time']>;
  urinalysisGlucoseResults?: Maybe<Scalars['String']>;
  urinalysisKetoneActive?: Maybe<Scalars['Boolean']>;
  urinalysisKetoneDate?: Maybe<Scalars['Time']>;
  urinalysisKetoneResults?: Maybe<Scalars['String']>;
  urinalysisLeukocyteActive?: Maybe<Scalars['Boolean']>;
  urinalysisLeukocyteDate?: Maybe<Scalars['Time']>;
  urinalysisLeukocyteResults?: Maybe<Scalars['String']>;
  urinalysisPhActive?: Maybe<Scalars['Boolean']>;
  urinalysisPhDate?: Maybe<Scalars['Time']>;
  urinalysisPhResults?: Maybe<Scalars['String']>;
  urinalysisProteinActive?: Maybe<Scalars['Boolean']>;
  urinalysisProteinDate?: Maybe<Scalars['Time']>;
  urinalysisProteinResults?: Maybe<Scalars['String']>;
  urinalysisSgActive?: Maybe<Scalars['Boolean']>;
  urinalysisSgDate?: Maybe<Scalars['Time']>;
  urinalysisSgResults?: Maybe<Scalars['String']>;
  urinalysisUrobilingenActive?: Maybe<Scalars['Boolean']>;
  urinalysisUrobilingenDate?: Maybe<Scalars['Time']>;
  urinalysisUrobilingenResults?: Maybe<Scalars['String']>;
};

export type LabConnection = Connection & {
  __typename?: 'LabConnection';
  edges: Array<Maybe<LabEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LabDeleteFileInput = {
  fileId: Scalars['ID'];
  labId: Scalars['ID'];
};

export type LabEdge = {
  __typename?: 'LabEdge';
  node: Lab;
};

export type LabFilter = {
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type LabInput = {
  bacterologyAfb1Active?: InputMaybe<Scalars['Boolean']>;
  bacterologyAfb1Date?: InputMaybe<Scalars['Time']>;
  bacterologyAfb1Results?: InputMaybe<Scalars['String']>;
  bacterologyAfb2Active?: InputMaybe<Scalars['Boolean']>;
  bacterologyAfb2Date?: InputMaybe<Scalars['Time']>;
  bacterologyAfb2Results?: InputMaybe<Scalars['String']>;
  bacterologyAfb3Active?: InputMaybe<Scalars['Boolean']>;
  bacterologyAfb3Date?: InputMaybe<Scalars['Time']>;
  bacterologyAfb3Results?: InputMaybe<Scalars['String']>;
  bacterologyCultureActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyCultureDate?: InputMaybe<Scalars['Time']>;
  bacterologyCultureResults?: InputMaybe<Scalars['String']>;
  bacterologyGramStainActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyGramStainDate?: InputMaybe<Scalars['Time']>;
  bacterologyGramStainResults?: InputMaybe<Scalars['String']>;
  bacterologyKohActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyKohDate?: InputMaybe<Scalars['Time']>;
  bacterologyKohResults?: InputMaybe<Scalars['String']>;
  bacterologySampleActive?: InputMaybe<Scalars['Boolean']>;
  bacterologySampleDate?: InputMaybe<Scalars['Time']>;
  bacterologySampleResults?: InputMaybe<Scalars['String']>;
  bacterologyWetFilmActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyWetFilmDate?: InputMaybe<Scalars['Time']>;
  bacterologyWetFilmResults?: InputMaybe<Scalars['String']>;
  cbcBloodFilmActive?: InputMaybe<Scalars['Boolean']>;
  cbcBloodFilmDate?: InputMaybe<Scalars['Time']>;
  cbcBloodFilmResults?: InputMaybe<Scalars['String']>;
  cbcBloodGroupActive?: InputMaybe<Scalars['Boolean']>;
  cbcBloodGroupDate?: InputMaybe<Scalars['Time']>;
  cbcBloodGroupResults?: InputMaybe<Scalars['String']>;
  cbcEsrActive?: InputMaybe<Scalars['Boolean']>;
  cbcEsrDate?: InputMaybe<Scalars['Time']>;
  cbcEsrResults?: InputMaybe<Scalars['String']>;
  cbcHctActive?: InputMaybe<Scalars['Boolean']>;
  cbcHctDate?: InputMaybe<Scalars['Time']>;
  cbcHctResults?: InputMaybe<Scalars['String']>;
  cbcHgbActive?: InputMaybe<Scalars['Boolean']>;
  cbcHgbDate?: InputMaybe<Scalars['Time']>;
  cbcHgbResults?: InputMaybe<Scalars['String']>;
  cbcPltActive?: InputMaybe<Scalars['Boolean']>;
  cbcPltDate?: InputMaybe<Scalars['Time']>;
  cbcPltResults?: InputMaybe<Scalars['String']>;
  cbcRhActive?: InputMaybe<Scalars['Boolean']>;
  cbcRhDate?: InputMaybe<Scalars['Time']>;
  cbcRhResults?: InputMaybe<Scalars['String']>;
  cbcWbcActive?: InputMaybe<Scalars['Boolean']>;
  cbcWbcDate?: InputMaybe<Scalars['Time']>;
  cbcWbcResults?: InputMaybe<Scalars['String']>;
  chemistryAlkalinePhosphatesActive?: InputMaybe<Scalars['Boolean']>;
  chemistryAlkalinePhosphatesDate?: InputMaybe<Scalars['Time']>;
  chemistryAlkalinePhosphatesResults?: InputMaybe<Scalars['String']>;
  chemistryBilirubinDirectActive?: InputMaybe<Scalars['Boolean']>;
  chemistryBilirubinDirectDate?: InputMaybe<Scalars['Time']>;
  chemistryBilirubinDirectResults?: InputMaybe<Scalars['String']>;
  chemistryBilirubinTotalActive?: InputMaybe<Scalars['Boolean']>;
  chemistryBilirubinTotalDate?: InputMaybe<Scalars['Time']>;
  chemistryBilirubinTotalResults?: InputMaybe<Scalars['String']>;
  chemistryBunActive?: InputMaybe<Scalars['Boolean']>;
  chemistryBunDate?: InputMaybe<Scalars['Time']>;
  chemistryBunResults?: InputMaybe<Scalars['String']>;
  chemistryCholestrolActive?: InputMaybe<Scalars['Boolean']>;
  chemistryCholestrolDate?: InputMaybe<Scalars['Time']>;
  chemistryCholestrolResults?: InputMaybe<Scalars['String']>;
  chemistryCreatnineActive?: InputMaybe<Scalars['Boolean']>;
  chemistryCreatnineDate?: InputMaybe<Scalars['Time']>;
  chemistryCreatnineResults?: InputMaybe<Scalars['String']>;
  chemistryFbsRbsActive?: InputMaybe<Scalars['Boolean']>;
  chemistryFbsRbsDate?: InputMaybe<Scalars['Time']>;
  chemistryFbsRbsResults?: InputMaybe<Scalars['String']>;
  chemistryHdlActive?: InputMaybe<Scalars['Boolean']>;
  chemistryHdlDate?: InputMaybe<Scalars['Time']>;
  chemistryHdlResults?: InputMaybe<Scalars['String']>;
  chemistryLdlActive?: InputMaybe<Scalars['Boolean']>;
  chemistryLdlDate?: InputMaybe<Scalars['Time']>;
  chemistryLdlResults?: InputMaybe<Scalars['String']>;
  chemistrySgotActive?: InputMaybe<Scalars['Boolean']>;
  chemistrySgotDate?: InputMaybe<Scalars['Time']>;
  chemistrySgotResults?: InputMaybe<Scalars['String']>;
  chemistrySgptActive?: InputMaybe<Scalars['Boolean']>;
  chemistrySgptDate?: InputMaybe<Scalars['Time']>;
  chemistrySgptResults?: InputMaybe<Scalars['String']>;
  chemistryTotalProteinActive?: InputMaybe<Scalars['Boolean']>;
  chemistryTotalProteinDate?: InputMaybe<Scalars['Time']>;
  chemistryTotalProteinResults?: InputMaybe<Scalars['String']>;
  chemistryTriglyceridesActive?: InputMaybe<Scalars['Boolean']>;
  chemistryTriglyceridesDate?: InputMaybe<Scalars['Time']>;
  chemistryTriglyceridesResults?: InputMaybe<Scalars['String']>;
  chemistryUreaActive?: InputMaybe<Scalars['Boolean']>;
  chemistryUreaDate?: InputMaybe<Scalars['Time']>;
  chemistryUreaResults?: InputMaybe<Scalars['String']>;
  chemistryUricAcidActive?: InputMaybe<Scalars['Boolean']>;
  chemistryUricAcidDate?: InputMaybe<Scalars['Time']>;
  chemistryUricAcidResults?: InputMaybe<Scalars['String']>;
  documentIds: Array<InputMaybe<Scalars['ID']>>;
  electrolytesCa2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesCa2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesCa2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesClMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesClMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesClMinusResults?: InputMaybe<Scalars['String']>;
  electrolytesKPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesKPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesKPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesMg2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesMg2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesMg2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesNaPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesNaPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesNaPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesPMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesPMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesPMinusResults?: InputMaybe<Scalars['String']>;
  generalText?: InputMaybe<Scalars['String']>;
  labIds: Array<InputMaybe<Scalars['ID']>>;
  labOrderId: Scalars['ID'];
  leftEyeImageIds: Array<InputMaybe<Scalars['ID']>>;
  leftEyeSketcheIds: Array<InputMaybe<Scalars['ID']>>;
  leftEyeText?: InputMaybe<Scalars['String']>;
  liverAlpActive?: InputMaybe<Scalars['Boolean']>;
  liverAlpDate?: InputMaybe<Scalars['Time']>;
  liverAlpResults?: InputMaybe<Scalars['String']>;
  liverAltsgptActive?: InputMaybe<Scalars['Boolean']>;
  liverAltsgptDate?: InputMaybe<Scalars['Time']>;
  liverAltsgptResults?: InputMaybe<Scalars['String']>;
  liverAstsgotActive?: InputMaybe<Scalars['Boolean']>;
  liverAstsgotDate?: InputMaybe<Scalars['Time']>;
  liverAstsgotResults?: InputMaybe<Scalars['String']>;
  liverCoagulationInrActive?: InputMaybe<Scalars['Boolean']>;
  liverCoagulationInrDate?: InputMaybe<Scalars['Time']>;
  liverCoagulationInrResults?: InputMaybe<Scalars['String']>;
  liverCoagulationPtActive?: InputMaybe<Scalars['Boolean']>;
  liverCoagulationPtDate?: InputMaybe<Scalars['Time']>;
  liverCoagulationPtResults?: InputMaybe<Scalars['String']>;
  liverCoagulationPttActive?: InputMaybe<Scalars['Boolean']>;
  liverCoagulationPttDate?: InputMaybe<Scalars['Time']>;
  liverCoagulationPttResults?: InputMaybe<Scalars['String']>;
  microscopyBacteriaActive?: InputMaybe<Scalars['Boolean']>;
  microscopyBacteriaDate?: InputMaybe<Scalars['Time']>;
  microscopyBacteriaResults?: InputMaybe<Scalars['String']>;
  microscopyCastsActive?: InputMaybe<Scalars['Boolean']>;
  microscopyCastsDate?: InputMaybe<Scalars['Time']>;
  microscopyCastsResults?: InputMaybe<Scalars['String']>;
  microscopyCrystalsActive?: InputMaybe<Scalars['Boolean']>;
  microscopyCrystalsDate?: InputMaybe<Scalars['Time']>;
  microscopyCrystalsResults?: InputMaybe<Scalars['String']>;
  microscopyEpitCellsActive?: InputMaybe<Scalars['Boolean']>;
  microscopyEpitCellsDate?: InputMaybe<Scalars['Time']>;
  microscopyEpitCellsResults?: InputMaybe<Scalars['String']>;
  microscopyHcgActive?: InputMaybe<Scalars['Boolean']>;
  microscopyHcgDate?: InputMaybe<Scalars['Time']>;
  microscopyHcgResults?: InputMaybe<Scalars['String']>;
  microscopyRbcActive?: InputMaybe<Scalars['Boolean']>;
  microscopyRbcDate?: InputMaybe<Scalars['Time']>;
  microscopyRbcResults?: InputMaybe<Scalars['String']>;
  microscopyWbcActive?: InputMaybe<Scalars['Boolean']>;
  microscopyWbcDate?: InputMaybe<Scalars['Time']>;
  microscopyWbcResults?: InputMaybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
  renalBunActive?: InputMaybe<Scalars['Boolean']>;
  renalBunDate?: InputMaybe<Scalars['Time']>;
  renalBunResults?: InputMaybe<Scalars['String']>;
  renalCrActive?: InputMaybe<Scalars['Boolean']>;
  renalCrDate?: InputMaybe<Scalars['Time']>;
  renalCrResults?: InputMaybe<Scalars['String']>;
  rightEyeImageIds: Array<InputMaybe<Scalars['ID']>>;
  rightEyeSketcheIds: Array<InputMaybe<Scalars['ID']>>;
  rightEyeText?: InputMaybe<Scalars['String']>;
  serologyAsoActive?: InputMaybe<Scalars['Boolean']>;
  serologyAsoDate?: InputMaybe<Scalars['Time']>;
  serologyAsoResults?: InputMaybe<Scalars['String']>;
  serologyHbsAgActive?: InputMaybe<Scalars['Boolean']>;
  serologyHbsAgDate?: InputMaybe<Scalars['Time']>;
  serologyHbsAgResults?: InputMaybe<Scalars['String']>;
  serologyHcvAbActive?: InputMaybe<Scalars['Boolean']>;
  serologyHcvAbDate?: InputMaybe<Scalars['Time']>;
  serologyHcvAbResults?: InputMaybe<Scalars['String']>;
  serologyHpayloryAgActive?: InputMaybe<Scalars['Boolean']>;
  serologyHpayloryAgDate?: InputMaybe<Scalars['Time']>;
  serologyHpayloryAgResults?: InputMaybe<Scalars['String']>;
  serologyHpyloryAbActive?: InputMaybe<Scalars['Boolean']>;
  serologyHpyloryAbDate?: InputMaybe<Scalars['Time']>;
  serologyHpyloryAbResults?: InputMaybe<Scalars['String']>;
  serologyRfActive?: InputMaybe<Scalars['Boolean']>;
  serologyRfDate?: InputMaybe<Scalars['Time']>;
  serologyRfResults?: InputMaybe<Scalars['String']>;
  serologyVdrlActive?: InputMaybe<Scalars['Boolean']>;
  serologyVdrlDate?: InputMaybe<Scalars['Time']>;
  serologyVdrlResults?: InputMaybe<Scalars['String']>;
  serologyWeilFelixActive?: InputMaybe<Scalars['Boolean']>;
  serologyWeilFelixDate?: InputMaybe<Scalars['Time']>;
  serologyWeilFelixResults?: InputMaybe<Scalars['String']>;
  serologyWidalHActive?: InputMaybe<Scalars['Boolean']>;
  serologyWidalHDate?: InputMaybe<Scalars['Time']>;
  serologyWidalHResults?: InputMaybe<Scalars['String']>;
  serologyWidalOActive?: InputMaybe<Scalars['Boolean']>;
  serologyWidalODate?: InputMaybe<Scalars['Time']>;
  serologyWidalOResults?: InputMaybe<Scalars['String']>;
  stoolConcentrationActive?: InputMaybe<Scalars['Boolean']>;
  stoolConcentrationDate?: InputMaybe<Scalars['Time']>;
  stoolConcentrationResults?: InputMaybe<Scalars['String']>;
  stoolConsistencyActive?: InputMaybe<Scalars['Boolean']>;
  stoolConsistencyDate?: InputMaybe<Scalars['Time']>;
  stoolConsistencyResults?: InputMaybe<Scalars['String']>;
  stoolOccultBloodActive?: InputMaybe<Scalars['Boolean']>;
  stoolOccultBloodDate?: InputMaybe<Scalars['Time']>;
  stoolOccultBloodResults?: InputMaybe<Scalars['String']>;
  stoolOpActive?: InputMaybe<Scalars['Boolean']>;
  stoolOpDate?: InputMaybe<Scalars['Time']>;
  stoolOpResults?: InputMaybe<Scalars['String']>;
  thyroidFreeT3Active?: InputMaybe<Scalars['Boolean']>;
  thyroidFreeT3Date?: InputMaybe<Scalars['Time']>;
  thyroidFreeT3Results?: InputMaybe<Scalars['String']>;
  thyroidTotalT4Active?: InputMaybe<Scalars['Boolean']>;
  thyroidTotalT4Date?: InputMaybe<Scalars['Time']>;
  thyroidTotalT4Results?: InputMaybe<Scalars['String']>;
  thyroidTshActive?: InputMaybe<Scalars['Boolean']>;
  thyroidTshDate?: InputMaybe<Scalars['Time']>;
  thyroidTshResults?: InputMaybe<Scalars['String']>;
  urinalysisAppearanceActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisAppearanceDate?: InputMaybe<Scalars['Time']>;
  urinalysisAppearanceResults?: InputMaybe<Scalars['String']>;
  urinalysisBilirubinActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisBilirubinDate?: InputMaybe<Scalars['Time']>;
  urinalysisBilirubinResults?: InputMaybe<Scalars['String']>;
  urinalysisBloodActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisBloodDate?: InputMaybe<Scalars['Time']>;
  urinalysisBloodResults?: InputMaybe<Scalars['String']>;
  urinalysisColorActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisColorDate?: InputMaybe<Scalars['Time']>;
  urinalysisColorResults?: InputMaybe<Scalars['String']>;
  urinalysisGlucoseActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisGlucoseDate?: InputMaybe<Scalars['Time']>;
  urinalysisGlucoseResults?: InputMaybe<Scalars['String']>;
  urinalysisKetoneActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisKetoneDate?: InputMaybe<Scalars['Time']>;
  urinalysisKetoneResults?: InputMaybe<Scalars['String']>;
  urinalysisLeukocyteActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisLeukocyteDate?: InputMaybe<Scalars['Time']>;
  urinalysisLeukocyteResults?: InputMaybe<Scalars['String']>;
  urinalysisPhActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisPhDate?: InputMaybe<Scalars['Time']>;
  urinalysisPhResults?: InputMaybe<Scalars['String']>;
  urinalysisProteinActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisProteinDate?: InputMaybe<Scalars['Time']>;
  urinalysisProteinResults?: InputMaybe<Scalars['String']>;
  urinalysisSgActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisSgDate?: InputMaybe<Scalars['Time']>;
  urinalysisSgResults?: InputMaybe<Scalars['String']>;
  urinalysisUrobilingenActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisUrobilingenDate?: InputMaybe<Scalars['Time']>;
  urinalysisUrobilingenResults?: InputMaybe<Scalars['String']>;
};

export type LabOrder = {
  __typename?: 'LabOrder';
  createdAt?: Maybe<Scalars['Time']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  labs: Array<Lab>;
  lastName: Scalars['String'];
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  phoneNo: Scalars['String'];
  status: LabOrderStatus;
  userName: Scalars['String'];
};

export type LabOrderConnection = Connection & {
  __typename?: 'LabOrderConnection';
  edges: Array<LabOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LabOrderEdge = {
  __typename?: 'LabOrderEdge';
  node: LabOrder;
};

export type LabOrderFilter = {
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum LabOrderStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type LabOrderUpdateInput = {
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  orderNote?: InputMaybe<Scalars['String']>;
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  phoneNo?: InputMaybe<Scalars['String']>;
  receptionNote?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<LabOrderStatus>;
  userName?: InputMaybe<Scalars['String']>;
};

export enum LabStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type LabType = {
  __typename?: 'LabType';
  active: Scalars['Boolean'];
  billings: Array<Maybe<Billing>>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type LabTypeConnection = Connection & {
  __typename?: 'LabTypeConnection';
  edges: Array<Maybe<LabTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LabTypeEdge = {
  __typename?: 'LabTypeEdge';
  node: LabType;
};

export type LabTypeInput = {
  active: Scalars['Boolean'];
  billingIds: Array<InputMaybe<Scalars['ID']>>;
  title: Scalars['String'];
};

export type LabTypeUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  billingIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type LabUpdateInput = {
  bacterologyAfb1Active?: InputMaybe<Scalars['Boolean']>;
  bacterologyAfb1Date?: InputMaybe<Scalars['Time']>;
  bacterologyAfb1Results?: InputMaybe<Scalars['String']>;
  bacterologyAfb2Active?: InputMaybe<Scalars['Boolean']>;
  bacterologyAfb2Date?: InputMaybe<Scalars['Time']>;
  bacterologyAfb2Results?: InputMaybe<Scalars['String']>;
  bacterologyAfb3Active?: InputMaybe<Scalars['Boolean']>;
  bacterologyAfb3Date?: InputMaybe<Scalars['Time']>;
  bacterologyAfb3Results?: InputMaybe<Scalars['String']>;
  bacterologyCultureActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyCultureDate?: InputMaybe<Scalars['Time']>;
  bacterologyCultureResults?: InputMaybe<Scalars['String']>;
  bacterologyGramStainActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyGramStainDate?: InputMaybe<Scalars['Time']>;
  bacterologyGramStainResults?: InputMaybe<Scalars['String']>;
  bacterologyKohActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyKohDate?: InputMaybe<Scalars['Time']>;
  bacterologyKohResults?: InputMaybe<Scalars['String']>;
  bacterologySampleActive?: InputMaybe<Scalars['Boolean']>;
  bacterologySampleDate?: InputMaybe<Scalars['Time']>;
  bacterologySampleResults?: InputMaybe<Scalars['String']>;
  bacterologyWetFilmActive?: InputMaybe<Scalars['Boolean']>;
  bacterologyWetFilmDate?: InputMaybe<Scalars['Time']>;
  bacterologyWetFilmResults?: InputMaybe<Scalars['String']>;
  cbcBloodFilmActive?: InputMaybe<Scalars['Boolean']>;
  cbcBloodFilmDate?: InputMaybe<Scalars['Time']>;
  cbcBloodFilmResults?: InputMaybe<Scalars['String']>;
  cbcBloodGroupActive?: InputMaybe<Scalars['Boolean']>;
  cbcBloodGroupDate?: InputMaybe<Scalars['Time']>;
  cbcBloodGroupResults?: InputMaybe<Scalars['String']>;
  cbcEsrActive?: InputMaybe<Scalars['Boolean']>;
  cbcEsrDate?: InputMaybe<Scalars['Time']>;
  cbcEsrResults?: InputMaybe<Scalars['String']>;
  cbcHctActive?: InputMaybe<Scalars['Boolean']>;
  cbcHctDate?: InputMaybe<Scalars['Time']>;
  cbcHctResults?: InputMaybe<Scalars['String']>;
  cbcHgbActive?: InputMaybe<Scalars['Boolean']>;
  cbcHgbDate?: InputMaybe<Scalars['Time']>;
  cbcHgbResults?: InputMaybe<Scalars['String']>;
  cbcPltActive?: InputMaybe<Scalars['Boolean']>;
  cbcPltDate?: InputMaybe<Scalars['Time']>;
  cbcPltResults?: InputMaybe<Scalars['String']>;
  cbcRhActive?: InputMaybe<Scalars['Boolean']>;
  cbcRhDate?: InputMaybe<Scalars['Time']>;
  cbcRhResults?: InputMaybe<Scalars['String']>;
  cbcWbcActive?: InputMaybe<Scalars['Boolean']>;
  cbcWbcDate?: InputMaybe<Scalars['Time']>;
  cbcWbcResults?: InputMaybe<Scalars['String']>;
  chemistryAlkalinePhosphatesActive?: InputMaybe<Scalars['Boolean']>;
  chemistryAlkalinePhosphatesDate?: InputMaybe<Scalars['Time']>;
  chemistryAlkalinePhosphatesResults?: InputMaybe<Scalars['String']>;
  chemistryBilirubinDirectActive?: InputMaybe<Scalars['Boolean']>;
  chemistryBilirubinDirectDate?: InputMaybe<Scalars['Time']>;
  chemistryBilirubinDirectResults?: InputMaybe<Scalars['String']>;
  chemistryBilirubinTotalActive?: InputMaybe<Scalars['Boolean']>;
  chemistryBilirubinTotalDate?: InputMaybe<Scalars['Time']>;
  chemistryBilirubinTotalResults?: InputMaybe<Scalars['String']>;
  chemistryBunActive?: InputMaybe<Scalars['Boolean']>;
  chemistryBunDate?: InputMaybe<Scalars['Time']>;
  chemistryBunResults?: InputMaybe<Scalars['String']>;
  chemistryCholestrolActive?: InputMaybe<Scalars['Boolean']>;
  chemistryCholestrolDate?: InputMaybe<Scalars['Time']>;
  chemistryCholestrolResults?: InputMaybe<Scalars['String']>;
  chemistryCreatnineActive?: InputMaybe<Scalars['Boolean']>;
  chemistryCreatnineDate?: InputMaybe<Scalars['Time']>;
  chemistryCreatnineResults?: InputMaybe<Scalars['String']>;
  chemistryFbsRbsActive?: InputMaybe<Scalars['Boolean']>;
  chemistryFbsRbsDate?: InputMaybe<Scalars['Time']>;
  chemistryFbsRbsResults?: InputMaybe<Scalars['String']>;
  chemistryHdlActive?: InputMaybe<Scalars['Boolean']>;
  chemistryHdlDate?: InputMaybe<Scalars['Time']>;
  chemistryHdlResults?: InputMaybe<Scalars['String']>;
  chemistryLdlActive?: InputMaybe<Scalars['Boolean']>;
  chemistryLdlDate?: InputMaybe<Scalars['Time']>;
  chemistryLdlResults?: InputMaybe<Scalars['String']>;
  chemistrySgotActive?: InputMaybe<Scalars['Boolean']>;
  chemistrySgotDate?: InputMaybe<Scalars['Time']>;
  chemistrySgotResults?: InputMaybe<Scalars['String']>;
  chemistrySgptActive?: InputMaybe<Scalars['Boolean']>;
  chemistrySgptDate?: InputMaybe<Scalars['Time']>;
  chemistrySgptResults?: InputMaybe<Scalars['String']>;
  chemistryTotalProteinActive?: InputMaybe<Scalars['Boolean']>;
  chemistryTotalProteinDate?: InputMaybe<Scalars['Time']>;
  chemistryTotalProteinResults?: InputMaybe<Scalars['String']>;
  chemistryTriglyceridesActive?: InputMaybe<Scalars['Boolean']>;
  chemistryTriglyceridesDate?: InputMaybe<Scalars['Time']>;
  chemistryTriglyceridesResults?: InputMaybe<Scalars['String']>;
  chemistryUreaActive?: InputMaybe<Scalars['Boolean']>;
  chemistryUreaDate?: InputMaybe<Scalars['Time']>;
  chemistryUreaResults?: InputMaybe<Scalars['String']>;
  chemistryUricAcidActive?: InputMaybe<Scalars['Boolean']>;
  chemistryUricAcidDate?: InputMaybe<Scalars['Time']>;
  chemistryUricAcidResults?: InputMaybe<Scalars['String']>;
  documents?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  electrolytesCa2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesCa2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesCa2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesClMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesClMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesClMinusResults?: InputMaybe<Scalars['String']>;
  electrolytesKPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesKPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesKPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesMg2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesMg2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesMg2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesNaPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesNaPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesNaPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesPMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesPMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesPMinusResults?: InputMaybe<Scalars['String']>;
  generalText?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  images?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  leftEyeImages?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  leftEyeSketches?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  leftEyeText?: InputMaybe<Scalars['String']>;
  liverAlpActive?: InputMaybe<Scalars['Boolean']>;
  liverAlpDate?: InputMaybe<Scalars['Time']>;
  liverAlpResults?: InputMaybe<Scalars['String']>;
  liverAltsgptActive?: InputMaybe<Scalars['Boolean']>;
  liverAltsgptDate?: InputMaybe<Scalars['Time']>;
  liverAltsgptResults?: InputMaybe<Scalars['String']>;
  liverAstsgotActive?: InputMaybe<Scalars['Boolean']>;
  liverAstsgotDate?: InputMaybe<Scalars['Time']>;
  liverAstsgotResults?: InputMaybe<Scalars['String']>;
  liverCoagulationInrActive?: InputMaybe<Scalars['Boolean']>;
  liverCoagulationInrDate?: InputMaybe<Scalars['Time']>;
  liverCoagulationInrResults?: InputMaybe<Scalars['String']>;
  liverCoagulationPtActive?: InputMaybe<Scalars['Boolean']>;
  liverCoagulationPtDate?: InputMaybe<Scalars['Time']>;
  liverCoagulationPtResults?: InputMaybe<Scalars['String']>;
  liverCoagulationPttActive?: InputMaybe<Scalars['Boolean']>;
  liverCoagulationPttDate?: InputMaybe<Scalars['Time']>;
  liverCoagulationPttResults?: InputMaybe<Scalars['String']>;
  microscopyBacteriaActive?: InputMaybe<Scalars['Boolean']>;
  microscopyBacteriaDate?: InputMaybe<Scalars['Time']>;
  microscopyBacteriaResults?: InputMaybe<Scalars['String']>;
  microscopyCastsActive?: InputMaybe<Scalars['Boolean']>;
  microscopyCastsDate?: InputMaybe<Scalars['Time']>;
  microscopyCastsResults?: InputMaybe<Scalars['String']>;
  microscopyCrystalsActive?: InputMaybe<Scalars['Boolean']>;
  microscopyCrystalsDate?: InputMaybe<Scalars['Time']>;
  microscopyCrystalsResults?: InputMaybe<Scalars['String']>;
  microscopyEpitCellsActive?: InputMaybe<Scalars['Boolean']>;
  microscopyEpitCellsDate?: InputMaybe<Scalars['Time']>;
  microscopyEpitCellsResults?: InputMaybe<Scalars['String']>;
  microscopyHcgActive?: InputMaybe<Scalars['Boolean']>;
  microscopyHcgDate?: InputMaybe<Scalars['Time']>;
  microscopyHcgResults?: InputMaybe<Scalars['String']>;
  microscopyRbcActive?: InputMaybe<Scalars['Boolean']>;
  microscopyRbcDate?: InputMaybe<Scalars['Time']>;
  microscopyRbcResults?: InputMaybe<Scalars['String']>;
  microscopyWbcActive?: InputMaybe<Scalars['Boolean']>;
  microscopyWbcDate?: InputMaybe<Scalars['Time']>;
  microscopyWbcResults?: InputMaybe<Scalars['String']>;
  renalBunActive?: InputMaybe<Scalars['Boolean']>;
  renalBunDate?: InputMaybe<Scalars['Time']>;
  renalBunResults?: InputMaybe<Scalars['String']>;
  renalCrActive?: InputMaybe<Scalars['Boolean']>;
  renalCrDate?: InputMaybe<Scalars['Time']>;
  renalCrResults?: InputMaybe<Scalars['String']>;
  rightEyeImages?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  rightEyeSketches?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  rightEyeText?: InputMaybe<Scalars['String']>;
  serologyAsoActive?: InputMaybe<Scalars['Boolean']>;
  serologyAsoDate?: InputMaybe<Scalars['Time']>;
  serologyAsoResults?: InputMaybe<Scalars['String']>;
  serologyHbsAgActive?: InputMaybe<Scalars['Boolean']>;
  serologyHbsAgDate?: InputMaybe<Scalars['Time']>;
  serologyHbsAgResults?: InputMaybe<Scalars['String']>;
  serologyHcvAbActive?: InputMaybe<Scalars['Boolean']>;
  serologyHcvAbDate?: InputMaybe<Scalars['Time']>;
  serologyHcvAbResults?: InputMaybe<Scalars['String']>;
  serologyHpayloryAgActive?: InputMaybe<Scalars['Boolean']>;
  serologyHpayloryAgDate?: InputMaybe<Scalars['Time']>;
  serologyHpayloryAgResults?: InputMaybe<Scalars['String']>;
  serologyHpyloryAbActive?: InputMaybe<Scalars['Boolean']>;
  serologyHpyloryAbDate?: InputMaybe<Scalars['Time']>;
  serologyHpyloryAbResults?: InputMaybe<Scalars['String']>;
  serologyRfActive?: InputMaybe<Scalars['Boolean']>;
  serologyRfDate?: InputMaybe<Scalars['Time']>;
  serologyRfResults?: InputMaybe<Scalars['String']>;
  serologyVdrlActive?: InputMaybe<Scalars['Boolean']>;
  serologyVdrlDate?: InputMaybe<Scalars['Time']>;
  serologyVdrlResults?: InputMaybe<Scalars['String']>;
  serologyWeilFelixActive?: InputMaybe<Scalars['Boolean']>;
  serologyWeilFelixDate?: InputMaybe<Scalars['Time']>;
  serologyWeilFelixResults?: InputMaybe<Scalars['String']>;
  serologyWidalHActive?: InputMaybe<Scalars['Boolean']>;
  serologyWidalHDate?: InputMaybe<Scalars['Time']>;
  serologyWidalHResults?: InputMaybe<Scalars['String']>;
  serologyWidalOActive?: InputMaybe<Scalars['Boolean']>;
  serologyWidalODate?: InputMaybe<Scalars['Time']>;
  serologyWidalOResults?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<LabStatus>;
  stoolConcentrationActive?: InputMaybe<Scalars['Boolean']>;
  stoolConcentrationDate?: InputMaybe<Scalars['Time']>;
  stoolConcentrationResults?: InputMaybe<Scalars['String']>;
  stoolConsistencyActive?: InputMaybe<Scalars['Boolean']>;
  stoolConsistencyDate?: InputMaybe<Scalars['Time']>;
  stoolConsistencyResults?: InputMaybe<Scalars['String']>;
  stoolOccultBloodActive?: InputMaybe<Scalars['Boolean']>;
  stoolOccultBloodDate?: InputMaybe<Scalars['Time']>;
  stoolOccultBloodResults?: InputMaybe<Scalars['String']>;
  stoolOpActive?: InputMaybe<Scalars['Boolean']>;
  stoolOpDate?: InputMaybe<Scalars['Time']>;
  stoolOpResults?: InputMaybe<Scalars['String']>;
  thyroidFreeT3Active?: InputMaybe<Scalars['Boolean']>;
  thyroidFreeT3Date?: InputMaybe<Scalars['Time']>;
  thyroidFreeT3Results?: InputMaybe<Scalars['String']>;
  thyroidTotalT4Active?: InputMaybe<Scalars['Boolean']>;
  thyroidTotalT4Date?: InputMaybe<Scalars['Time']>;
  thyroidTotalT4Results?: InputMaybe<Scalars['String']>;
  thyroidTshActive?: InputMaybe<Scalars['Boolean']>;
  thyroidTshDate?: InputMaybe<Scalars['Time']>;
  thyroidTshResults?: InputMaybe<Scalars['String']>;
  urinalysisAppearanceActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisAppearanceDate?: InputMaybe<Scalars['Time']>;
  urinalysisAppearanceResults?: InputMaybe<Scalars['String']>;
  urinalysisBilirubinActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisBilirubinDate?: InputMaybe<Scalars['Time']>;
  urinalysisBilirubinResults?: InputMaybe<Scalars['String']>;
  urinalysisBloodActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisBloodDate?: InputMaybe<Scalars['Time']>;
  urinalysisBloodResults?: InputMaybe<Scalars['String']>;
  urinalysisColorActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisColorDate?: InputMaybe<Scalars['Time']>;
  urinalysisColorResults?: InputMaybe<Scalars['String']>;
  urinalysisGlucoseActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisGlucoseDate?: InputMaybe<Scalars['Time']>;
  urinalysisGlucoseResults?: InputMaybe<Scalars['String']>;
  urinalysisKetoneActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisKetoneDate?: InputMaybe<Scalars['Time']>;
  urinalysisKetoneResults?: InputMaybe<Scalars['String']>;
  urinalysisLeukocyteActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisLeukocyteDate?: InputMaybe<Scalars['Time']>;
  urinalysisLeukocyteResults?: InputMaybe<Scalars['String']>;
  urinalysisPhActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisPhDate?: InputMaybe<Scalars['Time']>;
  urinalysisPhResults?: InputMaybe<Scalars['String']>;
  urinalysisProteinActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisProteinDate?: InputMaybe<Scalars['Time']>;
  urinalysisProteinResults?: InputMaybe<Scalars['String']>;
  urinalysisSgActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisSgDate?: InputMaybe<Scalars['Time']>;
  urinalysisSgResults?: InputMaybe<Scalars['String']>;
  urinalysisUrobilingenActive?: InputMaybe<Scalars['Boolean']>;
  urinalysisUrobilingenDate?: InputMaybe<Scalars['Time']>;
  urinalysisUrobilingenResults?: InputMaybe<Scalars['String']>;
};

export type Lifestyle = {
  __typename?: 'Lifestyle';
  description: Scalars['String'];
  id: Scalars['ID'];
  note: Scalars['String'];
  patientHistoryId: Scalars['ID'];
  title: Scalars['String'];
};

export type LifestyleInput = {
  description: Scalars['String'];
  note: Scalars['String'];
  patientHistoryId: Scalars['ID'];
  title: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type LifestyleType = {
  __typename?: 'LifestyleType';
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type LifestyleTypeConnection = Connection & {
  __typename?: 'LifestyleTypeConnection';
  edges: Array<Maybe<LifestyleTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type LifestyleTypeEdge = {
  __typename?: 'LifestyleTypeEdge';
  node: LifestyleType;
};

export type LifestyleTypeInput = {
  title: Scalars['String'];
};

export type LifestyleTypeUpdateInput = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type LifestyleUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  note?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MedicalPrescription = {
  __typename?: 'MedicalPrescription';
  directionToPatient?: Maybe<Scalars['String']>;
  generic?: Maybe<Scalars['Boolean']>;
  history: Scalars['Boolean'];
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  medicalPrescriptionOrderId?: Maybe<Scalars['ID']>;
  medication: Scalars['String'];
  prescribedDate?: Maybe<Scalars['Time']>;
  refill?: Maybe<Scalars['Int']>;
  rxCui?: Maybe<Scalars['String']>;
  sig?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  substitutionAllowed?: Maybe<Scalars['Boolean']>;
  synonym?: Maybe<Scalars['String']>;
  tty?: Maybe<Scalars['String']>;
};

export type MedicalPrescriptionConnection = Connection & {
  __typename?: 'MedicalPrescriptionConnection';
  edges: Array<Maybe<MedicalPrescriptionEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MedicalPrescriptionEdge = {
  __typename?: 'MedicalPrescriptionEdge';
  node: MedicalPrescription;
};

export type MedicalPrescriptionFilter = {
  history?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  medication?: InputMaybe<Scalars['String']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  rxCui?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

export type MedicalPrescriptionInput = {
  directionToPatient?: InputMaybe<Scalars['String']>;
  generic?: InputMaybe<Scalars['Boolean']>;
  history: Scalars['Boolean'];
  language?: InputMaybe<Scalars['String']>;
  medication: Scalars['String'];
  patientId: Scalars['ID'];
  prescribedDate?: InputMaybe<Scalars['Time']>;
  refill?: InputMaybe<Scalars['Int']>;
  rxCui?: InputMaybe<Scalars['String']>;
  sig?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  substitutionAllowed?: InputMaybe<Scalars['Boolean']>;
  synonym?: InputMaybe<Scalars['String']>;
  tty?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type MedicalPrescriptionOrder = {
  __typename?: 'MedicalPrescriptionOrder';
  createdAt?: Maybe<Scalars['Time']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  medicalPrescriptions: Array<Maybe<MedicalPrescription>>;
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  pharmacy: Pharmacy;
  pharmacyId: Scalars['ID'];
  phoneNo: Scalars['String'];
  status: Scalars['String'];
  userName: Scalars['String'];
};

export type MedicalPrescriptionOrderConnection = Connection & {
  __typename?: 'MedicalPrescriptionOrderConnection';
  edges: Array<MedicalPrescriptionOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MedicalPrescriptionOrderEdge = {
  __typename?: 'MedicalPrescriptionOrderEdge';
  node: MedicalPrescriptionOrder;
};

export type MedicalPrescriptionOrderInput = {
  directionToPatient?: InputMaybe<Scalars['String']>;
  generic?: InputMaybe<Scalars['Boolean']>;
  history: Scalars['Boolean'];
  language?: InputMaybe<Scalars['String']>;
  medication: Scalars['String'];
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  pharmacyId: Scalars['ID'];
  prescribedDate?: InputMaybe<Scalars['Time']>;
  refill?: InputMaybe<Scalars['Int']>;
  rxCui?: InputMaybe<Scalars['String']>;
  sig?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  substitutionAllowed?: InputMaybe<Scalars['Boolean']>;
  synonym?: InputMaybe<Scalars['String']>;
  tty?: InputMaybe<Scalars['String']>;
};

export type MedicalPrescriptionUpdateInput = {
  directionToPatient?: InputMaybe<Scalars['String']>;
  eyewearShopId?: InputMaybe<Scalars['ID']>;
  generic?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  language?: InputMaybe<Scalars['String']>;
  medication?: InputMaybe<Scalars['String']>;
  pharmacyId?: InputMaybe<Scalars['ID']>;
  prescribedDate?: InputMaybe<Scalars['Time']>;
  refill?: InputMaybe<Scalars['Int']>;
  rxCui?: InputMaybe<Scalars['String']>;
  sig?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  substitutionAllowed?: InputMaybe<Scalars['Boolean']>;
  synonym?: InputMaybe<Scalars['String']>;
  tty?: InputMaybe<Scalars['String']>;
};

export type MedicationPrescriptionUpdateInput = {
  id: Scalars['ID'];
  pharmacyId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Modality = {
  __typename?: 'Modality';
  active: Scalars['Boolean'];
  description: Scalars['String'];
  iconFileName?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  value: Scalars['String'];
};

export type ModalityConnection = Connection & {
  __typename?: 'ModalityConnection';
  edges: Array<ModalityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ModalityEdge = {
  __typename?: 'ModalityEdge';
  node: Modality;
};

export type ModalityFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
};

export type ModalityUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  approvePaymentWaiver: PaymentWaiver;
  changePassword: User;
  checkInPatient: Appointment;
  checkOutPatient: PatientQueue;
  confirmDiagnosticProcedureOrder: DiagnosticProcedureOrder;
  confirmFollowUpOrder: ConfirmFollowUpOrderResult;
  confirmLabOrder: LabOrder;
  confirmPayment: Payment;
  confirmPayments: Scalars['Boolean'];
  confirmReferralOrder: ConfirmReferralOrderResult;
  confirmSurgicalOrder: ConfirmSurgicalOrderResult;
  confirmTreatmentOrder: ConfirmTreatmentOrderResult;
  createAmendment?: Maybe<Amendment>;
  createChat: Chat;
  createEyewearShop: EyewearShop;
  createPharmacy: Pharmacy;
  createTodo: Todo;
  deleteAllergy: Scalars['Boolean'];
  deleteAmendment: Scalars['Boolean'];
  deleteAppointment: Scalars['Boolean'];
  deleteAppointmentStatus: Scalars['Boolean'];
  deleteBilling: Scalars['Boolean'];
  deleteChat: Scalars['Boolean'];
  deleteChiefComplaint: Scalars['Boolean'];
  deleteChiefComplaintType: Scalars['Boolean'];
  deleteClinicalFinding: Scalars['Boolean'];
  deleteDiagnosis: Scalars['Boolean'];
  deleteDiagnosticDocument: Scalars['Boolean'];
  deleteDiagnosticImage: Scalars['Boolean'];
  deleteDiagnosticLeftEyeImage: Scalars['Boolean'];
  deleteDiagnosticLeftEyeSketch: Scalars['Boolean'];
  deleteDiagnosticProcedure: Scalars['Boolean'];
  deleteDiagnosticProcedureType: Scalars['Boolean'];
  deleteDiagnosticRightEyeImage: Scalars['Boolean'];
  deleteDiagnosticRightEyeSketch: Scalars['Boolean'];
  deleteEyewearPrescription: Scalars['Boolean'];
  deleteEyewearShop: Scalars['Boolean'];
  deleteFamilyIllness: Scalars['Boolean'];
  deleteFavoriteChiefComplaint?: Maybe<Scalars['ID']>;
  deleteFavoriteDiagnosis?: Maybe<Scalars['ID']>;
  deleteFavoriteMedication: Scalars['Boolean'];
  deleteFile: Scalars['Boolean'];
  deleteFollowUp: Scalars['Boolean'];
  deleteFromQueue: PatientQueue;
  deleteHpiComponent: Scalars['Boolean'];
  deleteHpiComponentType: Scalars['Boolean'];
  deleteLab: Scalars['Boolean'];
  deleteLabDocument: Scalars['Boolean'];
  deleteLabImage: Scalars['Boolean'];
  deleteLabLeftEyeImage: Scalars['Boolean'];
  deleteLabLeftEyeSketch: Scalars['Boolean'];
  deleteLabRightEyeImage: Scalars['Boolean'];
  deleteLabRightEyeSketch: Scalars['Boolean'];
  deleteLabType: Scalars['Boolean'];
  deleteLifestyle: Scalars['Boolean'];
  deleteLifestyleType: Scalars['Boolean'];
  deleteMedicalPrescription: Scalars['Boolean'];
  deletePastHospitalization: Scalars['Boolean'];
  deletePastIllness: Scalars['Boolean'];
  deletePastIllnessType: Scalars['Boolean'];
  deletePastInjury: Scalars['Boolean'];
  deletePastSurgery: Scalars['Boolean'];
  deletePatient: Scalars['Boolean'];
  deletePatientChart: Scalars['Boolean'];
  deletePatientChiefComplaint: Scalars['Boolean'];
  deletePatientDiagnosis: Scalars['Boolean'];
  deletePatientEncounterLimit: Scalars['Boolean'];
  deletePayment: Scalars['Boolean'];
  deletePaymentWaiver: Scalars['Boolean'];
  deletePharmacy: Scalars['Boolean'];
  deletePhysicalExamFinding: Scalars['Boolean'];
  deletePhysicalExamFindingExamCategory: PhysicalExamFinding;
  deletePreanestheticDocument: Scalars['Boolean'];
  deleteReferral: Scalars['Boolean'];
  deleteReviewOfSystem: Scalars['Boolean'];
  deleteRoom: Scalars['Boolean'];
  deleteSupply: Scalars['Boolean'];
  deleteSurgicalProcedure: Scalars['Boolean'];
  deleteSurgicalProcedureType: Scalars['Boolean'];
  deleteTreatment: Scalars['Boolean'];
  deleteTreatmentType: Scalars['Boolean'];
  deleteUnreadMessages: Scalars['Boolean'];
  deleteUserType: Scalars['Boolean'];
  deleteVisitType: Scalars['Boolean'];
  lockPatientChart: PatientChart;
  login: Scalars['String'];
  movePatientQueue: PatientQueue;
  muteChat: ChatMute;
  newAppointment: Appointment;
  orderAndConfirmDiagnosticProcedure: DiagnosticProcedureOrder;
  orderAndConfirmLab: LabOrder;
  orderAndConfirmSurgery: SurgicalOrder;
  orderDiagnosticProcedure: DiagnosticProcedureOrder;
  orderFollowUp: FollowUpOrder;
  orderLab: LabOrder;
  orderReferral: ReferralOrder;
  orderSurgicalProcedure: SurgicalOrder;
  orderTreatment: TreatmentOrder;
  pushPatientQueue: PatientQueue;
  requestPaymentWaiver: Payment;
  requestPaymentWaivers: Scalars['Boolean'];
  resetPassword: User;
  saveAllergy: Allergy;
  saveAllergyHistory: ClinicalFinding;
  saveAppointmentStatus: AppointmentStatus;
  saveBilling: Billing;
  saveChiefComplaint: ChiefComplaint;
  saveChiefComplaintType: ChiefComplaintType;
  saveDiagnosis: Diagnosis;
  saveDiagnosticProcedure: DiagnosticProcedure;
  saveDiagnosticProcedureType: DiagnosticProcedureType;
  saveDisorderHistory: ClinicalFinding;
  saveExamCategory: ExamCategory;
  saveExamFinding: ExamFinding;
  saveEyewearPrescription: EyewearPrescriptionOrder;
  saveFamilyIllness: FamilyIllness;
  saveFavoriteChiefComplaint: FavoriteChiefComplaint;
  saveFavoriteDiagnosis: FavoriteDiagnosis;
  saveFavoriteMedication: FavoriteMedication;
  saveFile: File;
  saveFollowUp: FollowUp;
  saveHpiComponent: HpiComponent;
  saveHpiComponentType: HpiComponentType;
  saveImmunizationHistory: ClinicalFinding;
  saveIntoleranceHistory: ClinicalFinding;
  saveLab: Lab;
  saveLabType: LabType;
  saveLifestyle: Lifestyle;
  saveLifestyleTypes: LifestyleType;
  saveMedicationPrescription: MedicalPrescriptionOrder;
  saveMentalHistory: ClinicalFinding;
  saveOphthalmologyExam: OpthalmologyExam;
  saveOrganizationDetails: OrganizationDetails;
  savePastHospitalization: PastHospitalization;
  savePastIllness: ClinicalFinding;
  savePastIllnessTypes: PastIllnessType;
  savePastInjury: PastInjury;
  savePastMedication: MedicalPrescription;
  savePastSurgery: PastSurgery;
  savePatient: Patient;
  savePatientChart: PatientChart;
  savePatientChiefComplaint: ChiefComplaint;
  savePatientDiagnosis: PatientDiagnosis;
  savePatientEncounterLimit: PatientEncounterLimit;
  savePatientQueue: PatientQueue;
  savePatientV2: Patient;
  savePayment: Payment;
  savePaymentWaiver: PaymentWaiver;
  savePhysicalExamFinding: PhysicalExamFinding;
  saveReviewOfSystem: ReviewOfSystem;
  saveRoom: Room;
  saveSupply: Supply;
  saveSurgicalHistory: ClinicalFinding;
  saveSurgicalProcedure: SurgicalProcedure;
  saveSurgicalProcedureType: SurgicalProcedureType;
  saveSystem: System;
  saveSystemSymptom: SystemSymptom;
  saveTreatment: Treatment;
  saveTreatmentType: TreatmentType;
  saveUserType: UserType;
  saveVisitType: VisitType;
  saveVitalSigns: VitalSigns;
  sendMessage: ChatMessage;
  signup: User;
  subscribeQueue: QueueSubscription;
  unmuteChat: Scalars['Boolean'];
  unsubscribeQueue: QueueSubscription;
  updateAllergy: Allergy;
  updateAllergyHistory: ClinicalFinding;
  updateAmendment?: Maybe<Amendment>;
  updateAppointment: Appointment;
  updateAppointmentStatus: AppointmentStatus;
  updateBilling: Billing;
  updateChiefComplaint: ChiefComplaint;
  updateChiefComplaintType: ChiefComplaintType;
  updateDiagnosis: Diagnosis;
  updateDiagnosticProcedure: DiagnosticProcedure;
  updateDiagnosticProcedureOrder: DiagnosticProcedureOrder;
  updateDiagnosticProcedureType: DiagnosticProcedureType;
  updateDisorderHistory: ClinicalFinding;
  updateExamCategory: ExamCategory;
  updateExamFinding: ExamFinding;
  updateEyewearPrescription: EyewearPrescription;
  updateEyewearPrescriptionOrder: EyewearPrescriptionOrder;
  updateEyewearShop: EyewearShop;
  updateFamilyIllness: FamilyIllness;
  updateFavoriteMedication: FavoriteMedication;
  updateFile: File;
  updateFollowUp: FollowUp;
  updateHpiComponent: HpiComponent;
  updateHpiComponentType: HpiComponentType;
  updateImmunizationHistory: ClinicalFinding;
  updateIntoleranceHistory: ClinicalFinding;
  updateLab: Lab;
  updateLabOrder: LabOrder;
  updateLabType: LabType;
  updateLifestyle: Lifestyle;
  updateLifestyleType: LifestyleType;
  updateMedicationPrescription: MedicalPrescription;
  updateMedicationPrescriptionOrder: MedicalPrescriptionOrder;
  updateMentalHistory: ClinicalFinding;
  updateModality: Modality;
  updateOphthalmologyExam: OpthalmologyExam;
  updatePastHospitalization: PastHospitalization;
  updatePastIllness: ClinicalFinding;
  updatePastIllnessType: PastIllnessType;
  updatePastInjury: PastInjury;
  updatePastSurgery: PastSurgery;
  updatePatient: Patient;
  updatePatientChart: PatientChart;
  updatePatientDiagnosis: PatientDiagnosis;
  updatePatientEncounterLimit: PatientEncounterLimit;
  updatePatientHistory: PatientHistory;
  updatePatientQueue: PatientQueue;
  updatePayment: Payment;
  updatePaymentWaiver: PaymentWaiver;
  updatePharmacy: Pharmacy;
  updatePhysicalExamFinding: PhysicalExamFinding;
  updateReviewOfSystem: ReviewOfSystem;
  updateRoom: Room;
  updateSupply: Supply;
  updateSurgeryFitness: SurgicalProcedure;
  updateSurgicalHistory: ClinicalFinding;
  updateSurgicalProcedure: SurgicalProcedure;
  updateSurgicalProcedureType: SurgicalProcedureType;
  updateSystem: System;
  updateSystemSymptom: SystemSymptom;
  updateTreatment: Treatment;
  updateTreatmentType: TreatmentType;
  updateUser: User;
  updateUserType: UserType;
  updateVisitType: VisitType;
  updateVitalSigns: VitalSigns;
};


export type MutationApprovePaymentWaiverArgs = {
  approve: Scalars['Boolean'];
  id: Scalars['ID'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCheckInPatientArgs = {
  appointmentId: Scalars['ID'];
  destination: Destination;
};


export type MutationCheckOutPatientArgs = {
  appointmentId: Scalars['ID'];
  patientQueueId: Scalars['ID'];
};


export type MutationConfirmDiagnosticProcedureOrderArgs = {
  id: Scalars['ID'];
  invoiceNo: Scalars['String'];
};


export type MutationConfirmFollowUpOrderArgs = {
  input: ConfirmFollowUpOrderInput;
};


export type MutationConfirmLabOrderArgs = {
  id: Scalars['ID'];
  invoiceNo: Scalars['String'];
};


export type MutationConfirmPaymentArgs = {
  id: Scalars['ID'];
  invoiceNo: Scalars['String'];
};


export type MutationConfirmPaymentsArgs = {
  ids: Array<Scalars['ID']>;
  invoiceNo: Scalars['String'];
};


export type MutationConfirmReferralOrderArgs = {
  input: ConfirmReferralOrderInput;
};


export type MutationConfirmSurgicalOrderArgs = {
  input: ConfirmSurgicalOrderInput;
};


export type MutationConfirmTreatmentOrderArgs = {
  input: ConfirmTreatmentOrderInput;
};


export type MutationCreateAmendmentArgs = {
  input: AmendmentInput;
};


export type MutationCreateChatArgs = {
  input: ChatInput;
};


export type MutationCreateEyewearShopArgs = {
  input: EyewearShopInput;
};


export type MutationCreatePharmacyArgs = {
  input: PharmacyInput;
};


export type MutationCreateTodoArgs = {
  input: NewTodo;
};


export type MutationDeleteAllergyArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteAmendmentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteAppointmentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteAppointmentStatusArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteBillingArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteChatArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteChiefComplaintArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteChiefComplaintTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteClinicalFindingArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDiagnosisArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDiagnosticDocumentArgs = {
  input: DiagnosticProcedureDeleteFileInput;
};


export type MutationDeleteDiagnosticImageArgs = {
  input: DiagnosticProcedureDeleteFileInput;
};


export type MutationDeleteDiagnosticLeftEyeImageArgs = {
  input: DiagnosticProcedureDeleteFileInput;
};


export type MutationDeleteDiagnosticLeftEyeSketchArgs = {
  input: DiagnosticProcedureDeleteFileInput;
};


export type MutationDeleteDiagnosticProcedureArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDiagnosticProcedureTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDiagnosticRightEyeImageArgs = {
  input: DiagnosticProcedureDeleteFileInput;
};


export type MutationDeleteDiagnosticRightEyeSketchArgs = {
  input: DiagnosticProcedureDeleteFileInput;
};


export type MutationDeleteEyewearPrescriptionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEyewearShopArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFamilyIllnessArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFavoriteChiefComplaintArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFavoriteDiagnosisArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFavoriteMedicationArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFileArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFollowUpArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteFromQueueArgs = {
  appointmentId: Scalars['ID'];
  patientQueueId: Scalars['ID'];
};


export type MutationDeleteHpiComponentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteHpiComponentTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteLabArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteLabDocumentArgs = {
  input: LabDeleteFileInput;
};


export type MutationDeleteLabImageArgs = {
  input: LabDeleteFileInput;
};


export type MutationDeleteLabLeftEyeImageArgs = {
  input: LabDeleteFileInput;
};


export type MutationDeleteLabLeftEyeSketchArgs = {
  input: LabDeleteFileInput;
};


export type MutationDeleteLabRightEyeImageArgs = {
  input: LabDeleteFileInput;
};


export type MutationDeleteLabRightEyeSketchArgs = {
  input: LabDeleteFileInput;
};


export type MutationDeleteLabTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteLifestyleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteLifestyleTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteMedicalPrescriptionArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePastHospitalizationArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePastIllnessArgs = {
  conceptId: Scalars['String'];
};


export type MutationDeletePastIllnessTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePastInjuryArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePastSurgeryArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePatientArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePatientChartArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePatientChiefComplaintArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePatientDiagnosisArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePatientEncounterLimitArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePaymentArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePaymentWaiverArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePharmacyArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePhysicalExamFindingArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePhysicalExamFindingExamCategoryArgs = {
  examCategoryId: Scalars['ID'];
  physicalExamFindingId: Scalars['ID'];
};


export type MutationDeletePreanestheticDocumentArgs = {
  fileId: Scalars['ID'];
  surgicalProcedureId: Scalars['ID'];
};


export type MutationDeleteReferralArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteReviewOfSystemArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRoomArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSupplyArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSurgicalProcedureArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSurgicalProcedureTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTreatmentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTreatmentTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUnreadMessagesArgs = {
  chatId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationDeleteUserTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVisitTypeArgs = {
  id: Scalars['ID'];
};


export type MutationLockPatientChartArgs = {
  id: Scalars['ID'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMovePatientQueueArgs = {
  appointmentId: Scalars['ID'];
  destinationQueueId: Scalars['ID'];
  sourceQueueId: Scalars['ID'];
};


export type MutationMuteChatArgs = {
  id: Scalars['ID'];
};


export type MutationNewAppointmentArgs = {
  input: AppointmentInput;
};


export type MutationOrderAndConfirmDiagnosticProcedureArgs = {
  input: OrderAndConfirmDiagnosticProcedureInput;
};


export type MutationOrderAndConfirmLabArgs = {
  input: OrderAndConfirmLabInput;
};


export type MutationOrderAndConfirmSurgeryArgs = {
  input: OrderAndConfirmSurgicalProcedureInput;
};


export type MutationOrderDiagnosticProcedureArgs = {
  input: OrderDiagnosticProcedureInput;
};


export type MutationOrderFollowUpArgs = {
  input: OrderFollowUpInput;
};


export type MutationOrderLabArgs = {
  input: OrderLabInput;
};


export type MutationOrderReferralArgs = {
  input: OrderReferralInput;
};


export type MutationOrderSurgicalProcedureArgs = {
  input: OrderSurgicalInput;
};


export type MutationOrderTreatmentArgs = {
  input: OrderTreatmentInput;
};


export type MutationPushPatientQueueArgs = {
  appointmentId: Scalars['ID'];
  destination: Destination;
  patientQueueId: Scalars['ID'];
};


export type MutationRequestPaymentWaiverArgs = {
  patientId: Scalars['ID'];
  paymentId: Scalars['ID'];
};


export type MutationRequestPaymentWaiversArgs = {
  ids: Array<Scalars['ID']>;
  patientId: Scalars['ID'];
};


export type MutationResetPasswordArgs = {
  id: Scalars['ID'];
};


export type MutationSaveAllergyArgs = {
  input: AllergyInput;
};


export type MutationSaveAllergyHistoryArgs = {
  input: ClinicalFindingInput;
};


export type MutationSaveAppointmentStatusArgs = {
  input: AppointmentStatusInput;
};


export type MutationSaveBillingArgs = {
  input: BillingInput;
};


export type MutationSaveChiefComplaintArgs = {
  input: ChiefComplaintInput;
};


export type MutationSaveChiefComplaintTypeArgs = {
  input: ChiefComplaintTypeInput;
};


export type MutationSaveDiagnosisArgs = {
  input: DiagnosisInput;
};


export type MutationSaveDiagnosticProcedureArgs = {
  input: DiagnosticProcedureInput;
};


export type MutationSaveDiagnosticProcedureTypeArgs = {
  input: DiagnosticProcedureTypeInput;
};


export type MutationSaveDisorderHistoryArgs = {
  input: ClinicalFindingInput;
};


export type MutationSaveExamCategoryArgs = {
  input: ExamCategoryInput;
};


export type MutationSaveExamFindingArgs = {
  input: ExamFindingInput;
};


export type MutationSaveEyewearPrescriptionArgs = {
  input: EyewearPrescriptionInput;
};


export type MutationSaveFamilyIllnessArgs = {
  input: FamilyIllnessInput;
};


export type MutationSaveFavoriteChiefComplaintArgs = {
  chiefComplaintTypeId: Scalars['ID'];
};


export type MutationSaveFavoriteDiagnosisArgs = {
  diagnosisId: Scalars['ID'];
};


export type MutationSaveFavoriteMedicationArgs = {
  input: FavoriteMedicationInput;
};


export type MutationSaveFileArgs = {
  input: FileInput;
};


export type MutationSaveFollowUpArgs = {
  input: FollowUpInput;
};


export type MutationSaveHpiComponentArgs = {
  input: HpiComponentInput;
};


export type MutationSaveHpiComponentTypeArgs = {
  input: HpiComponentTypeInput;
};


export type MutationSaveImmunizationHistoryArgs = {
  input: ClinicalFindingInput;
};


export type MutationSaveIntoleranceHistoryArgs = {
  input: ClinicalFindingInput;
};


export type MutationSaveLabArgs = {
  input: LabInput;
};


export type MutationSaveLabTypeArgs = {
  input: LabTypeInput;
};


export type MutationSaveLifestyleArgs = {
  input: LifestyleInput;
};


export type MutationSaveLifestyleTypesArgs = {
  input: LifestyleTypeInput;
};


export type MutationSaveMedicationPrescriptionArgs = {
  input: MedicalPrescriptionOrderInput;
};


export type MutationSaveMentalHistoryArgs = {
  input: ClinicalFindingInput;
};


export type MutationSaveOphthalmologyExamArgs = {
  input: OpthalmologyExamInput;
};


export type MutationSaveOrganizationDetailsArgs = {
  input: OrganizationDetailsInput;
};


export type MutationSavePastHospitalizationArgs = {
  input: PastHospitalizationInput;
};


export type MutationSavePastIllnessArgs = {
  input: PastIllnessInput;
};


export type MutationSavePastIllnessTypesArgs = {
  input: PastIllnessTypeInput;
};


export type MutationSavePastInjuryArgs = {
  input: PastInjuryInput;
};


export type MutationSavePastMedicationArgs = {
  input: MedicalPrescriptionInput;
};


export type MutationSavePastSurgeryArgs = {
  input: PastSurgeryInput;
};


export type MutationSavePatientArgs = {
  input: PatientInput;
};


export type MutationSavePatientChartArgs = {
  input: PatientChartInput;
};


export type MutationSavePatientChiefComplaintArgs = {
  input: ChiefComplaintInput;
};


export type MutationSavePatientDiagnosisArgs = {
  input: PatientDiagnosisInput;
};


export type MutationSavePatientEncounterLimitArgs = {
  input: PatientEncounterLimitInput;
};


export type MutationSavePatientQueueArgs = {
  input: PatientQueueInput;
};


export type MutationSavePatientV2Args = {
  dateOfBirthInput: DateOfBirthInput;
  input: PatientInputV2;
};


export type MutationSavePaymentArgs = {
  input: PaymentInput;
};


export type MutationSavePaymentWaiverArgs = {
  input: PaymentWaiverInput;
};


export type MutationSavePhysicalExamFindingArgs = {
  input: PhysicalExamFindingInput;
};


export type MutationSaveReviewOfSystemArgs = {
  input: ReviewOfSystemInput;
};


export type MutationSaveRoomArgs = {
  input: RoomInput;
};


export type MutationSaveSupplyArgs = {
  input: SupplyInput;
};


export type MutationSaveSurgicalHistoryArgs = {
  input: ClinicalFindingInput;
};


export type MutationSaveSurgicalProcedureArgs = {
  input: SurgicalProcedureInput;
};


export type MutationSaveSurgicalProcedureTypeArgs = {
  input: SurgicalProcedureTypeInput;
};


export type MutationSaveSystemArgs = {
  input: SystemInput;
};


export type MutationSaveSystemSymptomArgs = {
  input: SystemSymptomInput;
};


export type MutationSaveTreatmentArgs = {
  input: TreatmentInput;
};


export type MutationSaveTreatmentTypeArgs = {
  input: TreatmentTypeInput;
};


export type MutationSaveUserTypeArgs = {
  input: UserTypeInput;
};


export type MutationSaveVisitTypeArgs = {
  input: VisitTypeInput;
};


export type MutationSaveVitalSignsArgs = {
  input: VitalSignsInput;
};


export type MutationSendMessageArgs = {
  input: ChatMessageInput;
};


export type MutationSignupArgs = {
  input: UserInput;
};


export type MutationSubscribeQueueArgs = {
  patientQueueId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationUnmuteChatArgs = {
  id: Scalars['ID'];
};


export type MutationUnsubscribeQueueArgs = {
  patientQueueId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationUpdateAllergyArgs = {
  input: AllergyUpdateInput;
};


export type MutationUpdateAllergyHistoryArgs = {
  input: ClinicalFindingUpdateInput;
};


export type MutationUpdateAmendmentArgs = {
  input: AmendmentUpdateInput;
};


export type MutationUpdateAppointmentArgs = {
  input: AppointmentUpdateInput;
};


export type MutationUpdateAppointmentStatusArgs = {
  id: Scalars['ID'];
  input: AppointmentStatusInput;
};


export type MutationUpdateBillingArgs = {
  id: Scalars['ID'];
  input: BillingInput;
};


export type MutationUpdateChiefComplaintArgs = {
  input: ChiefComplaintUpdateInput;
};


export type MutationUpdateChiefComplaintTypeArgs = {
  input: ChiefComplaintTypeUpdateInput;
};


export type MutationUpdateDiagnosisArgs = {
  input: DiagnosisUpdateInput;
};


export type MutationUpdateDiagnosticProcedureArgs = {
  input: DiagnosticProcedureUpdateInput;
};


export type MutationUpdateDiagnosticProcedureOrderArgs = {
  input: DiagnosticProcedureOrderUpdateInput;
};


export type MutationUpdateDiagnosticProcedureTypeArgs = {
  input: DiagnosticProcedureTypeUpdateInput;
};


export type MutationUpdateDisorderHistoryArgs = {
  input: ClinicalFindingUpdateInput;
};


export type MutationUpdateExamCategoryArgs = {
  input: ExamCategoryUpdateInput;
};


export type MutationUpdateExamFindingArgs = {
  input: ExamFindingUpdateInput;
};


export type MutationUpdateEyewearPrescriptionArgs = {
  input: EyewearPrescriptionUpdateInput;
};


export type MutationUpdateEyewearPrescriptionOrderArgs = {
  input: EyewearPrescriptionOrderUpdateInput;
};


export type MutationUpdateEyewearShopArgs = {
  input: EyewearShopUpdateInput;
};


export type MutationUpdateFamilyIllnessArgs = {
  input: FamilyIllnessUpdateInput;
};


export type MutationUpdateFavoriteMedicationArgs = {
  input: FavoriteMedicationUpdateInput;
};


export type MutationUpdateFileArgs = {
  input: FileUpdateInput;
};


export type MutationUpdateFollowUpArgs = {
  input: FollowUpUpdateInput;
};


export type MutationUpdateHpiComponentArgs = {
  input: HpiComponentUpdateInput;
};


export type MutationUpdateHpiComponentTypeArgs = {
  input: HpiComponentTypeUpdateInput;
};


export type MutationUpdateImmunizationHistoryArgs = {
  input: ClinicalFindingUpdateInput;
};


export type MutationUpdateIntoleranceHistoryArgs = {
  input: ClinicalFindingUpdateInput;
};


export type MutationUpdateLabArgs = {
  input: LabUpdateInput;
};


export type MutationUpdateLabOrderArgs = {
  input: LabOrderUpdateInput;
};


export type MutationUpdateLabTypeArgs = {
  input: LabTypeUpdateInput;
};


export type MutationUpdateLifestyleArgs = {
  input: LifestyleUpdateInput;
};


export type MutationUpdateLifestyleTypeArgs = {
  input: LifestyleTypeUpdateInput;
};


export type MutationUpdateMedicationPrescriptionArgs = {
  input: MedicalPrescriptionUpdateInput;
};


export type MutationUpdateMedicationPrescriptionOrderArgs = {
  input: MedicationPrescriptionUpdateInput;
};


export type MutationUpdateMentalHistoryArgs = {
  input: ClinicalFindingUpdateInput;
};


export type MutationUpdateModalityArgs = {
  input: ModalityUpdateInput;
};


export type MutationUpdateOphthalmologyExamArgs = {
  input: OpthalmologyExamUpdateInput;
};


export type MutationUpdatePastHospitalizationArgs = {
  input: PastHospitalizationUpdateInput;
};


export type MutationUpdatePastIllnessArgs = {
  input: PastIllnessUpdateInput;
};


export type MutationUpdatePastIllnessTypeArgs = {
  input: PastIllnessTypeUpdateInput;
};


export type MutationUpdatePastInjuryArgs = {
  input: PastInjuryUpdateInput;
};


export type MutationUpdatePastSurgeryArgs = {
  input: PastSurgeryUpdateInput;
};


export type MutationUpdatePatientArgs = {
  input: PatientUpdateInput;
};


export type MutationUpdatePatientChartArgs = {
  input: PatientChartUpdateInput;
};


export type MutationUpdatePatientDiagnosisArgs = {
  input: PatientDiagnosisUpdateInput;
};


export type MutationUpdatePatientEncounterLimitArgs = {
  input: PatientEncounterLimitUpdateInput;
};


export type MutationUpdatePatientHistoryArgs = {
  input: PatientHistoryUpdateInput;
};


export type MutationUpdatePatientQueueArgs = {
  appointmentId: Scalars['ID'];
  destination?: InputMaybe<Destination>;
};


export type MutationUpdatePaymentArgs = {
  input: PaymentInput;
};


export type MutationUpdatePaymentWaiverArgs = {
  input: PaymentWaiverUpdateInput;
};


export type MutationUpdatePharmacyArgs = {
  input: PharmacyUpdateInput;
};


export type MutationUpdatePhysicalExamFindingArgs = {
  input: PhysicalExamFindingUpdateInput;
};


export type MutationUpdateReviewOfSystemArgs = {
  input: ReviewOfSystemUpdateInput;
};


export type MutationUpdateRoomArgs = {
  id: Scalars['ID'];
  input: RoomInput;
};


export type MutationUpdateSupplyArgs = {
  input: SupplyUpdateInput;
};


export type MutationUpdateSurgeryFitnessArgs = {
  fit: Scalars['Boolean'];
  id: Scalars['ID'];
};


export type MutationUpdateSurgicalHistoryArgs = {
  input: ClinicalFindingUpdateInput;
};


export type MutationUpdateSurgicalProcedureArgs = {
  input: SurgicalProcedureUpdateInput;
};


export type MutationUpdateSurgicalProcedureTypeArgs = {
  input: SurgicalProcedureTypeUpdateInput;
};


export type MutationUpdateSystemArgs = {
  input: SystemUpdateInput;
};


export type MutationUpdateSystemSymptomArgs = {
  input: SystemSymptomUpdateInput;
};


export type MutationUpdateTreatmentArgs = {
  input: TreatmentUpdateInput;
};


export type MutationUpdateTreatmentTypeArgs = {
  input: TreatmentTypeUpdateInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};


export type MutationUpdateUserTypeArgs = {
  input: UserTypeUpdateInput;
};


export type MutationUpdateVisitTypeArgs = {
  id: Scalars['ID'];
  input: VisitTypeInput;
};


export type MutationUpdateVitalSignsArgs = {
  input: VitalSignsUpdateInput;
};

export type NewTodo = {
  text: Scalars['String'];
  userId: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Notif = {
  __typename?: 'Notif';
  diagnosticProcedureOrders: Scalars['Int'];
  followUpOrders: Scalars['Int'];
  labOrders: Scalars['Int'];
  paymentWaivers: Scalars['Int'];
  referralOrders: Scalars['Int'];
  surgicalOrders: Scalars['Int'];
  treatmentOrders: Scalars['Int'];
};

export enum NotifType {
  Chat = 'CHAT'
}

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID'];
  message: Scalars['String'];
  type: NotifType;
};

export type OphthalmologyExamFilter = {
  id?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type OpthalmologyExam = {
  __typename?: 'OpthalmologyExam';
  coverTestNote?: Maybe<Scalars['String']>;
  distance?: Maybe<Scalars['String']>;
  externalExamNote?: Maybe<Scalars['String']>;
  funduscopyNote?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  leftAnteriorChamber?: Maybe<Scalars['String']>;
  leftCdr?: Maybe<Scalars['String']>;
  leftConjunctiva?: Maybe<Scalars['String']>;
  leftCornea?: Maybe<Scalars['String']>;
  leftCorneaSketch?: Maybe<Scalars['String']>;
  leftCoverTest?: Maybe<Scalars['String']>;
  leftFlick?: Maybe<Scalars['Boolean']>;
  leftIris?: Maybe<Scalars['String']>;
  leftLacrimalSystem?: Maybe<Scalars['String']>;
  leftLens?: Maybe<Scalars['String']>;
  leftLensSketch?: Maybe<Scalars['String']>;
  leftLids?: Maybe<Scalars['String']>;
  leftOcularMotility?: Maybe<Scalars['String']>;
  leftOpticDisc?: Maybe<Scalars['String']>;
  leftOpticDiscSketch?: Maybe<Scalars['String']>;
  leftOrbits?: Maybe<Scalars['String']>;
  leftPupils?: Maybe<Scalars['String']>;
  leftRetina?: Maybe<Scalars['String']>;
  leftRetinaSketch?: Maybe<Scalars['String']>;
  leftSclera?: Maybe<Scalars['String']>;
  leftVitreos?: Maybe<Scalars['String']>;
  lio?: Maybe<Scalars['String']>;
  lir?: Maybe<Scalars['String']>;
  llr?: Maybe<Scalars['String']>;
  lmr?: Maybe<Scalars['String']>;
  lso?: Maybe<Scalars['String']>;
  lsr?: Maybe<Scalars['String']>;
  near?: Maybe<Scalars['String']>;
  ocularMotilityNote?: Maybe<Scalars['String']>;
  opticDiscNote?: Maybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
  pupilsNote?: Maybe<Scalars['String']>;
  rightAnteriorChamber?: Maybe<Scalars['String']>;
  rightCdr?: Maybe<Scalars['String']>;
  rightConjunctiva?: Maybe<Scalars['String']>;
  rightCornea?: Maybe<Scalars['String']>;
  rightCorneaSketch?: Maybe<Scalars['String']>;
  rightCoverTest?: Maybe<Scalars['String']>;
  rightFlick?: Maybe<Scalars['Boolean']>;
  rightIris?: Maybe<Scalars['String']>;
  rightLacrimalSystem?: Maybe<Scalars['String']>;
  rightLens?: Maybe<Scalars['String']>;
  rightLensSketch?: Maybe<Scalars['String']>;
  rightLids?: Maybe<Scalars['String']>;
  rightOcularMotility?: Maybe<Scalars['String']>;
  rightOpticDisc?: Maybe<Scalars['String']>;
  rightOpticDiscSketch?: Maybe<Scalars['String']>;
  rightOrbits?: Maybe<Scalars['String']>;
  rightPupils?: Maybe<Scalars['String']>;
  rightRetina?: Maybe<Scalars['String']>;
  rightRetinaSketch?: Maybe<Scalars['String']>;
  rightSclera?: Maybe<Scalars['String']>;
  rightVitreos?: Maybe<Scalars['String']>;
  rio?: Maybe<Scalars['String']>;
  rir?: Maybe<Scalars['String']>;
  rlr?: Maybe<Scalars['String']>;
  rmr?: Maybe<Scalars['String']>;
  rso?: Maybe<Scalars['String']>;
  rsr?: Maybe<Scalars['String']>;
  slitLampExamNote?: Maybe<Scalars['String']>;
};

export type OpthalmologyExamInput = {
  coverTestNote?: InputMaybe<Scalars['String']>;
  distance?: InputMaybe<Scalars['String']>;
  externalExamNote?: InputMaybe<Scalars['String']>;
  funduscopyNote?: InputMaybe<Scalars['String']>;
  leftAnteriorChamber?: InputMaybe<Scalars['String']>;
  leftCdr?: InputMaybe<Scalars['String']>;
  leftConjunctiva?: InputMaybe<Scalars['String']>;
  leftCornea?: InputMaybe<Scalars['String']>;
  leftCorneaSketch?: InputMaybe<Scalars['String']>;
  leftCoverTest?: InputMaybe<Scalars['String']>;
  leftFlick?: InputMaybe<Scalars['Boolean']>;
  leftIris?: InputMaybe<Scalars['String']>;
  leftLacrimalSystem?: InputMaybe<Scalars['String']>;
  leftLens?: InputMaybe<Scalars['String']>;
  leftLensSketch?: InputMaybe<Scalars['String']>;
  leftLids?: InputMaybe<Scalars['String']>;
  leftOcularMotility?: InputMaybe<Scalars['String']>;
  leftOpticDisc?: InputMaybe<Scalars['String']>;
  leftOpticDiscSketch?: InputMaybe<Scalars['String']>;
  leftOrbits?: InputMaybe<Scalars['String']>;
  leftPupils?: InputMaybe<Scalars['String']>;
  leftRetina?: InputMaybe<Scalars['String']>;
  leftRetinaSketch?: InputMaybe<Scalars['String']>;
  leftSclera?: InputMaybe<Scalars['String']>;
  leftVitreos?: InputMaybe<Scalars['String']>;
  lio?: InputMaybe<Scalars['String']>;
  lir?: InputMaybe<Scalars['String']>;
  llr?: InputMaybe<Scalars['String']>;
  lmr?: InputMaybe<Scalars['String']>;
  lso?: InputMaybe<Scalars['String']>;
  lsr?: InputMaybe<Scalars['String']>;
  near?: InputMaybe<Scalars['String']>;
  ocularMotilityNote?: InputMaybe<Scalars['String']>;
  opticDiscNote?: InputMaybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
  pupilsNote?: InputMaybe<Scalars['String']>;
  rightAnteriorChamber?: InputMaybe<Scalars['String']>;
  rightCdr?: InputMaybe<Scalars['String']>;
  rightConjunctiva?: InputMaybe<Scalars['String']>;
  rightCornea?: InputMaybe<Scalars['String']>;
  rightCorneaSketch?: InputMaybe<Scalars['String']>;
  rightCoverTest?: InputMaybe<Scalars['String']>;
  rightFlick?: InputMaybe<Scalars['Boolean']>;
  rightIris?: InputMaybe<Scalars['String']>;
  rightLacrimalSystem?: InputMaybe<Scalars['String']>;
  rightLens?: InputMaybe<Scalars['String']>;
  rightLensSketch?: InputMaybe<Scalars['String']>;
  rightLids?: InputMaybe<Scalars['String']>;
  rightOcularMotility?: InputMaybe<Scalars['String']>;
  rightOpticDisc?: InputMaybe<Scalars['String']>;
  rightOpticDiscSketch?: InputMaybe<Scalars['String']>;
  rightOrbits?: InputMaybe<Scalars['String']>;
  rightPupils?: InputMaybe<Scalars['String']>;
  rightRetina?: InputMaybe<Scalars['String']>;
  rightRetinaSketch?: InputMaybe<Scalars['String']>;
  rightSclera?: InputMaybe<Scalars['String']>;
  rightVitreos?: InputMaybe<Scalars['String']>;
  rio?: InputMaybe<Scalars['String']>;
  rir?: InputMaybe<Scalars['String']>;
  rlr?: InputMaybe<Scalars['String']>;
  rmr?: InputMaybe<Scalars['String']>;
  rso?: InputMaybe<Scalars['String']>;
  rsr?: InputMaybe<Scalars['String']>;
  slitLampExamNote?: InputMaybe<Scalars['String']>;
};

export type OpthalmologyExamUpdateInput = {
  coverTestNote?: InputMaybe<Scalars['String']>;
  distance?: InputMaybe<Scalars['String']>;
  externalExamNote?: InputMaybe<Scalars['String']>;
  funduscopyNote?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  leftAnteriorChamber?: InputMaybe<Scalars['String']>;
  leftCdr?: InputMaybe<Scalars['String']>;
  leftConjunctiva?: InputMaybe<Scalars['String']>;
  leftCornea?: InputMaybe<Scalars['String']>;
  leftCorneaSketch?: InputMaybe<Scalars['String']>;
  leftCoverTest?: InputMaybe<Scalars['String']>;
  leftFlick?: InputMaybe<Scalars['Boolean']>;
  leftIris?: InputMaybe<Scalars['String']>;
  leftLacrimalSystem?: InputMaybe<Scalars['String']>;
  leftLens?: InputMaybe<Scalars['String']>;
  leftLensSketch?: InputMaybe<Scalars['String']>;
  leftLids?: InputMaybe<Scalars['String']>;
  leftOcularMotility?: InputMaybe<Scalars['String']>;
  leftOpticDisc?: InputMaybe<Scalars['String']>;
  leftOpticDiscSketch?: InputMaybe<Scalars['String']>;
  leftOrbits?: InputMaybe<Scalars['String']>;
  leftPupils?: InputMaybe<Scalars['String']>;
  leftRetina?: InputMaybe<Scalars['String']>;
  leftRetinaSketch?: InputMaybe<Scalars['String']>;
  leftSclera?: InputMaybe<Scalars['String']>;
  leftVitreos?: InputMaybe<Scalars['String']>;
  lio?: InputMaybe<Scalars['String']>;
  lir?: InputMaybe<Scalars['String']>;
  llr?: InputMaybe<Scalars['String']>;
  lmr?: InputMaybe<Scalars['String']>;
  lso?: InputMaybe<Scalars['String']>;
  lsr?: InputMaybe<Scalars['String']>;
  near?: InputMaybe<Scalars['String']>;
  ocularMotilityNote?: InputMaybe<Scalars['String']>;
  opticDiscNote?: InputMaybe<Scalars['String']>;
  pupilsNote?: InputMaybe<Scalars['String']>;
  rightAnteriorChamber?: InputMaybe<Scalars['String']>;
  rightCdr?: InputMaybe<Scalars['String']>;
  rightConjunctiva?: InputMaybe<Scalars['String']>;
  rightCornea?: InputMaybe<Scalars['String']>;
  rightCorneaSketch?: InputMaybe<Scalars['String']>;
  rightCoverTest?: InputMaybe<Scalars['String']>;
  rightFlick?: InputMaybe<Scalars['Boolean']>;
  rightIris?: InputMaybe<Scalars['String']>;
  rightLacrimalSystem?: InputMaybe<Scalars['String']>;
  rightLens?: InputMaybe<Scalars['String']>;
  rightLensSketch?: InputMaybe<Scalars['String']>;
  rightLids?: InputMaybe<Scalars['String']>;
  rightOcularMotility?: InputMaybe<Scalars['String']>;
  rightOpticDisc?: InputMaybe<Scalars['String']>;
  rightOpticDiscSketch?: InputMaybe<Scalars['String']>;
  rightOrbits?: InputMaybe<Scalars['String']>;
  rightPupils?: InputMaybe<Scalars['String']>;
  rightRetina?: InputMaybe<Scalars['String']>;
  rightRetinaSketch?: InputMaybe<Scalars['String']>;
  rightSclera?: InputMaybe<Scalars['String']>;
  rightVitreos?: InputMaybe<Scalars['String']>;
  rio?: InputMaybe<Scalars['String']>;
  rir?: InputMaybe<Scalars['String']>;
  rlr?: InputMaybe<Scalars['String']>;
  rmr?: InputMaybe<Scalars['String']>;
  rso?: InputMaybe<Scalars['String']>;
  rsr?: InputMaybe<Scalars['String']>;
  slitLampExamNote?: InputMaybe<Scalars['String']>;
};

export type OrderAndConfirmDiagnosticProcedureInput = {
  appointmentId: Scalars['ID'];
  billingId: Scalars['ID'];
  diagnosticProcedureTypeId: Scalars['ID'];
  invoiceNo: Scalars['String'];
  orderNote: Scalars['String'];
  patientId: Scalars['ID'];
};

export type OrderAndConfirmLabInput = {
  appointmentId: Scalars['ID'];
  billingIds: Array<Scalars['ID']>;
  invoiceNo: Scalars['String'];
  labTypeId: Scalars['ID'];
  orderNote: Scalars['String'];
  patientId: Scalars['ID'];
};

export type OrderAndConfirmSurgicalProcedureInput = {
  billingId: Scalars['ID'];
  checkInTime: Scalars['Time'];
  invoiceNo: Scalars['String'];
  orderNote: Scalars['String'];
  patientId: Scalars['ID'];
  performOnEye: Scalars['String'];
  providerId: Scalars['ID'];
  roomId: Scalars['ID'];
  surgicalProcedureTypeId: Scalars['ID'];
  visitTypeId: Scalars['ID'];
};

export type OrderDiagnosticProcedureInput = {
  appointmentId: Scalars['ID'];
  billingId: Scalars['ID'];
  diagnosticProcedureTypeId: Scalars['ID'];
  modality?: InputMaybe<Scalars['String']>;
  orderNote: Scalars['String'];
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  receptionNote: Scalars['String'];
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type OrderFilterInput = {
  appointmentId?: InputMaybe<Scalars['ID']>;
  date?: InputMaybe<Scalars['Time']>;
  orderType?: InputMaybe<Scalars['String']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type OrderFollowUpInput = {
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  receptionNote: Scalars['String'];
};

export type OrderLabInput = {
  billingIds: Array<Scalars['ID']>;
  labTypeId: Scalars['ID'];
  orderNote: Scalars['String'];
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  receptionNote: Scalars['String'];
};

export type OrderReferralInput = {
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  providerName?: InputMaybe<Scalars['String']>;
  reason: Scalars['String'];
  receptionNote?: InputMaybe<Scalars['String']>;
  referredToId?: InputMaybe<Scalars['ID']>;
  type: ReferralType;
};

export type OrderSurgicalInput = {
  appointmentId: Scalars['ID'];
  billingId: Scalars['ID'];
  orderNote: Scalars['String'];
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  performOnEye: Scalars['String'];
  receptionNote: Scalars['String'];
  surgicalProcedureTypeId: Scalars['ID'];
};

export type OrderTreatmentInput = {
  appointmentId: Scalars['ID'];
  billingId: Scalars['ID'];
  orderNote: Scalars['String'];
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  treatmentNote: Scalars['String'];
  treatmentTypeId: Scalars['ID'];
};

export type OrdersCount = {
  __typename?: 'OrdersCount';
  diagnosticProcedureOrders: Scalars['Int'];
  followUpOrders: Scalars['Int'];
  labOrders: Scalars['Int'];
  referralOrders: Scalars['Int'];
  surgicalOrders: Scalars['Int'];
  treatmentOrders: Scalars['Int'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type OrganizationDetails = {
  __typename?: 'OrganizationDetails';
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  defaultMedicalDepartment?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lanIpAddress?: Maybe<Scalars['String']>;
  logo?: Maybe<File>;
  logoId?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  phoneNo?: Maybe<Scalars['String']>;
  phoneNo2?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type OrganizationDetailsInput = {
  address?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  defaultMedicalDepartment?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  lanIpAddress?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<FileUpload>;
  name?: InputMaybe<Scalars['String']>;
  phoneNo?: InputMaybe<Scalars['String']>;
  phoneNo2?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  totalPages: Scalars['Int'];
};

export type PaginationInput = {
  page: Scalars['Int'];
  size: Scalars['Int'];
};

export type PastHospitalization = {
  __typename?: 'PastHospitalization';
  from?: Maybe<Scalars['Time']>;
  id: Scalars['ID'];
  patientHistoryId: Scalars['ID'];
  provider: Scalars['String'];
  reason: Scalars['String'];
  to?: Maybe<Scalars['Time']>;
};

export type PastHospitalizationInput = {
  from?: InputMaybe<Scalars['Time']>;
  patientHistoryId: Scalars['ID'];
  provider: Scalars['String'];
  reason: Scalars['String'];
  to?: InputMaybe<Scalars['Time']>;
};

export type PastHospitalizationUpdateInput = {
  from?: InputMaybe<Scalars['Time']>;
  id: Scalars['ID'];
  provider?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['Time']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type PastIllness = {
  __typename?: 'PastIllness';
  description: Scalars['String'];
  id: Scalars['ID'];
  patientHistoryId: Scalars['ID'];
  title: Scalars['String'];
};

export type PastIllnessInput = {
  attributes?: InputMaybe<Array<Scalars['String']>>;
  conceptId: Scalars['String'];
  memo?: InputMaybe<Scalars['String']>;
  patientChartId: Scalars['Int'];
  term: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type PastIllnessType = {
  __typename?: 'PastIllnessType';
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type PastIllnessTypeConnection = Connection & {
  __typename?: 'PastIllnessTypeConnection';
  edges: Array<Maybe<PastIllnessTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PastIllnessTypeEdge = {
  __typename?: 'PastIllnessTypeEdge';
  node: PastIllnessType;
};

export type PastIllnessTypeInput = {
  title: Scalars['String'];
};

export type PastIllnessTypeUpdateInput = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type PastIllnessUpdateInput = {
  attributes?: InputMaybe<Array<Scalars['String']>>;
  conceptId: Scalars['String'];
  memo?: InputMaybe<Scalars['String']>;
};

export type PastInjury = {
  __typename?: 'PastInjury';
  description: Scalars['String'];
  id: Scalars['ID'];
  injuryDate?: Maybe<Scalars['Time']>;
  patientHistoryId: Scalars['ID'];
};

export type PastInjuryInput = {
  description: Scalars['String'];
  injuryDate?: InputMaybe<Scalars['Time']>;
  patientHistoryId: Scalars['ID'];
};

export type PastInjuryUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  injuryDate?: InputMaybe<Scalars['Time']>;
};

export type PastSurgery = {
  __typename?: 'PastSurgery';
  description: Scalars['String'];
  id: Scalars['ID'];
  patientHistoryId: Scalars['ID'];
  surgeryDate?: Maybe<Scalars['Time']>;
};

export type PastSurgeryInput = {
  description: Scalars['String'];
  patientHistoryId: Scalars['ID'];
  surgeryDate?: InputMaybe<Scalars['Time']>;
};

export type PastSurgeryUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  surgeryDate?: InputMaybe<Scalars['Time']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Patient = {
  __typename?: 'Patient';
  cardNo?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  credit?: Maybe<Scalars['Boolean']>;
  creditCompany?: Maybe<Scalars['String']>;
  dateOfBirth: Scalars['Time'];
  documents?: Maybe<Array<Maybe<File>>>;
  email: Scalars['String'];
  emergencyContactMemo: Scalars['String'];
  emergencyContactName: Scalars['String'];
  emergencyContactPhone: Scalars['String'];
  emergencyContactPhone2: Scalars['String'];
  emergencyContactRel: Scalars['String'];
  firstName: Scalars['String'];
  gender: Scalars['String'];
  homePhone: Scalars['String'];
  houseNo: Scalars['String'];
  id: Scalars['ID'];
  idNo: Scalars['String'];
  idType: Scalars['String'];
  kebele: Scalars['String'];
  lastName: Scalars['String'];
  martialStatus: Scalars['String'];
  memo: Scalars['String'];
  occupation: Scalars['String'];
  paperRecord: Scalars['Boolean'];
  paperRecordDocument?: Maybe<File>;
  paperRecordDocumentId?: Maybe<Scalars['ID']>;
  patientHistory: PatientHistory;
  phoneNo: Scalars['String'];
  phoneNo2: Scalars['String'];
  region: Scalars['String'];
  subCity: Scalars['String'];
  woreda: Scalars['String'];
  zone: Scalars['String'];
};

export type PatientChart = {
  __typename?: 'PatientChart';
  amendments: Array<Amendment>;
  appointmentId: Scalars['ID'];
  bloodPressure?: Maybe<Scalars['String']>;
  chiefComplaints: Array<Maybe<ChiefComplaint>>;
  chiefComplaintsNote?: Maybe<Scalars['String']>;
  diagnoses: Array<Maybe<PatientDiagnosis>>;
  diagnosisNote?: Maybe<Scalars['String']>;
  diagnosticProcedureOrder?: Maybe<DiagnosticProcedureOrder>;
  differentialDiagnosisNote?: Maybe<Scalars['String']>;
  eyewearPrescriptionOrder?: Maybe<EyewearPrescriptionOrder>;
  followUpOrder?: Maybe<FollowUpOrder>;
  hpiNote?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  illnessType?: Maybe<Scalars['String']>;
  labOrder?: Maybe<LabOrder>;
  leftSummarySketch?: Maybe<Scalars['String']>;
  locked?: Maybe<Scalars['Boolean']>;
  lockedBy?: Maybe<User>;
  lockedById?: Maybe<Scalars['ID']>;
  lockedDate?: Maybe<Scalars['Time']>;
  medicalPrescriptionOrder?: Maybe<MedicalPrescriptionOrder>;
  medicalRecommendation?: Maybe<Scalars['String']>;
  opthalmologyExam: OpthalmologyExam;
  physicalExamFindings: Array<PhysicalExamFinding>;
  referralOrder?: Maybe<ReferralOrder>;
  rightSummarySketch?: Maybe<Scalars['String']>;
  sickLeave?: Maybe<Scalars['String']>;
  stickieNote?: Maybe<Scalars['String']>;
  summaryNote?: Maybe<Scalars['String']>;
  surgicalOrder?: Maybe<SurgicalOrder>;
  surgicalProcedure: SurgicalProcedure;
  treatment: Treatment;
  treatmentOrder?: Maybe<TreatmentOrder>;
  vitalSigns: VitalSigns;
};

export type PatientChartConnection = Connection & {
  __typename?: 'PatientChartConnection';
  edges: Array<Maybe<PatientChartEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PatientChartEdge = {
  __typename?: 'PatientChartEdge';
  node: PatientChart;
};

export type PatientChartInput = {
  appointmentId: Scalars['ID'];
  bloodPressure?: InputMaybe<Scalars['String']>;
  bloodPressureDiastolic?: InputMaybe<Scalars['Float']>;
  bloodPressureSystolic?: InputMaybe<Scalars['Float']>;
  bmi?: InputMaybe<Scalars['Float']>;
  diagnosisNote?: InputMaybe<Scalars['String']>;
  differentialDiagnosisNote?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  hpiNote?: InputMaybe<Scalars['String']>;
  illnessType?: InputMaybe<Scalars['String']>;
  leftSummarySketch?: InputMaybe<Scalars['String']>;
  medicalRecommendation?: InputMaybe<Scalars['String']>;
  oxygenSaturation?: InputMaybe<Scalars['Float']>;
  pulse?: InputMaybe<Scalars['Float']>;
  respiratoryRate?: InputMaybe<Scalars['Float']>;
  rightSummarySketch?: InputMaybe<Scalars['String']>;
  sickLeave?: InputMaybe<Scalars['String']>;
  stickieNote?: InputMaybe<Scalars['String']>;
  summaryNote?: InputMaybe<Scalars['String']>;
  temperature?: InputMaybe<Scalars['Float']>;
  weight?: InputMaybe<Scalars['Float']>;
};

export type PatientChartUpdateInput = {
  bloodPressure?: InputMaybe<Scalars['String']>;
  bloodPressureDiastolic?: InputMaybe<Scalars['Float']>;
  bloodPressureSystolic?: InputMaybe<Scalars['Float']>;
  bmi?: InputMaybe<Scalars['Float']>;
  chiefComplaintsNote?: InputMaybe<Scalars['String']>;
  diagnosisNote?: InputMaybe<Scalars['String']>;
  differentialDiagnosisNote?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Float']>;
  hpiNote?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  illnessType?: InputMaybe<Scalars['String']>;
  leftSummarySketch?: InputMaybe<Scalars['String']>;
  medicalRecommendation?: InputMaybe<Scalars['String']>;
  oxygenSaturation?: InputMaybe<Scalars['Float']>;
  pulse?: InputMaybe<Scalars['Float']>;
  respiratoryRate?: InputMaybe<Scalars['Float']>;
  rightSummarySketch?: InputMaybe<Scalars['String']>;
  sickLeave?: InputMaybe<Scalars['String']>;
  stickieNote?: InputMaybe<Scalars['String']>;
  summaryNote?: InputMaybe<Scalars['String']>;
  temperature?: InputMaybe<Scalars['Float']>;
  weight?: InputMaybe<Scalars['Float']>;
};

export type PatientConnection = Connection & {
  __typename?: 'PatientConnection';
  edges: Array<Maybe<PatientEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type PatientDiagnosis = {
  __typename?: 'PatientDiagnosis';
  abbreviatedDescription?: Maybe<Scalars['String']>;
  categoryCode?: Maybe<Scalars['String']>;
  diagnosisCode?: Maybe<Scalars['String']>;
  differential: Scalars['Boolean'];
  fullCode?: Maybe<Scalars['String']>;
  fullDescription: Scalars['String'];
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
};

export type PatientDiagnosisConnection = Connection & {
  __typename?: 'PatientDiagnosisConnection';
  edges: Array<Maybe<PatientDiagnosisEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PatientDiagnosisEdge = {
  __typename?: 'PatientDiagnosisEdge';
  node: PatientDiagnosis;
};

export type PatientDiagnosisFilter = {
  code?: InputMaybe<Scalars['String']>;
  differential?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type PatientDiagnosisInput = {
  diagnosisId: Scalars['ID'];
  differential: Scalars['Boolean'];
  location?: InputMaybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
};

export type PatientDiagnosisUpdateInput = {
  diagnosisId?: InputMaybe<Scalars['ID']>;
  differential?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  location?: InputMaybe<Scalars['String']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type PatientEdge = {
  __typename?: 'PatientEdge';
  node: Patient;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type PatientEncounterLimit = {
  __typename?: 'PatientEncounterLimit';
  fridayLimit: Scalars['Int'];
  id: Scalars['ID'];
  mondayLimit: Scalars['Int'];
  overbook: Scalars['Int'];
  saturdayLimit: Scalars['Int'];
  sundayLimit: Scalars['Int'];
  thursdayLimit: Scalars['Int'];
  tuesdayLimit: Scalars['Int'];
  user: User;
  userId: Scalars['ID'];
  wednesdayLimit: Scalars['Int'];
};

export type PatientEncounterLimitConnection = Connection & {
  __typename?: 'PatientEncounterLimitConnection';
  edges: Array<Maybe<PatientEncounterLimitEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PatientEncounterLimitEdge = {
  __typename?: 'PatientEncounterLimitEdge';
  node: PatientEncounterLimit;
};

export type PatientEncounterLimitInput = {
  fridayLimit: Scalars['Int'];
  mondayLimit: Scalars['Int'];
  saturdayLimit: Scalars['Int'];
  sundayLimit: Scalars['Int'];
  thursdayLimit: Scalars['Int'];
  tuesdayLimit: Scalars['Int'];
  userId: Scalars['ID'];
  wednesdayLimit: Scalars['Int'];
};

export type PatientEncounterLimitUpdateInput = {
  fridayLimit?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  mondayLimit?: InputMaybe<Scalars['Int']>;
  overbook?: InputMaybe<Scalars['Int']>;
  saturdayLimit?: InputMaybe<Scalars['Int']>;
  sundayLimit?: InputMaybe<Scalars['Int']>;
  thursdayLimit?: InputMaybe<Scalars['Int']>;
  tuesdayLimit?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['ID']>;
  wednesdayLimit?: InputMaybe<Scalars['Int']>;
};

export type PatientHistory = {
  __typename?: 'PatientHistory';
  familyIllnesses: Array<Maybe<FamilyIllness>>;
  id: Scalars['ID'];
  lifestyle: Array<Maybe<Lifestyle>>;
  pastHospitalizations: Array<Maybe<PastHospitalization>>;
  pastIllnesses: Array<Maybe<PastIllness>>;
  pastInjuries: Array<Maybe<PastInjury>>;
  pastSurgeries: Array<Maybe<PastSurgery>>;
  patientID: Scalars['ID'];
  reviewOfSystems: Array<Maybe<ReviewOfSystem>>;
  reviewOfSystemsNote?: Maybe<Scalars['String']>;
};

export type PatientHistoryUpdateInput = {
  id: Scalars['ID'];
  reviewOfSystemsNote?: InputMaybe<Scalars['String']>;
};

export type PatientInput = {
  cardNo?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  creditCompany?: InputMaybe<Scalars['String']>;
  dateOfBirth: Scalars['Time'];
  documents?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  email?: InputMaybe<Scalars['String']>;
  emergencyContactMemo?: InputMaybe<Scalars['String']>;
  emergencyContactName?: InputMaybe<Scalars['String']>;
  emergencyContactPhone?: InputMaybe<Scalars['String']>;
  emergencyContactPhone2?: InputMaybe<Scalars['String']>;
  emergencyContactRel?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender: Scalars['String'];
  homePhone?: InputMaybe<Scalars['String']>;
  houseNo?: InputMaybe<Scalars['String']>;
  idNo?: InputMaybe<Scalars['String']>;
  idType?: InputMaybe<Scalars['String']>;
  kebele?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  martialStatus?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  occupation?: InputMaybe<Scalars['String']>;
  paperRecord: Scalars['Boolean'];
  paperRecordDocument?: InputMaybe<FileUpload>;
  phoneNo: Scalars['String'];
  phoneNo2?: InputMaybe<Scalars['String']>;
  region: Scalars['String'];
  subCity?: InputMaybe<Scalars['String']>;
  woreda: Scalars['String'];
  zone?: InputMaybe<Scalars['String']>;
};

export type PatientInputV2 = {
  cardNo?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  creditCompany?: InputMaybe<Scalars['String']>;
  documents?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  email?: InputMaybe<Scalars['String']>;
  emergencyContactMemo?: InputMaybe<Scalars['String']>;
  emergencyContactName?: InputMaybe<Scalars['String']>;
  emergencyContactPhone?: InputMaybe<Scalars['String']>;
  emergencyContactPhone2?: InputMaybe<Scalars['String']>;
  emergencyContactRel?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender: Scalars['String'];
  homePhone?: InputMaybe<Scalars['String']>;
  houseNo?: InputMaybe<Scalars['String']>;
  idNo?: InputMaybe<Scalars['String']>;
  idType?: InputMaybe<Scalars['String']>;
  kebele?: InputMaybe<Scalars['String']>;
  lastName: Scalars['String'];
  martialStatus?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  occupation?: InputMaybe<Scalars['String']>;
  paperRecord: Scalars['Boolean'];
  paperRecordDocument?: InputMaybe<FileUpload>;
  phoneNo: Scalars['String'];
  phoneNo2?: InputMaybe<Scalars['String']>;
  region: Scalars['String'];
  subCity?: InputMaybe<Scalars['String']>;
  woreda: Scalars['String'];
  zone?: InputMaybe<Scalars['String']>;
};

export type PatientQueue = {
  __typename?: 'PatientQueue';
  id: Scalars['ID'];
  queue: Scalars['String'];
  queueName: Scalars['String'];
  queueType: QueueType;
};

export type PatientQueueInput = {
  queue: Array<Scalars['String']>;
  queueName: Scalars['String'];
  queueType: QueueType;
};

export type PatientQueueWithAppointment = {
  __typename?: 'PatientQueueWithAppointment';
  id: Scalars['ID'];
  queue: Array<Appointment>;
  queueName: Scalars['String'];
  queueType: QueueType;
};

export type PatientUpdateInput = {
  cardNo?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  credit?: InputMaybe<Scalars['Boolean']>;
  creditCompany?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['Time']>;
  documents?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  email?: InputMaybe<Scalars['String']>;
  emergencyContactMemo?: InputMaybe<Scalars['String']>;
  emergencyContactName?: InputMaybe<Scalars['String']>;
  emergencyContactPhone?: InputMaybe<Scalars['String']>;
  emergencyContactPhone2?: InputMaybe<Scalars['String']>;
  emergencyContactRel?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  homePhone?: InputMaybe<Scalars['String']>;
  houseNo?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  idNo?: InputMaybe<Scalars['String']>;
  idType?: InputMaybe<Scalars['String']>;
  kebele?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  martialStatus?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  occupation?: InputMaybe<Scalars['String']>;
  paperRecord?: InputMaybe<Scalars['Boolean']>;
  paperRecordDocument?: InputMaybe<FileUpload>;
  phoneNo?: InputMaybe<Scalars['String']>;
  phoneNo2?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  subCity?: InputMaybe<Scalars['String']>;
  woreda?: InputMaybe<Scalars['String']>;
  zone?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Payment = {
  __typename?: 'Payment';
  billing: Billing;
  billingId: Scalars['ID'];
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  invoiceNo: Scalars['String'];
  status: Scalars['String'];
};

export type PaymentConnection = Connection & {
  __typename?: 'PaymentConnection';
  edges: Array<Maybe<PaymentEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PaymentEdge = {
  __typename?: 'PaymentEdge';
  node: Payment;
};

export type PaymentInput = {
  billingId: Scalars['ID'];
  invoiceNo: Scalars['String'];
};

export type PaymentUpdateInput = {
  billingId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  invoiceNo?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type PaymentWaiver = {
  __typename?: 'PaymentWaiver';
  approved?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  patient: Patient;
  patientId: Scalars['ID'];
  payment: Payment;
  paymentId: Scalars['ID'];
  user: User;
  userId: Scalars['ID'];
};

export type PaymentWaiverConnection = Connection & {
  __typename?: 'PaymentWaiverConnection';
  edges: Array<Maybe<PaymentWaiverEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PaymentWaiverEdge = {
  __typename?: 'PaymentWaiverEdge';
  node: PaymentWaiver;
};

export type PaymentWaiverInput = {
  approved?: InputMaybe<Scalars['Boolean']>;
  patientId: Scalars['ID'];
  paymentId: Scalars['ID'];
};

export type PaymentWaiverUpdateInput = {
  approved?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  patientId?: InputMaybe<Scalars['ID']>;
  paymentId?: InputMaybe<Scalars['ID']>;
};

export enum Pertinence {
  Negative = 'NEGATIVE',
  Positive = 'POSITIVE'
}

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Pharmacy = {
  __typename?: 'Pharmacy';
  active: Scalars['Boolean'];
  address: Scalars['String'];
  country: Scalars['String'];
  id: Scalars['ID'];
  inHouse: Scalars['Boolean'];
  phone: Scalars['String'];
  region: Scalars['String'];
  title: Scalars['String'];
};

export type PharmacyConnection = Connection & {
  __typename?: 'PharmacyConnection';
  edges: Array<Maybe<PharmacyEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PharmacyEdge = {
  __typename?: 'PharmacyEdge';
  node: Pharmacy;
};

export type PharmacyInput = {
  active: Scalars['Boolean'];
  address: Scalars['String'];
  country: Scalars['String'];
  inHouse: Scalars['Boolean'];
  phone: Scalars['String'];
  region: Scalars['String'];
  title: Scalars['String'];
};

export type PharmacyUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  inHouse?: InputMaybe<Scalars['Boolean']>;
  phone?: InputMaybe<Scalars['String']>;
  region?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type PhysicalExamFinding = {
  __typename?: 'PhysicalExamFinding';
  abnormal: Scalars['Boolean'];
  examCategory: ExamCategory;
  examCategoryId: Scalars['ID'];
  id: Scalars['ID'];
  note?: Maybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
};

export type PhysicalExamFindingConnection = Connection & {
  __typename?: 'PhysicalExamFindingConnection';
  edges: Array<PhysicalExamFindingEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PhysicalExamFindingEdge = {
  __typename?: 'PhysicalExamFindingEdge';
  node: PhysicalExamFinding;
};

export type PhysicalExamFindingFilter = {
  examCategoryId?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type PhysicalExamFindingInput = {
  abnormal: Scalars['Boolean'];
  examCategoryId: Scalars['ID'];
  note?: InputMaybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
};

export type PhysicalExamFindingUpdateInput = {
  abnormal?: InputMaybe<Scalars['Boolean']>;
  examCategoryId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  note?: InputMaybe<Scalars['String']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type PrescriptionOrdersFilter = {
  orderedById?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

export type ProgressNote = {
  __typename?: 'ProgressNote';
  appointments: Array<Maybe<Appointment>>;
  patientHistory?: Maybe<PatientHistory>;
};

export type Query = {
  __typename?: 'Query';
  administrativeStatusConcepts: Array<ConceptDescription>;
  allergicConditionConcepts: Array<ConceptDescription>;
  allergies: AllergyConnection;
  amendment?: Maybe<Amendment>;
  amendments: Array<Amendment>;
  appointment: Appointment;
  appointmentStatuses: AppointmentStatusConnection;
  appointments: AppointmentConnection;
  billing: Billing;
  billings: BillingConnection;
  chiefComplaintType: ChiefComplaintType;
  chiefComplaintTypes: ChiefComplaintTypeConnection;
  chiefComplaints: ChiefComplaintConnection;
  conceptAttributes: ConceptAttributes;
  conceptChildren: Array<ConceptChild>;
  consultationBillings: Array<Billing>;
  currentDateTime: Scalars['Time'];
  diagnoses: DiagnosisConnection;
  diagnosticProcedure: DiagnosticProcedure;
  diagnosticProcedureOrder: DiagnosticProcedureOrder;
  diagnosticProcedureTypes: DiagnosticProcedureTypeConnection;
  diagnosticProcedures: DiagnosticProcedureConnection;
  examCategories: ExamCategoryConnection;
  examCategory: ExamCategory;
  examFinding: ExamFinding;
  examFindings: ExamFindingConnection;
  eyewearPrescriptionOrder?: Maybe<EyewearPrescriptionOrder>;
  eyewearShop?: Maybe<EyewearShop>;
  eyewearShops: EyewearShopConnection;
  familyIllnessConcepts: Array<ConceptDescription>;
  familyIllnesses: Array<Maybe<FamilyIllness>>;
  favoriteChiefComplaints: Array<Maybe<FavoriteChiefComplaint>>;
  favoriteDiagnosis: Array<Maybe<FavoriteDiagnosis>>;
  favoriteMedications: FavoriteMedicationConnection;
  file: File;
  files: FileConnection;
  findAppointmentsByPatientAndRange: Array<Maybe<Appointment>>;
  findSimilarPatients: SimilarPatients;
  findTodaysAppointments: AppointmentConnection;
  findTodaysCheckedInAppointments: AppointmentConnection;
  followUp: FollowUp;
  followUpOrder: FollowUpOrder;
  followUps: FollowUpConnection;
  getAllPatientProgress: ProgressNote;
  getByCardNo: Patient;
  getByUserTypeTitle: Array<User>;
  getChat: Chat;
  getChatMembers: Array<Maybe<ChatMember>>;
  getChatMessages: Array<Maybe<ChatMessage>>;
  getCommonChat: Chat;
  getHealthCheck: HealthCheckReport;
  getPatientDiagnosticProcedureTitles: Array<Scalars['String']>;
  getPatientDiagnosticProgress: Array<Appointment>;
  getPatientFiles: Array<File>;
  getPatientOrderCount: OrdersCount;
  getProgressNotes: ProgressNote;
  getSurgicalProceduresByPatient: SurgicalProcedureConnection;
  getTreatmentsByPatient: TreatmentConnection;
  getUnreadMessages: Array<Maybe<ChatUnreadMessage>>;
  getUserAppointments: AppointmentConnection;
  getUserChats: Array<Maybe<Chat>>;
  getVitalSignsProgress: VitalSignsProgress;
  historyOfDisorderConcepts: Array<ConceptDescription>;
  hpiComponentTypes: HpiComponentTypeConnection;
  hpiComponents: HpiComponentConnection;
  immunizationConcepts: Array<ConceptDescription>;
  intoleranceConcepts: Array<ConceptDescription>;
  labOrder: LabOrder;
  labTypes: LabTypeConnection;
  labs: LabConnection;
  lifestyleConcepts: Array<ConceptDescription>;
  lifestyleType: LifestyleType;
  lifestyleTypes: LifestyleTypeConnection;
  lifestyles: Array<Maybe<Lifestyle>>;
  medicationPrescriptionOrder?: Maybe<MedicalPrescriptionOrder>;
  mentalStateConcepts: Array<ConceptDescription>;
  modalities: ModalityConnection;
  notifs: Notif;
  nurseHomeStats: HomeStats;
  opthalmologyExam: OpthalmologyExam;
  organizationDetails: OrganizationDetails;
  pastHospitalizations: Array<Maybe<PastHospitalization>>;
  pastIllnessType: PastIllnessType;
  pastIllnessTypes: PastIllnessTypeConnection;
  pastIllnesses: Array<Maybe<PastIllness>>;
  pastInjuries: Array<Maybe<PastInjury>>;
  pastSurgeries: Array<Maybe<PastSurgery>>;
  patient: Patient;
  patientAllergyHistory: ClinicalFindingConnection;
  patientChart: PatientChart;
  patientCharts: PatientChartConnection;
  patientDiagnoses: PatientDiagnosisConnection;
  patientDisorderHistory: ClinicalFindingConnection;
  patientEncounterLimit: PatientEncounterLimit;
  patientEncounterLimitByUser: PatientEncounterLimit;
  patientEncounterLimits: PatientEncounterLimitConnection;
  patientHistory: PatientHistory;
  patientImmunizationHistory: ClinicalFindingConnection;
  patientIntoleranceHistory: ClinicalFindingConnection;
  patientMentalHistory: ClinicalFindingConnection;
  patientQueues: Array<PatientQueueWithAppointment>;
  patientSurgicalHistory: ClinicalFindingConnection;
  patients: PatientConnection;
  patientsAppointmentToday?: Maybe<Appointment>;
  payForConsultation: Scalars['Boolean'];
  paymentWaiver: PaymentWaiver;
  paymentWaivers: PaymentWaiverConnection;
  payments: PaymentConnection;
  pharmacies: PharmacyConnection;
  pharmacy?: Maybe<Pharmacy>;
  physicalExamFinding: PhysicalExamFinding;
  physicalExamFindings: PhysicalExamFindingConnection;
  physicianHomeStats: HomeStats;
  procedureConcepts: Array<ConceptDescription>;
  receptionHomeStats: HomeStats;
  referral: Referral;
  referralOrder: ReferralOrder;
  referrals: ReferralConnection;
  refraction?: Maybe<DiagnosticProcedure>;
  reviewOfSystem: ReviewOfSystem;
  reviewOfSystems: ReviewOfSystemConnection;
  rooms: RoomConnection;
  search: SearchResult;
  searchAppointments: AppointmentConnection;
  searchChiefComplaints: ChiefComplaintConnection;
  searchDiagnosticProcedureOrders: DiagnosticProcedureOrderConnection;
  searchEyewearPrescriptionOrders: EyewearPrescriptionOrderConnection;
  searchFavoriteMedications: FavoriteMedicationConnection;
  searchFollowUpOrders: FollowUpOrderConnection;
  searchLabOrders: LabOrderConnection;
  searchMedicalPrescriptions: MedicalPrescriptionConnection;
  searchMedicationPrescriptionOrders: MedicalPrescriptionOrderConnection;
  searchPatientDiagnosis: PatientDiagnosisConnection;
  searchPatients: Array<Patient>;
  searchReferralOrders: ReferralOrderConnection;
  searchSurgicalOrders: SurgicalOrderConnection;
  searchTreatmentOrders: TreatmentOrderConnection;
  searchUsers: Array<Maybe<User>>;
  socialHistoryConcepts: Array<ConceptDescription>;
  supplies: SupplyConnection;
  surgicalOrder: SurgicalOrder;
  surgicalProcedure: SurgicalProcedure;
  surgicalProcedureTypes: SurgicalProcedureTypeConnection;
  surgicalProcedures: SurgicalProcedureConnection;
  system: System;
  systemSymptom: SystemSymptom;
  systemSymptoms: SystemSymptomConnection;
  systems: SystemConnection;
  todos: Array<Todo>;
  treatment: Treatment;
  treatmentOrder: TreatmentOrder;
  treatmentTypes: TreatmentTypeConnection;
  treatments: TreatmentConnection;
  user: User;
  userFavoriteMedications: FavoriteMedicationConnection;
  userSubscriptions: QueueSubscription;
  userTypes: UserTypeConnection;
  users: UserConnection;
  visitTypes: VisitTypeConnection;
  vitalSigns: VitalSigns;
};


export type QueryAdministrativeStatusConceptsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryAllergicConditionConceptsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryAllergiesArgs = {
  filter?: InputMaybe<AllergyFilter>;
  page: PaginationInput;
};


export type QueryAmendmentArgs = {
  id: Scalars['ID'];
};


export type QueryAmendmentsArgs = {
  filter?: InputMaybe<AmendmentFilter>;
};


export type QueryAppointmentArgs = {
  id: Scalars['ID'];
};


export type QueryAppointmentStatusesArgs = {
  page: PaginationInput;
};


export type QueryAppointmentsArgs = {
  filter?: InputMaybe<AppointmentFilter>;
  page: PaginationInput;
};


export type QueryBillingArgs = {
  id: Scalars['ID'];
};


export type QueryBillingsArgs = {
  filter?: InputMaybe<BillingFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryChiefComplaintTypeArgs = {
  id: Scalars['ID'];
};


export type QueryChiefComplaintTypesArgs = {
  favorites?: InputMaybe<Scalars['Boolean']>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryChiefComplaintsArgs = {
  filter?: InputMaybe<ChiefComplaintFilter>;
  page: PaginationInput;
};


export type QueryConceptAttributesArgs = {
  conceptId: Scalars['String'];
};


export type QueryConceptChildrenArgs = {
  conceptId: Scalars['String'];
};


export type QueryDiagnosesArgs = {
  favorites?: InputMaybe<Scalars['Boolean']>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryDiagnosticProcedureArgs = {
  filter: DiagnosticProcedureFilter;
};


export type QueryDiagnosticProcedureOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryDiagnosticProcedureTypesArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryDiagnosticProceduresArgs = {
  filter?: InputMaybe<DiagnosticProcedureFilter>;
  page: PaginationInput;
};


export type QueryExamCategoriesArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryExamCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryExamFindingArgs = {
  id: Scalars['ID'];
};


export type QueryExamFindingsArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryEyewearPrescriptionOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryEyewearShopArgs = {
  id: Scalars['ID'];
};


export type QueryEyewearShopsArgs = {
  page: PaginationInput;
};


export type QueryFamilyIllnessConceptsArgs = {
  pertinence?: InputMaybe<Pertinence>;
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryFamilyIllnessesArgs = {
  patientHistoryId: Scalars['ID'];
};


export type QueryFavoriteMedicationsArgs = {
  filter?: InputMaybe<FavoriteMedicationFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryFileArgs = {
  id: Scalars['ID'];
};


export type QueryFilesArgs = {
  page: PaginationInput;
};


export type QueryFindAppointmentsByPatientAndRangeArgs = {
  end: Scalars['Time'];
  patientId: Scalars['ID'];
  start: Scalars['Time'];
};


export type QueryFindSimilarPatientsArgs = {
  input: SimilarPatientsInput;
};


export type QueryFindTodaysAppointmentsArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryFindTodaysCheckedInAppointmentsArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryFollowUpArgs = {
  filter: FollowUpFilter;
};


export type QueryFollowUpOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryFollowUpsArgs = {
  filter?: InputMaybe<FollowUpFilter>;
  page: PaginationInput;
};


export type QueryGetAllPatientProgressArgs = {
  patientId: Scalars['ID'];
};


export type QueryGetByCardNoArgs = {
  cardNo: Scalars['String'];
};


export type QueryGetByUserTypeTitleArgs = {
  input: Scalars['String'];
};


export type QueryGetChatMembersArgs = {
  id: Scalars['ID'];
};


export type QueryGetChatMessagesArgs = {
  id: Scalars['ID'];
};


export type QueryGetCommonChatArgs = {
  recipientID: Scalars['ID'];
};


export type QueryGetPatientDiagnosticProcedureTitlesArgs = {
  patientId: Scalars['ID'];
};


export type QueryGetPatientDiagnosticProgressArgs = {
  patientId: Scalars['ID'];
  procedureTypeTitle: Scalars['String'];
};


export type QueryGetPatientFilesArgs = {
  patientId: Scalars['ID'];
};


export type QueryGetPatientOrderCountArgs = {
  patientId: Scalars['ID'];
};


export type QueryGetProgressNotesArgs = {
  appointmentId: Scalars['ID'];
};


export type QueryGetSurgicalProceduresByPatientArgs = {
  page: PaginationInput;
  patientId: Scalars['ID'];
};


export type QueryGetTreatmentsByPatientArgs = {
  page: PaginationInput;
  patientId: Scalars['ID'];
};


export type QueryGetUserAppointmentsArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
  subscriptions?: InputMaybe<Scalars['Boolean']>;
  visitType?: InputMaybe<Scalars['String']>;
};


export type QueryGetVitalSignsProgressArgs = {
  patientId: Scalars['ID'];
};


export type QueryHistoryOfDisorderConceptsArgs = {
  pertinence?: InputMaybe<Pertinence>;
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryHpiComponentTypesArgs = {
  page: PaginationInput;
};


export type QueryHpiComponentsArgs = {
  filter?: InputMaybe<HpiFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryImmunizationConceptsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryIntoleranceConceptsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryLabOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryLabTypesArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryLabsArgs = {
  filter?: InputMaybe<LabFilter>;
  page: PaginationInput;
};


export type QueryLifestyleConceptsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryLifestyleTypeArgs = {
  id: Scalars['ID'];
};


export type QueryLifestyleTypesArgs = {
  page: PaginationInput;
};


export type QueryLifestylesArgs = {
  patientHistoryId: Scalars['ID'];
};


export type QueryMedicationPrescriptionOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryMentalStateConceptsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryModalitiesArgs = {
  filter?: InputMaybe<ModalityFilter>;
  page: PaginationInput;
};


export type QueryOpthalmologyExamArgs = {
  filter: OphthalmologyExamFilter;
};


export type QueryPastHospitalizationsArgs = {
  patientHistoryId: Scalars['ID'];
};


export type QueryPastIllnessTypeArgs = {
  id: Scalars['ID'];
};


export type QueryPastIllnessTypesArgs = {
  page: PaginationInput;
};


export type QueryPastIllnessesArgs = {
  patientHistoryId: Scalars['ID'];
};


export type QueryPastInjuriesArgs = {
  patientHistoryId: Scalars['ID'];
};


export type QueryPastSurgeriesArgs = {
  patientHistoryId: Scalars['ID'];
};


export type QueryPatientArgs = {
  id: Scalars['ID'];
};


export type QueryPatientAllergyHistoryArgs = {
  filter?: InputMaybe<ClinicalFindingFilter>;
  page: PaginationInput;
};


export type QueryPatientChartArgs = {
  details?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
};


export type QueryPatientChartsArgs = {
  page: PaginationInput;
};


export type QueryPatientDiagnosesArgs = {
  filter?: InputMaybe<PatientDiagnosisFilter>;
  page: PaginationInput;
};


export type QueryPatientDisorderHistoryArgs = {
  filter?: InputMaybe<ClinicalFindingFilter>;
  page: PaginationInput;
};


export type QueryPatientEncounterLimitArgs = {
  id: Scalars['ID'];
};


export type QueryPatientEncounterLimitByUserArgs = {
  userId: Scalars['ID'];
};


export type QueryPatientEncounterLimitsArgs = {
  page: PaginationInput;
};


export type QueryPatientHistoryArgs = {
  id: Scalars['ID'];
};


export type QueryPatientImmunizationHistoryArgs = {
  filter?: InputMaybe<ClinicalFindingFilter>;
  page: PaginationInput;
};


export type QueryPatientIntoleranceHistoryArgs = {
  filter?: InputMaybe<ClinicalFindingFilter>;
  page: PaginationInput;
};


export type QueryPatientMentalHistoryArgs = {
  filter?: InputMaybe<ClinicalFindingFilter>;
  page: PaginationInput;
};


export type QueryPatientSurgicalHistoryArgs = {
  filter?: InputMaybe<ClinicalFindingFilter>;
  page: PaginationInput;
};


export type QueryPatientsArgs = {
  page: PaginationInput;
};


export type QueryPatientsAppointmentTodayArgs = {
  checkedIn: Scalars['Boolean'];
  patientId: Scalars['ID'];
};


export type QueryPayForConsultationArgs = {
  date?: InputMaybe<Scalars['Time']>;
  patientId: Scalars['ID'];
};


export type QueryPaymentWaiverArgs = {
  id: Scalars['ID'];
};


export type QueryPaymentWaiversArgs = {
  page: PaginationInput;
};


export type QueryPaymentsArgs = {
  page: PaginationInput;
};


export type QueryPharmaciesArgs = {
  page: PaginationInput;
};


export type QueryPharmacyArgs = {
  id: Scalars['ID'];
};


export type QueryPhysicalExamFindingArgs = {
  id: Scalars['ID'];
};


export type QueryPhysicalExamFindingsArgs = {
  filter?: InputMaybe<PhysicalExamFindingFilter>;
  page: PaginationInput;
};


export type QueryProcedureConceptsArgs = {
  pertinence?: InputMaybe<Pertinence>;
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryReferralArgs = {
  filter: ReferralFilter;
};


export type QueryReferralOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryReferralsArgs = {
  filter?: InputMaybe<ReferralFilter>;
  page: PaginationInput;
};


export type QueryRefractionArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryReviewOfSystemArgs = {
  id: Scalars['ID'];
};


export type QueryReviewOfSystemsArgs = {
  filter?: InputMaybe<ReviewOfSystemFilter>;
  page: PaginationInput;
};


export type QueryRoomsArgs = {
  page: PaginationInput;
};


export type QuerySearchArgs = {
  searchTerm: Scalars['String'];
};


export type QuerySearchAppointmentsArgs = {
  input: AppointmentSearchInput;
  page: PaginationInput;
};


export type QuerySearchChiefComplaintsArgs = {
  page: PaginationInput;
  searchTerm: Scalars['String'];
};


export type QuerySearchDiagnosticProcedureOrdersArgs = {
  date?: InputMaybe<Scalars['Time']>;
  filter?: InputMaybe<DiagnosticProcedureOrderFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchEyewearPrescriptionOrdersArgs = {
  filter?: InputMaybe<PrescriptionOrdersFilter>;
  page: PaginationInput;
  prescribedDate?: InputMaybe<Scalars['Time']>;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchFavoriteMedicationsArgs = {
  page: PaginationInput;
  searchTerm: Scalars['String'];
};


export type QuerySearchFollowUpOrdersArgs = {
  date?: InputMaybe<Scalars['Time']>;
  filter?: InputMaybe<FollowUpOrderFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchLabOrdersArgs = {
  date?: InputMaybe<Scalars['Time']>;
  filter?: InputMaybe<LabOrderFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchMedicalPrescriptionsArgs = {
  filter?: InputMaybe<MedicalPrescriptionFilter>;
  page: PaginationInput;
  prescribedDate?: InputMaybe<Scalars['Time']>;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchMedicationPrescriptionOrdersArgs = {
  filter?: InputMaybe<PrescriptionOrdersFilter>;
  page: PaginationInput;
  prescribedDate?: InputMaybe<Scalars['Time']>;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchPatientDiagnosisArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchPatientsArgs = {
  term: Scalars['String'];
};


export type QuerySearchReferralOrdersArgs = {
  date?: InputMaybe<Scalars['Time']>;
  filter?: InputMaybe<ReferralOrderFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchSurgicalOrdersArgs = {
  date?: InputMaybe<Scalars['Time']>;
  filter?: InputMaybe<SurgicalOrderFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchTreatmentOrdersArgs = {
  date?: InputMaybe<Scalars['Time']>;
  filter?: InputMaybe<TreatmentOrderFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySearchUsersArgs = {
  input: UserSearchInput;
};


export type QuerySocialHistoryConceptsArgs = {
  searchTerm?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QuerySuppliesArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySurgicalOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QuerySurgicalProcedureArgs = {
  patientChartId: Scalars['ID'];
};


export type QuerySurgicalProcedureTypesArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySurgicalProceduresArgs = {
  filter?: InputMaybe<SurgicalProcedureFilter>;
  page: PaginationInput;
};


export type QuerySystemArgs = {
  id: Scalars['ID'];
};


export type QuerySystemSymptomArgs = {
  id: Scalars['ID'];
};


export type QuerySystemSymptomsArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QuerySystemsArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryTreatmentArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryTreatmentOrderArgs = {
  patientChartId: Scalars['ID'];
};


export type QueryTreatmentTypesArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryTreatmentsArgs = {
  filter?: InputMaybe<TreatmentFilter>;
  page: PaginationInput;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserFavoriteMedicationsArgs = {
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryUserSubscriptionsArgs = {
  userId: Scalars['ID'];
};


export type QueryUserTypesArgs = {
  page: PaginationInput;
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilter>;
  page: PaginationInput;
  searchTerm?: InputMaybe<Scalars['String']>;
};


export type QueryVisitTypesArgs = {
  page: PaginationInput;
};


export type QueryVitalSignsArgs = {
  filter: VitalSignsFilter;
};

export type QueueSubscription = {
  __typename?: 'QueueSubscription';
  id: Scalars['ID'];
  subscriptions: Array<PatientQueue>;
  user: User;
  userId: Scalars['ID'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum QueueType {
  Diagnostic = 'DIAGNOSTIC',
  Lab = 'LAB',
  Preexam = 'PREEXAM',
  Preoperation = 'PREOPERATION',
  Surgical = 'SURGICAL',
  Treatment = 'TREATMENT',
  User = 'USER'
}

export type Referral = {
  __typename?: 'Referral';
  id: Scalars['ID'];
  patientChartId: Scalars['ID'];
  reason: Scalars['String'];
  receptionNote: Scalars['String'];
  referralOrderId: Scalars['ID'];
  referredToId?: Maybe<Scalars['ID']>;
  referredToName: Scalars['String'];
  status: ReferralStatus;
  type: ReferralType;
};

export type ReferralConnection = Connection & {
  __typename?: 'ReferralConnection';
  edges: Array<ReferralEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ReferralEdge = {
  __typename?: 'ReferralEdge';
  node: Referral;
};

export type ReferralFilter = {
  id?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
};

export type ReferralOrder = {
  __typename?: 'ReferralOrder';
  createdAt?: Maybe<Scalars['Time']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  phoneNo: Scalars['String'];
  referrals: Array<Referral>;
  status: ReferralOrderStatus;
  userName: Scalars['String'];
};

export type ReferralOrderConnection = Connection & {
  __typename?: 'ReferralOrderConnection';
  edges: Array<ReferralOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ReferralOrderEdge = {
  __typename?: 'ReferralOrderEdge';
  node: ReferralOrder;
};

export type ReferralOrderFilter = {
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum ReferralOrderStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export enum ReferralStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export enum ReferralType {
  PatientInHouseReferral = 'PATIENT_IN_HOUSE_REFERRAL',
  PatientOutsourceReferral = 'PATIENT_OUTSOURCE_REFERRAL'
}

export type ReviewOfSystem = {
  __typename?: 'ReviewOfSystem';
  id: Scalars['ID'];
  note?: Maybe<Scalars['String']>;
  patientHistoryId: Scalars['ID'];
  systemSymptom: SystemSymptom;
  systemSymptomId: Scalars['ID'];
};

export type ReviewOfSystemConnection = Connection & {
  __typename?: 'ReviewOfSystemConnection';
  edges: Array<ReviewOfSystemEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ReviewOfSystemEdge = {
  __typename?: 'ReviewOfSystemEdge';
  node: ReviewOfSystem;
};

export type ReviewOfSystemFilter = {
  patientHistoryId?: InputMaybe<Scalars['ID']>;
  systemSymptomId?: InputMaybe<Scalars['ID']>;
};

export type ReviewOfSystemInput = {
  note?: InputMaybe<Scalars['String']>;
  patientHistoryId: Scalars['ID'];
  systemSymptomId: Scalars['ID'];
};

export type ReviewOfSystemUpdateInput = {
  id: Scalars['ID'];
  note?: InputMaybe<Scalars['String']>;
  patientHistoryId?: InputMaybe<Scalars['ID']>;
  systemSymptomId?: InputMaybe<Scalars['ID']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type Room = {
  __typename?: 'Room';
  id: Scalars['Int'];
  title: Scalars['String'];
};

export type RoomConnection = Connection & {
  __typename?: 'RoomConnection';
  edges: Array<Maybe<RoomEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type RoomEdge = Edge & {
  __typename?: 'RoomEdge';
  node: Room;
};

export type RoomInput = {
  title: Scalars['String'];
};

export type RoomOrder = {
  direction: OrderDirection;
  field: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type SearchResult = {
  __typename?: 'SearchResult';
  patients: Array<Patient>;
  providers: Array<User>;
};

export type SimilarPatients = {
  __typename?: 'SimilarPatients';
  byName: Array<Patient>;
  byPhone: Array<Patient>;
};

export type SimilarPatientsInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNo: Scalars['String'];
};

export type SubscribeInput = {
  patientQueueId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  notification: Notification;
};

export type Supply = {
  __typename?: 'Supply';
  active: Scalars['Boolean'];
  billings: Array<Maybe<Billing>>;
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type SupplyConnection = Connection & {
  __typename?: 'SupplyConnection';
  edges: Array<Maybe<SupplyEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SupplyEdge = {
  __typename?: 'SupplyEdge';
  node: Supply;
};

export type SupplyInput = {
  active: Scalars['Boolean'];
  billingIds: Array<InputMaybe<Scalars['ID']>>;
  title: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum SupplyStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type SupplyUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  billingIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export enum SurgeryStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type SurgicalOrder = {
  __typename?: 'SurgicalOrder';
  createdAt?: Maybe<Scalars['Time']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  phoneNo: Scalars['String'];
  status: SurgicalOrderStatus;
  surgicalProcedures: Array<SurgicalProcedure>;
  userName: Scalars['String'];
};

export type SurgicalOrderConnection = Connection & {
  __typename?: 'SurgicalOrderConnection';
  edges: Array<SurgicalOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SurgicalOrderEdge = {
  __typename?: 'SurgicalOrderEdge';
  node: SurgicalOrder;
};

export type SurgicalOrderFilter = {
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum SurgicalOrderStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type SurgicalProcedure = {
  __typename?: 'SurgicalProcedure';
  abdomen?: Maybe<Scalars['String']>;
  aclol?: Maybe<Scalars['String']>;
  aclolPlanned?: Maybe<Scalars['Boolean']>;
  aclolUnplanned?: Maybe<Scalars['Boolean']>;
  additionalNotes?: Maybe<Scalars['String']>;
  adrenalin?: Maybe<Scalars['Boolean']>;
  air?: Maybe<Scalars['Boolean']>;
  allergies?: Maybe<Scalars['String']>;
  alpActive?: Maybe<Scalars['Boolean']>;
  alpDate?: Maybe<Scalars['Time']>;
  alpResults?: Maybe<Scalars['String']>;
  altsgptActive?: Maybe<Scalars['Boolean']>;
  altsgptDate?: Maybe<Scalars['Time']>;
  altsgptResults?: Maybe<Scalars['String']>;
  antibiotic?: Maybe<Scalars['Boolean']>;
  asa1?: Maybe<Scalars['Boolean']>;
  asa2?: Maybe<Scalars['Boolean']>;
  asa3?: Maybe<Scalars['Boolean']>;
  asa4?: Maybe<Scalars['Boolean']>;
  asa5?: Maybe<Scalars['Boolean']>;
  assistantName?: Maybe<Scalars['String']>;
  asthma?: Maybe<Scalars['String']>;
  astsgotActive?: Maybe<Scalars['Boolean']>;
  astsgotDate?: Maybe<Scalars['Time']>;
  astsgotResults?: Maybe<Scalars['String']>;
  atBreaks?: Maybe<Scalars['Boolean']>;
  bilirubinDirectActive?: Maybe<Scalars['Boolean']>;
  bilirubinDirectDate?: Maybe<Scalars['Time']>;
  bilirubinDirectResults?: Maybe<Scalars['String']>;
  bilirubinTotalActive?: Maybe<Scalars['Boolean']>;
  bilirubinTotalDate?: Maybe<Scalars['Time']>;
  bilirubinTotalResults?: Maybe<Scalars['String']>;
  bleedingTendancy?: Maybe<Scalars['Boolean']>;
  bleedingTendancyNote?: Maybe<Scalars['String']>;
  bloodPressure?: Maybe<Scalars['String']>;
  bloodSugar?: Maybe<Scalars['String']>;
  brilliantBlue?: Maybe<Scalars['Boolean']>;
  bss?: Maybe<Scalars['Boolean']>;
  capsulotomyCanOpener?: Maybe<Scalars['Boolean']>;
  capsulotomyCcc?: Maybe<Scalars['Boolean']>;
  capsulotomyLinear?: Maybe<Scalars['Boolean']>;
  cardiac?: Maybe<Scalars['Boolean']>;
  cardiacDisease?: Maybe<Scalars['String']>;
  cardiacNote?: Maybe<Scalars['String']>;
  cardiovascular?: Maybe<Scalars['String']>;
  cns?: Maybe<Scalars['String']>;
  coagulationInrActive?: Maybe<Scalars['Boolean']>;
  coagulationInrDate?: Maybe<Scalars['Time']>;
  coagulationInrResults?: Maybe<Scalars['String']>;
  coagulationPtActive?: Maybe<Scalars['Boolean']>;
  coagulationPtDate?: Maybe<Scalars['Time']>;
  coagulationPtResults?: Maybe<Scalars['String']>;
  coagulationPttActive?: Maybe<Scalars['Boolean']>;
  coagulationPttDate?: Maybe<Scalars['Time']>;
  coagulationPttResults?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  complicationChrodialEffusion?: Maybe<Scalars['Boolean']>;
  complicationIatrogenicBreaks?: Maybe<Scalars['Boolean']>;
  complicationIntraocilarHemorrhage?: Maybe<Scalars['Boolean']>;
  complicationLensTouch?: Maybe<Scalars['Boolean']>;
  complicationMacularFold?: Maybe<Scalars['Boolean']>;
  complicationPfcl?: Maybe<Scalars['Boolean']>;
  complicationRetinalDetachment?: Maybe<Scalars['Boolean']>;
  complicationSubretialOil?: Maybe<Scalars['Boolean']>;
  complicationSubretialPfcl?: Maybe<Scalars['Boolean']>;
  complicationSuprachorodialHemorrhage?: Maybe<Scalars['Boolean']>;
  complicationsNote?: Maybe<Scalars['String']>;
  complicationsOthers?: Maybe<Scalars['String']>;
  conjFlapFornix?: Maybe<Scalars['Boolean']>;
  conjFlapLimbal?: Maybe<Scalars['Boolean']>;
  cryopexyAtBreaks?: Maybe<Scalars['Boolean']>;
  descematesStrip?: Maybe<Scalars['Boolean']>;
  diabetes?: Maybe<Scalars['String']>;
  dm?: Maybe<Scalars['Boolean']>;
  dmNote?: Maybe<Scalars['String']>;
  drapes?: Maybe<Scalars['Boolean']>;
  electrolytesCa2PlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesCa2PlusDate?: Maybe<Scalars['Time']>;
  electrolytesCa2PlusResults?: Maybe<Scalars['String']>;
  electrolytesClMinusActive?: Maybe<Scalars['Boolean']>;
  electrolytesClMinusDate?: Maybe<Scalars['Time']>;
  electrolytesClMinusResults?: Maybe<Scalars['String']>;
  electrolytesKPlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesKPlusDate?: Maybe<Scalars['Time']>;
  electrolytesKPlusResults?: Maybe<Scalars['String']>;
  electrolytesMg2PlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesMg2PlusDate?: Maybe<Scalars['Time']>;
  electrolytesMg2PlusResults?: Maybe<Scalars['String']>;
  electrolytesNaPlusActive?: Maybe<Scalars['Boolean']>;
  electrolytesNaPlusDate?: Maybe<Scalars['Time']>;
  electrolytesNaPlusResults?: Maybe<Scalars['String']>;
  electrolytesPMinusActive?: Maybe<Scalars['Boolean']>;
  electrolytesPMinusDate?: Maybe<Scalars['Time']>;
  electrolytesPMinusResults?: Maybe<Scalars['String']>;
  encirclingBand?: Maybe<Scalars['Boolean']>;
  endodiathermy?: Maybe<Scalars['Boolean']>;
  endolaser?: Maybe<Scalars['Boolean']>;
  endothelialDamage?: Maybe<Scalars['Boolean']>;
  fax?: Maybe<Scalars['Boolean']>;
  fitForSurgery?: Maybe<Scalars['Boolean']>;
  fitForSurgeryNote?: Maybe<Scalars['String']>;
  ga?: Maybe<Scalars['Boolean']>;
  gus?: Maybe<Scalars['String']>;
  healon?: Maybe<Scalars['Boolean']>;
  hgbhctActive?: Maybe<Scalars['Boolean']>;
  hgbhctDate?: Maybe<Scalars['Time']>;
  hgbhctResults?: Maybe<Scalars['String']>;
  hpmc?: Maybe<Scalars['Boolean']>;
  hpn?: Maybe<Scalars['String']>;
  hypertension?: Maybe<Scalars['Boolean']>;
  hypertensionNote?: Maybe<Scalars['String']>;
  hyphema?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  ilmp?: Maybe<Scalars['Boolean']>;
  interacameral?: Maybe<Scalars['String']>;
  iolBagSulcus?: Maybe<Scalars['Boolean']>;
  iolModel?: Maybe<Scalars['String']>;
  iolPlacementBag?: Maybe<Scalars['Boolean']>;
  iolSulcus?: Maybe<Scalars['Boolean']>;
  iridoDialysis?: Maybe<Scalars['Boolean']>;
  irisDamage?: Maybe<Scalars['Boolean']>;
  irodectpmyNone?: Maybe<Scalars['Boolean']>;
  irodectpmyPl?: Maybe<Scalars['Boolean']>;
  irodectpmySl?: Maybe<Scalars['Boolean']>;
  irrigatingSolution?: Maybe<Scalars['String']>;
  ismss?: Maybe<Scalars['String']>;
  la?: Maybe<Scalars['Boolean']>;
  leftAnteriorSegment?: Maybe<Scalars['String']>;
  leftBiometry?: Maybe<Scalars['String']>;
  leftCorrected?: Maybe<Scalars['String']>;
  leftIop?: Maybe<Scalars['String']>;
  leftPosteriorSegment?: Maybe<Scalars['String']>;
  lensExtractionEcce?: Maybe<Scalars['Boolean']>;
  lensExtractionIcce?: Maybe<Scalars['Boolean']>;
  lensExtractionPhaco?: Maybe<Scalars['Boolean']>;
  membraneDeliniation?: Maybe<Scalars['Boolean']>;
  membranePeeling?: Maybe<Scalars['Boolean']>;
  membraneSegmentation?: Maybe<Scalars['Boolean']>;
  nucluesDrop?: Maybe<Scalars['Boolean']>;
  nylon?: Maybe<Scalars['Boolean']>;
  opv1?: Maybe<Scalars['Boolean']>;
  opv2?: Maybe<Scalars['Boolean']>;
  opv3?: Maybe<Scalars['Boolean']>;
  opv4?: Maybe<Scalars['Boolean']>;
  orderNote: Scalars['String'];
  patientChartId: Scalars['ID'];
  payments: Array<Payment>;
  pcTear?: Maybe<Scalars['Boolean']>;
  performOnEye: Scalars['String'];
  peribulbar?: Maybe<Scalars['Boolean']>;
  pfcl?: Maybe<Scalars['Boolean']>;
  physicalAbdomen?: Maybe<Scalars['String']>;
  physicalArtificalDenture?: Maybe<Scalars['Boolean']>;
  physicalArtificalDentureNote?: Maybe<Scalars['String']>;
  physicalBloodPressure?: Maybe<Scalars['String']>;
  physicalChest?: Maybe<Scalars['String']>;
  physicalCns?: Maybe<Scalars['String']>;
  physicalCvs?: Maybe<Scalars['String']>;
  physicalGus?: Maybe<Scalars['String']>;
  physicalHeent?: Maybe<Scalars['String']>;
  physicalIs?: Maybe<Scalars['String']>;
  physicalLgs?: Maybe<Scalars['String']>;
  physicalMss?: Maybe<Scalars['String']>;
  physicalPr?: Maybe<Scalars['String']>;
  physicalRr?: Maybe<Scalars['String']>;
  physicalSaO2?: Maybe<Scalars['String']>;
  physicalTemperature?: Maybe<Scalars['String']>;
  physicalWeight?: Maybe<Scalars['String']>;
  pilo?: Maybe<Scalars['Boolean']>;
  pltActive?: Maybe<Scalars['Boolean']>;
  pltDate?: Maybe<Scalars['Time']>;
  pltResults?: Maybe<Scalars['String']>;
  preanestheticAllergies?: Maybe<Scalars['Boolean']>;
  preanestheticAllergiesNote?: Maybe<Scalars['String']>;
  preanestheticAsthma?: Maybe<Scalars['Boolean']>;
  preanestheticAsthmaNote?: Maybe<Scalars['String']>;
  preanestheticDocuments: Array<File>;
  preanestheticPerformedBy?: Maybe<Scalars['ID']>;
  prp?: Maybe<Scalars['Boolean']>;
  receptionNote: Scalars['String'];
  renal?: Maybe<Scalars['Boolean']>;
  renalBunActive?: Maybe<Scalars['Boolean']>;
  renalBunDate?: Maybe<Scalars['Time']>;
  renalBunResults?: Maybe<Scalars['String']>;
  renalCrActive?: Maybe<Scalars['Boolean']>;
  renalCrDate?: Maybe<Scalars['Time']>;
  renalCrResults?: Maybe<Scalars['String']>;
  renalNote?: Maybe<Scalars['String']>;
  respiratory?: Maybe<Scalars['String']>;
  retainedCortex?: Maybe<Scalars['Boolean']>;
  retinectomy?: Maybe<Scalars['Boolean']>;
  retinotomy?: Maybe<Scalars['Boolean']>;
  retrobulbar?: Maybe<Scalars['Boolean']>;
  rightAnteriorSegment?: Maybe<Scalars['String']>;
  rightBiometry?: Maybe<Scalars['String']>;
  rightCorrected?: Maybe<Scalars['String']>;
  rightIop?: Maybe<Scalars['String']>;
  rightPosteriorSegment?: Maybe<Scalars['String']>;
  ringer?: Maybe<Scalars['Boolean']>;
  rvi?: Maybe<Scalars['Boolean']>;
  rviNote?: Maybe<Scalars['String']>;
  sclerotomyStitches?: Maybe<Scalars['Boolean']>;
  sectionCorneral?: Maybe<Scalars['Boolean']>;
  sectionLimbal?: Maybe<Scalars['Boolean']>;
  sectionScleralTunnel?: Maybe<Scalars['Boolean']>;
  serumAlbuminActive?: Maybe<Scalars['Boolean']>;
  serumAlbuminDate?: Maybe<Scalars['Time']>;
  serumAlbuminResults?: Maybe<Scalars['String']>;
  siliconOilExchange?: Maybe<Scalars['Boolean']>;
  siliconOilFiveThousandCsk?: Maybe<Scalars['Boolean']>;
  siliconOilInjection?: Maybe<Scalars['Boolean']>;
  siliconOilOneThousandCsk?: Maybe<Scalars['Boolean']>;
  siliconOilPfclExchange?: Maybe<Scalars['Boolean']>;
  silk?: Maybe<Scalars['Boolean']>;
  specialInstructions?: Maybe<Scalars['String']>;
  sphincterectomy?: Maybe<Scalars['Boolean']>;
  status: SurgeryStatus;
  steroid?: Maybe<Scalars['Boolean']>;
  subconj?: Maybe<Scalars['String']>;
  subtenones?: Maybe<Scalars['Boolean']>;
  surgicalOrderId: Scalars['ID'];
  surgicalProcedureType: SurgicalProcedureType;
  surgicalProcedureTypeId: Scalars['ID'];
  surgicalProcedureTypeTitle: Scalars['String'];
  suture?: Maybe<Scalars['String']>;
  suture80?: Maybe<Scalars['Boolean']>;
  suture90?: Maybe<Scalars['Boolean']>;
  suture100?: Maybe<Scalars['Boolean']>;
  sutureContinuous?: Maybe<Scalars['Boolean']>;
  sutureInterrupted?: Maybe<Scalars['Boolean']>;
  sutureNone?: Maybe<Scalars['Boolean']>;
  tca?: Maybe<Scalars['Boolean']>;
  threeSixyDegree?: Maybe<Scalars['Boolean']>;
  thyroidFreeT3Active?: Maybe<Scalars['Boolean']>;
  thyroidFreeT3Date?: Maybe<Scalars['Time']>;
  thyroidFreeT3Results?: Maybe<Scalars['String']>;
  thyroidTotalT4Active?: Maybe<Scalars['Boolean']>;
  thyroidTotalT4Date?: Maybe<Scalars['Time']>;
  thyroidTotalT4Results?: Maybe<Scalars['String']>;
  thyroidTshActive?: Maybe<Scalars['Boolean']>;
  thyroidTshDate?: Maybe<Scalars['Time']>;
  thyroidTshResults?: Maybe<Scalars['String']>;
  topical?: Maybe<Scalars['Boolean']>;
  totalProteinActive?: Maybe<Scalars['Boolean']>;
  totalProteinDate?: Maybe<Scalars['Time']>;
  totalProteinResults?: Maybe<Scalars['String']>;
  treatment?: Maybe<Scalars['String']>;
  twentyFiveG?: Maybe<Scalars['Boolean']>;
  twentyG?: Maybe<Scalars['Boolean']>;
  twentyThreeG?: Maybe<Scalars['Boolean']>;
  typeOfIol?: Maybe<Scalars['String']>;
  typeOfIolAc?: Maybe<Scalars['Boolean']>;
  typeOfIolPc?: Maybe<Scalars['Boolean']>;
  unplanned?: Maybe<Scalars['String']>;
  uriAnalysis?: Maybe<Scalars['String']>;
  visco?: Maybe<Scalars['String']>;
  vitrectomy?: Maybe<Scalars['String']>;
  vitreousLoss?: Maybe<Scalars['Boolean']>;
  wbcActive?: Maybe<Scalars['Boolean']>;
  wbcDate?: Maybe<Scalars['Time']>;
  wbcResults?: Maybe<Scalars['String']>;
};

export type SurgicalProcedureConnection = Connection & {
  __typename?: 'SurgicalProcedureConnection';
  edges: Array<Maybe<SurgicalProcedureEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SurgicalProcedureEdge = {
  __typename?: 'SurgicalProcedureEdge';
  node: SurgicalProcedure;
};

export type SurgicalProcedureFilter = {
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type SurgicalProcedureInput = {
  abdomen?: InputMaybe<Scalars['String']>;
  aclol?: InputMaybe<Scalars['String']>;
  aclolPlanned?: InputMaybe<Scalars['Boolean']>;
  aclolUnplanned?: InputMaybe<Scalars['Boolean']>;
  additionalNotes?: InputMaybe<Scalars['String']>;
  adrenalin?: InputMaybe<Scalars['Boolean']>;
  air?: InputMaybe<Scalars['Boolean']>;
  allergies?: InputMaybe<Scalars['String']>;
  alpActive?: InputMaybe<Scalars['Boolean']>;
  alpDate?: InputMaybe<Scalars['Time']>;
  alpResults?: InputMaybe<Scalars['String']>;
  altsgptActive?: InputMaybe<Scalars['Boolean']>;
  altsgptDate?: InputMaybe<Scalars['Time']>;
  altsgptResults?: InputMaybe<Scalars['String']>;
  antibiotic?: InputMaybe<Scalars['Boolean']>;
  asa1?: InputMaybe<Scalars['Boolean']>;
  asa2?: InputMaybe<Scalars['Boolean']>;
  asa3?: InputMaybe<Scalars['Boolean']>;
  asa4?: InputMaybe<Scalars['Boolean']>;
  asa5?: InputMaybe<Scalars['Boolean']>;
  assistantName?: InputMaybe<Scalars['String']>;
  asthma?: InputMaybe<Scalars['String']>;
  astsgotActive?: InputMaybe<Scalars['Boolean']>;
  astsgotDate?: InputMaybe<Scalars['Time']>;
  astsgotResults?: InputMaybe<Scalars['String']>;
  atBreaks?: InputMaybe<Scalars['Boolean']>;
  bilirubinDirectActive?: InputMaybe<Scalars['Boolean']>;
  bilirubinDirectDate?: InputMaybe<Scalars['Time']>;
  bilirubinDirectResults?: InputMaybe<Scalars['String']>;
  bilirubinTotalActive?: InputMaybe<Scalars['Boolean']>;
  bilirubinTotalDate?: InputMaybe<Scalars['Time']>;
  bilirubinTotalResults?: InputMaybe<Scalars['String']>;
  bleedingTendancy?: InputMaybe<Scalars['Boolean']>;
  bleedingTendancyNote?: InputMaybe<Scalars['String']>;
  bloodPressure?: InputMaybe<Scalars['String']>;
  bloodSugar?: InputMaybe<Scalars['String']>;
  brilliantBlue?: InputMaybe<Scalars['Boolean']>;
  bss?: InputMaybe<Scalars['Boolean']>;
  capsulotomyCanOpener?: InputMaybe<Scalars['Boolean']>;
  capsulotomyCcc?: InputMaybe<Scalars['Boolean']>;
  capsulotomyLinear?: InputMaybe<Scalars['Boolean']>;
  cardiac?: InputMaybe<Scalars['Boolean']>;
  cardiacDisease?: InputMaybe<Scalars['String']>;
  cardiacNote?: InputMaybe<Scalars['String']>;
  cardiovascular?: InputMaybe<Scalars['String']>;
  cns?: InputMaybe<Scalars['String']>;
  coagulationInrActive?: InputMaybe<Scalars['Boolean']>;
  coagulationInrDate?: InputMaybe<Scalars['Time']>;
  coagulationInrResults?: InputMaybe<Scalars['String']>;
  coagulationPtActive?: InputMaybe<Scalars['Boolean']>;
  coagulationPtDate?: InputMaybe<Scalars['Time']>;
  coagulationPtResults?: InputMaybe<Scalars['String']>;
  coagulationPttActive?: InputMaybe<Scalars['Boolean']>;
  coagulationPttDate?: InputMaybe<Scalars['Time']>;
  coagulationPttResults?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  complicationChrodialEffusion?: InputMaybe<Scalars['Boolean']>;
  complicationIatrogenicBreaks?: InputMaybe<Scalars['Boolean']>;
  complicationIntraocilarHemorrhage?: InputMaybe<Scalars['Boolean']>;
  complicationLensTouch?: InputMaybe<Scalars['Boolean']>;
  complicationMacularFold?: InputMaybe<Scalars['Boolean']>;
  complicationPfcl?: InputMaybe<Scalars['Boolean']>;
  complicationRetinalDetachment?: InputMaybe<Scalars['Boolean']>;
  complicationSubretialOil?: InputMaybe<Scalars['Boolean']>;
  complicationSubretialPfcl?: InputMaybe<Scalars['Boolean']>;
  complicationSuprachorodialHemorrhage?: InputMaybe<Scalars['Boolean']>;
  complicationsNote?: InputMaybe<Scalars['String']>;
  complicationsOthers?: InputMaybe<Scalars['String']>;
  conjFlapFornix?: InputMaybe<Scalars['Boolean']>;
  conjFlapLimbal?: InputMaybe<Scalars['Boolean']>;
  cryopexyAtBreaks?: InputMaybe<Scalars['Boolean']>;
  descematesStrip?: InputMaybe<Scalars['Boolean']>;
  diabetes?: InputMaybe<Scalars['String']>;
  dm?: InputMaybe<Scalars['Boolean']>;
  dmNote?: InputMaybe<Scalars['String']>;
  drapes?: InputMaybe<Scalars['Boolean']>;
  electrolytesCa2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesCa2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesCa2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesClMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesClMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesClMinusResults?: InputMaybe<Scalars['String']>;
  electrolytesKPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesKPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesKPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesMg2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesMg2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesMg2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesNaPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesNaPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesNaPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesPMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesPMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesPMinusResults?: InputMaybe<Scalars['String']>;
  encirclingBand?: InputMaybe<Scalars['Boolean']>;
  endodiathermy?: InputMaybe<Scalars['Boolean']>;
  endolaser?: InputMaybe<Scalars['Boolean']>;
  endothelialDamage?: InputMaybe<Scalars['Boolean']>;
  fax?: InputMaybe<Scalars['Boolean']>;
  fitForSurgery?: InputMaybe<Scalars['Boolean']>;
  fitForSurgeryNote?: InputMaybe<Scalars['String']>;
  ga?: InputMaybe<Scalars['Boolean']>;
  gus?: InputMaybe<Scalars['String']>;
  healon?: InputMaybe<Scalars['Boolean']>;
  hgbhctActive?: InputMaybe<Scalars['Boolean']>;
  hgbhctDate?: InputMaybe<Scalars['Time']>;
  hgbhctResults?: InputMaybe<Scalars['String']>;
  hpmc?: InputMaybe<Scalars['Boolean']>;
  hpn?: InputMaybe<Scalars['String']>;
  hypertension?: InputMaybe<Scalars['Boolean']>;
  hypertensionNote?: InputMaybe<Scalars['String']>;
  hyphema?: InputMaybe<Scalars['Boolean']>;
  ilmp?: InputMaybe<Scalars['Boolean']>;
  interacameral?: InputMaybe<Scalars['String']>;
  iolBagSulcus?: InputMaybe<Scalars['Boolean']>;
  iolModel?: InputMaybe<Scalars['String']>;
  iolPlacementBag?: InputMaybe<Scalars['Boolean']>;
  iolSulcus?: InputMaybe<Scalars['Boolean']>;
  iridoDialysis?: InputMaybe<Scalars['Boolean']>;
  irisDamage?: InputMaybe<Scalars['Boolean']>;
  irodectpmyNone?: InputMaybe<Scalars['Boolean']>;
  irodectpmyPl?: InputMaybe<Scalars['Boolean']>;
  irodectpmySl?: InputMaybe<Scalars['Boolean']>;
  irrigatingSolution?: InputMaybe<Scalars['String']>;
  ismss?: InputMaybe<Scalars['String']>;
  la?: InputMaybe<Scalars['Boolean']>;
  leftAnteriorSegment?: InputMaybe<Scalars['String']>;
  leftBiometry?: InputMaybe<Scalars['String']>;
  leftCorrected?: InputMaybe<Scalars['String']>;
  leftIop?: InputMaybe<Scalars['String']>;
  leftPosteriorSegment?: InputMaybe<Scalars['String']>;
  lensExtractionEcce?: InputMaybe<Scalars['Boolean']>;
  lensExtractionIcce?: InputMaybe<Scalars['Boolean']>;
  lensExtractionPhaco?: InputMaybe<Scalars['Boolean']>;
  membraneDeliniation?: InputMaybe<Scalars['Boolean']>;
  membranePeeling?: InputMaybe<Scalars['Boolean']>;
  membraneSegmentation?: InputMaybe<Scalars['Boolean']>;
  nucluesDrop?: InputMaybe<Scalars['Boolean']>;
  nylon?: InputMaybe<Scalars['Boolean']>;
  opv1?: InputMaybe<Scalars['Boolean']>;
  opv2?: InputMaybe<Scalars['Boolean']>;
  opv3?: InputMaybe<Scalars['Boolean']>;
  opv4?: InputMaybe<Scalars['Boolean']>;
  patientChartId: Scalars['ID'];
  pcTear?: InputMaybe<Scalars['Boolean']>;
  performOnEye?: InputMaybe<Scalars['String']>;
  peribulbar?: InputMaybe<Scalars['Boolean']>;
  pfcl?: InputMaybe<Scalars['Boolean']>;
  physicalAbdomen?: InputMaybe<Scalars['String']>;
  physicalArtificalDenture?: InputMaybe<Scalars['Boolean']>;
  physicalArtificalDentureNote?: InputMaybe<Scalars['String']>;
  physicalBloodPressure?: InputMaybe<Scalars['String']>;
  physicalChest?: InputMaybe<Scalars['String']>;
  physicalCns?: InputMaybe<Scalars['String']>;
  physicalCvs?: InputMaybe<Scalars['String']>;
  physicalGus?: InputMaybe<Scalars['String']>;
  physicalHeent?: InputMaybe<Scalars['String']>;
  physicalIs?: InputMaybe<Scalars['String']>;
  physicalLgs?: InputMaybe<Scalars['String']>;
  physicalMss?: InputMaybe<Scalars['String']>;
  physicalPr?: InputMaybe<Scalars['String']>;
  physicalRr?: InputMaybe<Scalars['String']>;
  physicalSaO2?: InputMaybe<Scalars['String']>;
  physicalTemperature?: InputMaybe<Scalars['String']>;
  physicalWeight?: InputMaybe<Scalars['String']>;
  pilo?: InputMaybe<Scalars['Boolean']>;
  pltActive?: InputMaybe<Scalars['Boolean']>;
  pltDate?: InputMaybe<Scalars['Time']>;
  pltResults?: InputMaybe<Scalars['String']>;
  preanestheticAllergies?: InputMaybe<Scalars['Boolean']>;
  preanestheticAllergiesNote?: InputMaybe<Scalars['String']>;
  preanestheticAsthma?: InputMaybe<Scalars['Boolean']>;
  preanestheticAsthmaNote?: InputMaybe<Scalars['String']>;
  preanestheticDocuments?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  prp?: InputMaybe<Scalars['Boolean']>;
  renal?: InputMaybe<Scalars['Boolean']>;
  renalBunActive?: InputMaybe<Scalars['Boolean']>;
  renalBunDate?: InputMaybe<Scalars['Time']>;
  renalBunResults?: InputMaybe<Scalars['String']>;
  renalCrActive?: InputMaybe<Scalars['Boolean']>;
  renalCrDate?: InputMaybe<Scalars['Time']>;
  renalCrResults?: InputMaybe<Scalars['String']>;
  renalNote?: InputMaybe<Scalars['String']>;
  respiratory?: InputMaybe<Scalars['String']>;
  retainedCortex?: InputMaybe<Scalars['Boolean']>;
  retinectomy?: InputMaybe<Scalars['Boolean']>;
  retinotomy?: InputMaybe<Scalars['Boolean']>;
  retrobulbar?: InputMaybe<Scalars['Boolean']>;
  rightAnteriorSegment?: InputMaybe<Scalars['String']>;
  rightBiometry?: InputMaybe<Scalars['String']>;
  rightCorrected?: InputMaybe<Scalars['String']>;
  rightIop?: InputMaybe<Scalars['String']>;
  rightPosteriorSegment?: InputMaybe<Scalars['String']>;
  ringer?: InputMaybe<Scalars['Boolean']>;
  rvi?: InputMaybe<Scalars['Boolean']>;
  rviNote?: InputMaybe<Scalars['String']>;
  sclerotomyStitches?: InputMaybe<Scalars['Boolean']>;
  sectionCorneral?: InputMaybe<Scalars['Boolean']>;
  sectionLimbal?: InputMaybe<Scalars['Boolean']>;
  sectionScleralTunnel?: InputMaybe<Scalars['Boolean']>;
  serumAlbuminActive?: InputMaybe<Scalars['Boolean']>;
  serumAlbuminDate?: InputMaybe<Scalars['Time']>;
  serumAlbuminResults?: InputMaybe<Scalars['String']>;
  siliconOilExchange?: InputMaybe<Scalars['Boolean']>;
  siliconOilFiveThousandCsk?: InputMaybe<Scalars['Boolean']>;
  siliconOilInjection?: InputMaybe<Scalars['Boolean']>;
  siliconOilOneThousandCsk?: InputMaybe<Scalars['Boolean']>;
  siliconOilPfclExchange?: InputMaybe<Scalars['Boolean']>;
  silk?: InputMaybe<Scalars['Boolean']>;
  specialInstructions?: InputMaybe<Scalars['String']>;
  sphincterectomy?: InputMaybe<Scalars['Boolean']>;
  steroid?: InputMaybe<Scalars['Boolean']>;
  subconj?: InputMaybe<Scalars['String']>;
  subtenones?: InputMaybe<Scalars['Boolean']>;
  surgicalOrderId?: InputMaybe<Scalars['ID']>;
  suture?: InputMaybe<Scalars['String']>;
  suture80?: InputMaybe<Scalars['Boolean']>;
  suture90?: InputMaybe<Scalars['Boolean']>;
  suture100?: InputMaybe<Scalars['Boolean']>;
  sutureContinuous?: InputMaybe<Scalars['Boolean']>;
  sutureInterrupted?: InputMaybe<Scalars['Boolean']>;
  sutureNone?: InputMaybe<Scalars['Boolean']>;
  tca?: InputMaybe<Scalars['Boolean']>;
  threeSixyDegree?: InputMaybe<Scalars['Boolean']>;
  thyroidFreeT3Active?: InputMaybe<Scalars['Boolean']>;
  thyroidFreeT3Date?: InputMaybe<Scalars['Time']>;
  thyroidFreeT3Results?: InputMaybe<Scalars['String']>;
  thyroidTotalT4Active?: InputMaybe<Scalars['Boolean']>;
  thyroidTotalT4Date?: InputMaybe<Scalars['Time']>;
  thyroidTotalT4Results?: InputMaybe<Scalars['String']>;
  thyroidTshActive?: InputMaybe<Scalars['Boolean']>;
  thyroidTshDate?: InputMaybe<Scalars['Time']>;
  thyroidTshResults?: InputMaybe<Scalars['String']>;
  topical?: InputMaybe<Scalars['Boolean']>;
  totalProteinActive?: InputMaybe<Scalars['Boolean']>;
  totalProteinDate?: InputMaybe<Scalars['Time']>;
  totalProteinResults?: InputMaybe<Scalars['String']>;
  treatment?: InputMaybe<Scalars['String']>;
  twentyFiveG?: InputMaybe<Scalars['Boolean']>;
  twentyG?: InputMaybe<Scalars['Boolean']>;
  twentyThreeG?: InputMaybe<Scalars['Boolean']>;
  typeOfIol?: InputMaybe<Scalars['String']>;
  typeOfIolAc?: InputMaybe<Scalars['Boolean']>;
  typeOfIolPc?: InputMaybe<Scalars['Boolean']>;
  unplanned?: InputMaybe<Scalars['String']>;
  uriAnalysis?: InputMaybe<Scalars['String']>;
  visco?: InputMaybe<Scalars['String']>;
  vitrectomy?: InputMaybe<Scalars['String']>;
  vitreousLoss?: InputMaybe<Scalars['Boolean']>;
  wbcActive?: InputMaybe<Scalars['Boolean']>;
  wbcDate?: InputMaybe<Scalars['Time']>;
  wbcResults?: InputMaybe<Scalars['String']>;
};

export type SurgicalProcedureType = {
  __typename?: 'SurgicalProcedureType';
  active: Scalars['Boolean'];
  billings: Array<Maybe<Billing>>;
  id: Scalars['ID'];
  supplies: Array<Maybe<Supply>>;
  title: Scalars['String'];
};

export type SurgicalProcedureTypeConnection = Connection & {
  __typename?: 'SurgicalProcedureTypeConnection';
  edges: Array<Maybe<SurgicalProcedureTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SurgicalProcedureTypeEdge = {
  __typename?: 'SurgicalProcedureTypeEdge';
  node: SurgicalProcedureType;
};

export type SurgicalProcedureTypeInput = {
  active: Scalars['Boolean'];
  billingIds: Array<InputMaybe<Scalars['ID']>>;
  supplyIds: Array<InputMaybe<Scalars['ID']>>;
  title: Scalars['String'];
};

export type SurgicalProcedureTypeUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  billingIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  supplyIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  title?: InputMaybe<Scalars['String']>;
};

export type SurgicalProcedureUpdateInput = {
  abdomen?: InputMaybe<Scalars['String']>;
  aclol?: InputMaybe<Scalars['String']>;
  aclolPlanned?: InputMaybe<Scalars['Boolean']>;
  aclolUnplanned?: InputMaybe<Scalars['Boolean']>;
  additionalNotes?: InputMaybe<Scalars['String']>;
  adrenalin?: InputMaybe<Scalars['Boolean']>;
  air?: InputMaybe<Scalars['Boolean']>;
  allergies?: InputMaybe<Scalars['String']>;
  alpActive?: InputMaybe<Scalars['Boolean']>;
  alpDate?: InputMaybe<Scalars['Time']>;
  alpResults?: InputMaybe<Scalars['String']>;
  altsgptActive?: InputMaybe<Scalars['Boolean']>;
  altsgptDate?: InputMaybe<Scalars['Time']>;
  altsgptResults?: InputMaybe<Scalars['String']>;
  antibiotic?: InputMaybe<Scalars['Boolean']>;
  asa1?: InputMaybe<Scalars['Boolean']>;
  asa2?: InputMaybe<Scalars['Boolean']>;
  asa3?: InputMaybe<Scalars['Boolean']>;
  asa4?: InputMaybe<Scalars['Boolean']>;
  asa5?: InputMaybe<Scalars['Boolean']>;
  assistantName?: InputMaybe<Scalars['String']>;
  asthma?: InputMaybe<Scalars['String']>;
  astsgotActive?: InputMaybe<Scalars['Boolean']>;
  astsgotDate?: InputMaybe<Scalars['Time']>;
  astsgotResults?: InputMaybe<Scalars['String']>;
  atBreaks?: InputMaybe<Scalars['Boolean']>;
  bilirubinDirectActive?: InputMaybe<Scalars['Boolean']>;
  bilirubinDirectDate?: InputMaybe<Scalars['Time']>;
  bilirubinDirectResults?: InputMaybe<Scalars['String']>;
  bilirubinTotalActive?: InputMaybe<Scalars['Boolean']>;
  bilirubinTotalDate?: InputMaybe<Scalars['Time']>;
  bilirubinTotalResults?: InputMaybe<Scalars['String']>;
  bleedingTendancy?: InputMaybe<Scalars['Boolean']>;
  bleedingTendancyNote?: InputMaybe<Scalars['String']>;
  bloodPressure?: InputMaybe<Scalars['String']>;
  bloodSugar?: InputMaybe<Scalars['String']>;
  brilliantBlue?: InputMaybe<Scalars['Boolean']>;
  bss?: InputMaybe<Scalars['Boolean']>;
  capsulotomyCanOpener?: InputMaybe<Scalars['Boolean']>;
  capsulotomyCcc?: InputMaybe<Scalars['Boolean']>;
  capsulotomyLinear?: InputMaybe<Scalars['Boolean']>;
  cardiac?: InputMaybe<Scalars['Boolean']>;
  cardiacDisease?: InputMaybe<Scalars['String']>;
  cardiacNote?: InputMaybe<Scalars['String']>;
  cardiovascular?: InputMaybe<Scalars['String']>;
  cns?: InputMaybe<Scalars['String']>;
  coagulationInrActive?: InputMaybe<Scalars['Boolean']>;
  coagulationInrDate?: InputMaybe<Scalars['Time']>;
  coagulationInrResults?: InputMaybe<Scalars['String']>;
  coagulationPtActive?: InputMaybe<Scalars['Boolean']>;
  coagulationPtDate?: InputMaybe<Scalars['Time']>;
  coagulationPtResults?: InputMaybe<Scalars['String']>;
  coagulationPttActive?: InputMaybe<Scalars['Boolean']>;
  coagulationPttDate?: InputMaybe<Scalars['Time']>;
  coagulationPttResults?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  complicationChrodialEffusion?: InputMaybe<Scalars['Boolean']>;
  complicationIatrogenicBreaks?: InputMaybe<Scalars['Boolean']>;
  complicationIntraocilarHemorrhage?: InputMaybe<Scalars['Boolean']>;
  complicationLensTouch?: InputMaybe<Scalars['Boolean']>;
  complicationMacularFold?: InputMaybe<Scalars['Boolean']>;
  complicationPfcl?: InputMaybe<Scalars['Boolean']>;
  complicationRetinalDetachment?: InputMaybe<Scalars['Boolean']>;
  complicationSubretialOil?: InputMaybe<Scalars['Boolean']>;
  complicationSubretialPfcl?: InputMaybe<Scalars['Boolean']>;
  complicationSuprachorodialHemorrhage?: InputMaybe<Scalars['Boolean']>;
  complicationsNote?: InputMaybe<Scalars['String']>;
  complicationsOthers?: InputMaybe<Scalars['String']>;
  conjFlapFornix?: InputMaybe<Scalars['Boolean']>;
  conjFlapLimbal?: InputMaybe<Scalars['Boolean']>;
  cryopexyAtBreaks?: InputMaybe<Scalars['Boolean']>;
  descematesStrip?: InputMaybe<Scalars['Boolean']>;
  diabetes?: InputMaybe<Scalars['String']>;
  dm?: InputMaybe<Scalars['Boolean']>;
  dmNote?: InputMaybe<Scalars['String']>;
  drapes?: InputMaybe<Scalars['Boolean']>;
  electrolytesCa2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesCa2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesCa2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesClMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesClMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesClMinusResults?: InputMaybe<Scalars['String']>;
  electrolytesKPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesKPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesKPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesMg2PlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesMg2PlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesMg2PlusResults?: InputMaybe<Scalars['String']>;
  electrolytesNaPlusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesNaPlusDate?: InputMaybe<Scalars['Time']>;
  electrolytesNaPlusResults?: InputMaybe<Scalars['String']>;
  electrolytesPMinusActive?: InputMaybe<Scalars['Boolean']>;
  electrolytesPMinusDate?: InputMaybe<Scalars['Time']>;
  electrolytesPMinusResults?: InputMaybe<Scalars['String']>;
  encirclingBand?: InputMaybe<Scalars['Boolean']>;
  endodiathermy?: InputMaybe<Scalars['Boolean']>;
  endolaser?: InputMaybe<Scalars['Boolean']>;
  endothelialDamage?: InputMaybe<Scalars['Boolean']>;
  fax?: InputMaybe<Scalars['Boolean']>;
  fitForSurgery?: InputMaybe<Scalars['Boolean']>;
  fitForSurgeryNote?: InputMaybe<Scalars['String']>;
  ga?: InputMaybe<Scalars['Boolean']>;
  gus?: InputMaybe<Scalars['String']>;
  healon?: InputMaybe<Scalars['Boolean']>;
  hgbhctActive?: InputMaybe<Scalars['Boolean']>;
  hgbhctDate?: InputMaybe<Scalars['Time']>;
  hgbhctResults?: InputMaybe<Scalars['String']>;
  hpmc?: InputMaybe<Scalars['Boolean']>;
  hpn?: InputMaybe<Scalars['String']>;
  hypertension?: InputMaybe<Scalars['Boolean']>;
  hypertensionNote?: InputMaybe<Scalars['String']>;
  hyphema?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  ilmp?: InputMaybe<Scalars['Boolean']>;
  interacameral?: InputMaybe<Scalars['String']>;
  iolBagSulcus?: InputMaybe<Scalars['Boolean']>;
  iolModel?: InputMaybe<Scalars['String']>;
  iolPlacementBag?: InputMaybe<Scalars['Boolean']>;
  iolSulcus?: InputMaybe<Scalars['Boolean']>;
  iridoDialysis?: InputMaybe<Scalars['Boolean']>;
  irisDamage?: InputMaybe<Scalars['Boolean']>;
  irodectpmyNone?: InputMaybe<Scalars['Boolean']>;
  irodectpmyPl?: InputMaybe<Scalars['Boolean']>;
  irodectpmySl?: InputMaybe<Scalars['Boolean']>;
  irrigatingSolution?: InputMaybe<Scalars['String']>;
  ismss?: InputMaybe<Scalars['String']>;
  la?: InputMaybe<Scalars['Boolean']>;
  leftAnteriorSegment?: InputMaybe<Scalars['String']>;
  leftBiometry?: InputMaybe<Scalars['String']>;
  leftCorrected?: InputMaybe<Scalars['String']>;
  leftIop?: InputMaybe<Scalars['String']>;
  leftPosteriorSegment?: InputMaybe<Scalars['String']>;
  lensExtractionEcce?: InputMaybe<Scalars['Boolean']>;
  lensExtractionIcce?: InputMaybe<Scalars['Boolean']>;
  lensExtractionPhaco?: InputMaybe<Scalars['Boolean']>;
  membraneDeliniation?: InputMaybe<Scalars['Boolean']>;
  membranePeeling?: InputMaybe<Scalars['Boolean']>;
  membraneSegmentation?: InputMaybe<Scalars['Boolean']>;
  nucluesDrop?: InputMaybe<Scalars['Boolean']>;
  nylon?: InputMaybe<Scalars['Boolean']>;
  opv1?: InputMaybe<Scalars['Boolean']>;
  opv2?: InputMaybe<Scalars['Boolean']>;
  opv3?: InputMaybe<Scalars['Boolean']>;
  opv4?: InputMaybe<Scalars['Boolean']>;
  pcTear?: InputMaybe<Scalars['Boolean']>;
  performOnEye?: InputMaybe<Scalars['String']>;
  peribulbar?: InputMaybe<Scalars['Boolean']>;
  pfcl?: InputMaybe<Scalars['Boolean']>;
  physicalAbdomen?: InputMaybe<Scalars['String']>;
  physicalArtificalDenture?: InputMaybe<Scalars['Boolean']>;
  physicalArtificalDentureNote?: InputMaybe<Scalars['String']>;
  physicalBloodPressure?: InputMaybe<Scalars['String']>;
  physicalChest?: InputMaybe<Scalars['String']>;
  physicalCns?: InputMaybe<Scalars['String']>;
  physicalCvs?: InputMaybe<Scalars['String']>;
  physicalGus?: InputMaybe<Scalars['String']>;
  physicalHeent?: InputMaybe<Scalars['String']>;
  physicalIs?: InputMaybe<Scalars['String']>;
  physicalLgs?: InputMaybe<Scalars['String']>;
  physicalMss?: InputMaybe<Scalars['String']>;
  physicalPr?: InputMaybe<Scalars['String']>;
  physicalRr?: InputMaybe<Scalars['String']>;
  physicalSaO2?: InputMaybe<Scalars['String']>;
  physicalTemperature?: InputMaybe<Scalars['String']>;
  physicalWeight?: InputMaybe<Scalars['String']>;
  pilo?: InputMaybe<Scalars['Boolean']>;
  pltActive?: InputMaybe<Scalars['Boolean']>;
  pltDate?: InputMaybe<Scalars['Time']>;
  pltResults?: InputMaybe<Scalars['String']>;
  preanestheticAllergies?: InputMaybe<Scalars['Boolean']>;
  preanestheticAllergiesNote?: InputMaybe<Scalars['String']>;
  preanestheticAsthma?: InputMaybe<Scalars['Boolean']>;
  preanestheticAsthmaNote?: InputMaybe<Scalars['String']>;
  preanestheticDocuments?: InputMaybe<Array<InputMaybe<FileUpload>>>;
  prp?: InputMaybe<Scalars['Boolean']>;
  renal?: InputMaybe<Scalars['Boolean']>;
  renalBunActive?: InputMaybe<Scalars['Boolean']>;
  renalBunDate?: InputMaybe<Scalars['Time']>;
  renalBunResults?: InputMaybe<Scalars['String']>;
  renalCrActive?: InputMaybe<Scalars['Boolean']>;
  renalCrDate?: InputMaybe<Scalars['Time']>;
  renalCrResults?: InputMaybe<Scalars['String']>;
  renalNote?: InputMaybe<Scalars['String']>;
  respiratory?: InputMaybe<Scalars['String']>;
  retainedCortex?: InputMaybe<Scalars['Boolean']>;
  retinectomy?: InputMaybe<Scalars['Boolean']>;
  retinotomy?: InputMaybe<Scalars['Boolean']>;
  retrobulbar?: InputMaybe<Scalars['Boolean']>;
  rightAnteriorSegment?: InputMaybe<Scalars['String']>;
  rightBiometry?: InputMaybe<Scalars['String']>;
  rightCorrected?: InputMaybe<Scalars['String']>;
  rightIop?: InputMaybe<Scalars['String']>;
  rightPosteriorSegment?: InputMaybe<Scalars['String']>;
  ringer?: InputMaybe<Scalars['Boolean']>;
  rvi?: InputMaybe<Scalars['Boolean']>;
  rviNote?: InputMaybe<Scalars['String']>;
  sclerotomyStitches?: InputMaybe<Scalars['Boolean']>;
  sectionCorneral?: InputMaybe<Scalars['Boolean']>;
  sectionLimbal?: InputMaybe<Scalars['Boolean']>;
  sectionScleralTunnel?: InputMaybe<Scalars['Boolean']>;
  serumAlbuminActive?: InputMaybe<Scalars['Boolean']>;
  serumAlbuminDate?: InputMaybe<Scalars['Time']>;
  serumAlbuminResults?: InputMaybe<Scalars['String']>;
  siliconOilExchange?: InputMaybe<Scalars['Boolean']>;
  siliconOilFiveThousandCsk?: InputMaybe<Scalars['Boolean']>;
  siliconOilInjection?: InputMaybe<Scalars['Boolean']>;
  siliconOilOneThousandCsk?: InputMaybe<Scalars['Boolean']>;
  siliconOilPfclExchange?: InputMaybe<Scalars['Boolean']>;
  silk?: InputMaybe<Scalars['Boolean']>;
  specialInstructions?: InputMaybe<Scalars['String']>;
  sphincterectomy?: InputMaybe<Scalars['Boolean']>;
  steroid?: InputMaybe<Scalars['Boolean']>;
  subconj?: InputMaybe<Scalars['String']>;
  subtenones?: InputMaybe<Scalars['Boolean']>;
  suture?: InputMaybe<Scalars['String']>;
  suture80?: InputMaybe<Scalars['Boolean']>;
  suture90?: InputMaybe<Scalars['Boolean']>;
  suture100?: InputMaybe<Scalars['Boolean']>;
  sutureContinuous?: InputMaybe<Scalars['Boolean']>;
  sutureInterrupted?: InputMaybe<Scalars['Boolean']>;
  sutureNone?: InputMaybe<Scalars['Boolean']>;
  tca?: InputMaybe<Scalars['Boolean']>;
  threeSixyDegree?: InputMaybe<Scalars['Boolean']>;
  thyroidFreeT3Active?: InputMaybe<Scalars['Boolean']>;
  thyroidFreeT3Date?: InputMaybe<Scalars['Time']>;
  thyroidFreeT3Results?: InputMaybe<Scalars['String']>;
  thyroidTotalT4Active?: InputMaybe<Scalars['Boolean']>;
  thyroidTotalT4Date?: InputMaybe<Scalars['Time']>;
  thyroidTotalT4Results?: InputMaybe<Scalars['String']>;
  thyroidTshActive?: InputMaybe<Scalars['Boolean']>;
  thyroidTshDate?: InputMaybe<Scalars['Time']>;
  thyroidTshResults?: InputMaybe<Scalars['String']>;
  topical?: InputMaybe<Scalars['Boolean']>;
  totalProteinActive?: InputMaybe<Scalars['Boolean']>;
  totalProteinDate?: InputMaybe<Scalars['Time']>;
  totalProteinResults?: InputMaybe<Scalars['String']>;
  treatment?: InputMaybe<Scalars['String']>;
  twentyFiveG?: InputMaybe<Scalars['Boolean']>;
  twentyG?: InputMaybe<Scalars['Boolean']>;
  twentyThreeG?: InputMaybe<Scalars['Boolean']>;
  typeOfIol?: InputMaybe<Scalars['String']>;
  typeOfIolAc?: InputMaybe<Scalars['Boolean']>;
  typeOfIolPc?: InputMaybe<Scalars['Boolean']>;
  unplanned?: InputMaybe<Scalars['String']>;
  uriAnalysis?: InputMaybe<Scalars['String']>;
  visco?: InputMaybe<Scalars['String']>;
  vitrectomy?: InputMaybe<Scalars['String']>;
  vitreousLoss?: InputMaybe<Scalars['Boolean']>;
  wbcActive?: InputMaybe<Scalars['Boolean']>;
  wbcDate?: InputMaybe<Scalars['Time']>;
  wbcResults?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type System = {
  __typename?: 'System';
  active: Scalars['Boolean'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type SystemConnection = Connection & {
  __typename?: 'SystemConnection';
  edges: Array<SystemEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  node: System;
};

export type SystemInput = {
  title: Scalars['String'];
};

export type SystemSymptom = {
  __typename?: 'SystemSymptom';
  id: Scalars['ID'];
  system: System;
  systemId: Scalars['ID'];
  title: Scalars['String'];
};

export type SystemSymptomConnection = Connection & {
  __typename?: 'SystemSymptomConnection';
  edges: Array<SystemSymptomEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SystemSymptomEdge = {
  __typename?: 'SystemSymptomEdge';
  node: SystemSymptom;
};

export type SystemSymptomInput = {
  systemId: Scalars['ID'];
  title: Scalars['String'];
};

export type SystemSymptomUpdateInput = {
  id: Scalars['ID'];
  systemId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type SystemUpdateInput = {
  id: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type Todo = {
  __typename?: 'Todo';
  done: Scalars['Boolean'];
  id: Scalars['ID'];
  text: Scalars['String'];
};

export type Treatment = {
  __typename?: 'Treatment';
  generalText?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  leftEyeText?: Maybe<Scalars['String']>;
  note?: Maybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
  payments: Array<Payment>;
  receptionNote: Scalars['String'];
  result?: Maybe<Scalars['String']>;
  rightEyeText?: Maybe<Scalars['String']>;
  status: TreatmentStatus;
  treatmentOrderId: Scalars['ID'];
  treatmentType: TreatmentType;
  treatmentTypeId: Scalars['ID'];
  treatmentTypeTitle: Scalars['String'];
};

export type TreatmentConnection = Connection & {
  __typename?: 'TreatmentConnection';
  edges: Array<TreatmentEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TreatmentEdge = {
  __typename?: 'TreatmentEdge';
  node: Treatment;
};

export type TreatmentFilter = {
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type TreatmentInput = {
  generalText?: InputMaybe<Scalars['String']>;
  leftEyeText?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  patientChartId: Scalars['ID'];
  result?: InputMaybe<Scalars['String']>;
  rightEyeText?: InputMaybe<Scalars['String']>;
};

export type TreatmentOrder = {
  __typename?: 'TreatmentOrder';
  createdAt?: Maybe<Scalars['Time']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  orderedBy?: Maybe<User>;
  orderedById?: Maybe<Scalars['ID']>;
  patientChartId: Scalars['ID'];
  patientId: Scalars['ID'];
  phoneNo: Scalars['String'];
  status: TreatmentOrderStatus;
  treatments: Array<Treatment>;
  userName: Scalars['String'];
};

export type TreatmentOrderConnection = Connection & {
  __typename?: 'TreatmentOrderConnection';
  edges: Array<TreatmentOrderEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TreatmentOrderEdge = {
  __typename?: 'TreatmentOrderEdge';
  node: TreatmentOrder;
};

export type TreatmentOrderFilter = {
  orderedById?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
  patientId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export enum TreatmentOrderStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export enum TreatmentStatus {
  Completed = 'COMPLETED',
  Ordered = 'ORDERED'
}

export type TreatmentType = {
  __typename?: 'TreatmentType';
  active: Scalars['Boolean'];
  billings: Array<Maybe<Billing>>;
  id: Scalars['ID'];
  supplies: Array<Maybe<Supply>>;
  title: Scalars['String'];
};

export type TreatmentTypeConnection = Connection & {
  __typename?: 'TreatmentTypeConnection';
  edges: Array<Maybe<TreatmentTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TreatmentTypeEdge = {
  __typename?: 'TreatmentTypeEdge';
  node: TreatmentType;
};

export type TreatmentTypeInput = {
  active: Scalars['Boolean'];
  billingIds: Array<InputMaybe<Scalars['ID']>>;
  supplyIds: Array<InputMaybe<Scalars['ID']>>;
  title: Scalars['String'];
};

export type TreatmentTypeUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  billingIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  id: Scalars['ID'];
  supplyIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  title?: InputMaybe<Scalars['String']>;
};

export type TreatmentUpdateInput = {
  generalText?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  leftEyeText?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  result?: InputMaybe<Scalars['String']>;
  rightEyeText?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  active: Scalars['Boolean'];
  confirmed?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['Time']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  locked?: Maybe<Scalars['Time']>;
  profilePic?: Maybe<File>;
  signature?: Maybe<File>;
  userTypes: Array<Maybe<UserType>>;
};

export type UserConnection = Connection & {
  __typename?: 'UserConnection';
  edges: Array<Maybe<UserEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  node: User;
};

export type UserFilter = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  lastName: Scalars['String'];
};

export type UserInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  profilePic?: InputMaybe<FileUpload>;
  signature?: InputMaybe<FileUpload>;
  userTypeIds: Array<InputMaybe<Scalars['ID']>>;
};

export type UserSearchInput = {
  searchTerm?: InputMaybe<Scalars['String']>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type UserType = {
  __typename?: 'UserType';
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type UserTypeConnection = Connection & {
  __typename?: 'UserTypeConnection';
  edges: Array<Maybe<UserTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type UserTypeEdge = {
  __typename?: 'UserTypeEdge';
  node: UserType;
};

export type UserTypeInput = {
  title: Scalars['String'];
};

export type UserTypeUpdateInput = {
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type UserUpdateInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  profilePic?: InputMaybe<FileUpload>;
  signature?: InputMaybe<FileUpload>;
  userTypeIds: Array<InputMaybe<Scalars['ID']>>;
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type VisitType = {
  __typename?: 'VisitType';
  id: Scalars['Int'];
  title: Scalars['String'];
};

export type VisitTypeConnection = Connection & {
  __typename?: 'VisitTypeConnection';
  edges: Array<Maybe<VisitTypeEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type VisitTypeEdge = {
  __typename?: 'VisitTypeEdge';
  node: VisitType;
};

export type VisitTypeInput = {
  title?: InputMaybe<Scalars['String']>;
};

export type VisitTypeOrder = {
  direction: OrderDirection;
  field: Scalars['String'];
};

/**
 * Copyright 2021 Kidus Tiliksew
 *
 * This file is part of Tensor EMR.
 *
 * Tensor EMR is free software: you can redistribute it and/or modify
 * it under the terms of the version 2 of GNU General Public License as published by
 * the Free Software Foundation.
 *
 * Tensor EMR is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export type VitalSigns = {
  __typename?: 'VitalSigns';
  bloodPressureDiastolic?: Maybe<Scalars['Float']>;
  bloodPressureSystolic?: Maybe<Scalars['Float']>;
  bmi?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  leftApplanation?: Maybe<Scalars['String']>;
  leftDigital?: Maybe<Scalars['String']>;
  leftDistanceAxis?: Maybe<Scalars['String']>;
  leftDistanceCorrected?: Maybe<Scalars['String']>;
  leftDistanceCyl?: Maybe<Scalars['String']>;
  leftDistancePinhole?: Maybe<Scalars['String']>;
  leftDistanceSph?: Maybe<Scalars['String']>;
  leftDistanceUncorrected?: Maybe<Scalars['String']>;
  leftLensMeterAxis?: Maybe<Scalars['String']>;
  leftLensMeterCyl?: Maybe<Scalars['String']>;
  leftLensMeterSph?: Maybe<Scalars['String']>;
  leftNearAxis?: Maybe<Scalars['String']>;
  leftNearCorrected?: Maybe<Scalars['String']>;
  leftNearCyl?: Maybe<Scalars['String']>;
  leftNearPinhole?: Maybe<Scalars['String']>;
  leftNearSph?: Maybe<Scalars['String']>;
  leftNearUncorrected?: Maybe<Scalars['String']>;
  leftNoncontact?: Maybe<Scalars['String']>;
  leftTonopen?: Maybe<Scalars['String']>;
  oxygenSaturation?: Maybe<Scalars['Float']>;
  patientChartId: Scalars['ID'];
  pulse?: Maybe<Scalars['Float']>;
  respiratoryRate?: Maybe<Scalars['Float']>;
  rightApplanation?: Maybe<Scalars['String']>;
  rightDigital?: Maybe<Scalars['String']>;
  rightDistanceAxis?: Maybe<Scalars['String']>;
  rightDistanceCorrected?: Maybe<Scalars['String']>;
  rightDistanceCyl?: Maybe<Scalars['String']>;
  rightDistancePinhole?: Maybe<Scalars['String']>;
  rightDistanceSph?: Maybe<Scalars['String']>;
  rightDistanceUncorrected?: Maybe<Scalars['String']>;
  rightLensMeterAxis?: Maybe<Scalars['String']>;
  rightLensMeterCyl?: Maybe<Scalars['String']>;
  rightLensMeterSph?: Maybe<Scalars['String']>;
  rightNearAxis?: Maybe<Scalars['String']>;
  rightNearCorrected?: Maybe<Scalars['String']>;
  rightNearCyl?: Maybe<Scalars['String']>;
  rightNearPinhole?: Maybe<Scalars['String']>;
  rightNearSph?: Maybe<Scalars['String']>;
  rightNearUncorrected?: Maybe<Scalars['String']>;
  rightNoncontact?: Maybe<Scalars['String']>;
  rightTonopen?: Maybe<Scalars['String']>;
  temperature?: Maybe<Scalars['Float']>;
  weight?: Maybe<Scalars['Float']>;
};

export type VitalSignsFilter = {
  id?: InputMaybe<Scalars['ID']>;
  patientChartId?: InputMaybe<Scalars['ID']>;
};

export type VitalSignsInput = {
  bloodPressureDiastolic?: InputMaybe<Scalars['Float']>;
  bloodPressureSystolic?: InputMaybe<Scalars['Float']>;
  bmi?: InputMaybe<Scalars['Float']>;
  height?: InputMaybe<Scalars['Float']>;
  leftApplanation?: InputMaybe<Scalars['String']>;
  leftDigital?: InputMaybe<Scalars['String']>;
  leftDistanceAxis?: InputMaybe<Scalars['String']>;
  leftDistanceCorrected?: InputMaybe<Scalars['String']>;
  leftDistanceCyl?: InputMaybe<Scalars['String']>;
  leftDistancePinhole?: InputMaybe<Scalars['String']>;
  leftDistanceSph?: InputMaybe<Scalars['String']>;
  leftDistanceUncorrected?: InputMaybe<Scalars['String']>;
  leftLensMeterAxis?: InputMaybe<Scalars['String']>;
  leftLensMeterCyl?: InputMaybe<Scalars['String']>;
  leftLensMeterSph?: InputMaybe<Scalars['String']>;
  leftNearAxis?: InputMaybe<Scalars['String']>;
  leftNearCorrected?: InputMaybe<Scalars['String']>;
  leftNearCyl?: InputMaybe<Scalars['String']>;
  leftNearPinhole?: InputMaybe<Scalars['String']>;
  leftNearSph?: InputMaybe<Scalars['String']>;
  leftNearUncorrected?: InputMaybe<Scalars['String']>;
  leftNoncontact?: InputMaybe<Scalars['String']>;
  leftTonopen?: InputMaybe<Scalars['String']>;
  oxygenSaturation?: InputMaybe<Scalars['Float']>;
  patientChartId: Scalars['ID'];
  pulse?: InputMaybe<Scalars['Float']>;
  respiratoryRate?: InputMaybe<Scalars['Float']>;
  rightApplanation?: InputMaybe<Scalars['String']>;
  rightDigital?: InputMaybe<Scalars['String']>;
  rightDistanceAxis?: InputMaybe<Scalars['String']>;
  rightDistanceCorrected?: InputMaybe<Scalars['String']>;
  rightDistanceCyl?: InputMaybe<Scalars['String']>;
  rightDistancePinhole?: InputMaybe<Scalars['String']>;
  rightDistanceSph?: InputMaybe<Scalars['String']>;
  rightDistanceUncorrected?: InputMaybe<Scalars['String']>;
  rightLensMeterAxis?: InputMaybe<Scalars['String']>;
  rightLensMeterCyl?: InputMaybe<Scalars['String']>;
  rightLensMeterSph?: InputMaybe<Scalars['String']>;
  rightNearAxis?: InputMaybe<Scalars['String']>;
  rightNearCorrected?: InputMaybe<Scalars['String']>;
  rightNearCyl?: InputMaybe<Scalars['String']>;
  rightNearPinhole?: InputMaybe<Scalars['String']>;
  rightNearSph?: InputMaybe<Scalars['String']>;
  rightNearUncorrected?: InputMaybe<Scalars['String']>;
  rightNoncontact?: InputMaybe<Scalars['String']>;
  rightTonopen?: InputMaybe<Scalars['String']>;
  temperature?: InputMaybe<Scalars['Float']>;
  weight?: InputMaybe<Scalars['Float']>;
};

export type VitalSignsProgress = {
  __typename?: 'VitalSignsProgress';
  appointments: Array<Maybe<Appointment>>;
};

export type VitalSignsUpdateInput = {
  bloodPressureDiastolic?: InputMaybe<Scalars['Float']>;
  bloodPressureSystolic?: InputMaybe<Scalars['Float']>;
  bmi?: InputMaybe<Scalars['Float']>;
  height?: InputMaybe<Scalars['Float']>;
  id: Scalars['ID'];
  leftApplanation?: InputMaybe<Scalars['String']>;
  leftDigital?: InputMaybe<Scalars['String']>;
  leftDistanceAxis?: InputMaybe<Scalars['String']>;
  leftDistanceCorrected?: InputMaybe<Scalars['String']>;
  leftDistanceCyl?: InputMaybe<Scalars['String']>;
  leftDistancePinhole?: InputMaybe<Scalars['String']>;
  leftDistanceSph?: InputMaybe<Scalars['String']>;
  leftDistanceUncorrected?: InputMaybe<Scalars['String']>;
  leftLensMeterAxis?: InputMaybe<Scalars['String']>;
  leftLensMeterCyl?: InputMaybe<Scalars['String']>;
  leftLensMeterSph?: InputMaybe<Scalars['String']>;
  leftNearAxis?: InputMaybe<Scalars['String']>;
  leftNearCorrected?: InputMaybe<Scalars['String']>;
  leftNearCyl?: InputMaybe<Scalars['String']>;
  leftNearPinhole?: InputMaybe<Scalars['String']>;
  leftNearSph?: InputMaybe<Scalars['String']>;
  leftNearUncorrected?: InputMaybe<Scalars['String']>;
  leftNoncontact?: InputMaybe<Scalars['String']>;
  leftTonopen?: InputMaybe<Scalars['String']>;
  oxygenSaturation?: InputMaybe<Scalars['Float']>;
  pulse?: InputMaybe<Scalars['Float']>;
  respiratoryRate?: InputMaybe<Scalars['Float']>;
  rightApplanation?: InputMaybe<Scalars['String']>;
  rightDigital?: InputMaybe<Scalars['String']>;
  rightDistanceAxis?: InputMaybe<Scalars['String']>;
  rightDistanceCorrected?: InputMaybe<Scalars['String']>;
  rightDistanceCyl?: InputMaybe<Scalars['String']>;
  rightDistancePinhole?: InputMaybe<Scalars['String']>;
  rightDistanceSph?: InputMaybe<Scalars['String']>;
  rightDistanceUncorrected?: InputMaybe<Scalars['String']>;
  rightLensMeterAxis?: InputMaybe<Scalars['String']>;
  rightLensMeterCyl?: InputMaybe<Scalars['String']>;
  rightLensMeterSph?: InputMaybe<Scalars['String']>;
  rightNearAxis?: InputMaybe<Scalars['String']>;
  rightNearCorrected?: InputMaybe<Scalars['String']>;
  rightNearCyl?: InputMaybe<Scalars['String']>;
  rightNearPinhole?: InputMaybe<Scalars['String']>;
  rightNearSph?: InputMaybe<Scalars['String']>;
  rightNearUncorrected?: InputMaybe<Scalars['String']>;
  rightNoncontact?: InputMaybe<Scalars['String']>;
  rightTonopen?: InputMaybe<Scalars['String']>;
  temperature?: InputMaybe<Scalars['Float']>;
  weight?: InputMaybe<Scalars['Float']>;
};
