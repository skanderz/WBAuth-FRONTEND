
export interface Response{

  isAuthSuccessful: boolean;
  errorMessage: string;
  token: string;
  is2StepVerificationRequired: boolean;
  provider: string;
  payload: any;
  username: string;
}
