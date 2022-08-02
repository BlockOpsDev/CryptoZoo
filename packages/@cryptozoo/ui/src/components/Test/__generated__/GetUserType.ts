/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserType
// ====================================================

export interface GetUserType_user {
  __typename: "User";
  id: string | null;
  name: string | null;
}

export interface GetUserType {
  user: GetUserType_user | null;
}

export interface GetUserTypeVariables {
  id: string;
}
