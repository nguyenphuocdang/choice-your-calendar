export interface UserLoginResponse {
  status: string;
  data: [];
}

export class User {
  username!: string;
  accessToken!: string;
}

export class UserProfile {
  id!: number;
  fullname!: string;
  email!: string;
  address!: string;
  description!: string;
  active!: true;
  imagePath!: string;
  effectiveDate!: string;
  expiredDate!: string;
  pathMapping!: string;
  autoApprovalEventFlag!: true;
}

export class AccountRegister {
  accountType!: string;
  address!: string;
  authorizationCode!: string;
  description!: string;
  error!: string;
  fullname!: string;
  gender!: boolean;
  password!: string;
  redirecetUri!: string;
  username!: string;
}

export class AccountVerify {
  registerAccountId!: number;
  verifyCode!: string;
}

export class AccountDetail {
  id!: number;
  username!: string;
  email!: string;
  address!: string;
  fullname!: string;
  description!: string;
  verifyFlag!: boolean;
  gender!: boolean;
  imagePath!: string;
  startDate!: string;
  endDate!: string;
}

export class UserBusinessDetail {
  id!: number;
  fullname!: string;
  email!: string;
  address!: string;
  imagePath!: string;
  effectiveDate!: any;
  managerFlag!: boolean;
  eventHosterFlag!: boolean;
  hostFlag!: boolean;
  createPublicEventFlag!: boolean;
  selected?: boolean;
}
