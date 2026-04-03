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
  LogoutSuccessfull,
  RemoveAccountSuccessfull,
  NotConnected,
  ImageUploadFail,
}
export type ErrorServerResponse = {
  success: false;
  title: string;
  description?: string;
  status: Status;
};
export type SuccessServerResponse = { success: true; status: Status };

export type ServerResponse = SuccessServerResponse | ErrorServerResponse;
