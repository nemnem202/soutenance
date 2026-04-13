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
  Ok,
  NotFound,
}
export type ErrorServerResponse = {
  success: false;
  title: string;
  description?: string;
  status: Status;
};
export type SuccessServerResponse<T> = {
  success: true;
  status: Status;
  data: T;
};

export type ServerResponse<T> = SuccessServerResponse<T> | ErrorServerResponse;
