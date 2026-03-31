export enum Status {
  Logged,
  Registered,
  BadAuthMethod,
  IncorrectEmail,
  IncorrectPassword,
  UnknownError,
  ExistingUsername,
  ExistingEmail,
  IncorrectRegisterData,
  IncorrectLoginData,
  RefusedTermsOfService,
}

export type ServerResponse =
  | { success: true; status: Status }
  | { success: false; title: string; description?: string; status: Status };
