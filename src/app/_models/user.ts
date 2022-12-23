

export interface UserLoginResponse{
    status: string;
    data: [];
}

export class User{
    username!: string;
    accessToken!: string;
}

export class UserProfile{
    id!: 6;
    fullname!: string;
    email!: string;
    address!: string;
    description!: string;
    active!: true;
    imagePath!: string;
    effectiveDate!: string;
    expiredDate!: string;
    pathMapping!: string;
    autoApprovalEventFlag!: true
}

export class AccountRegister
{
    address!: string;
    description!: string;
    email!: string;
    fullname!: string;
    password!: string;
    username!: string;
    gender!: boolean;
}

export class AccountVerify
{
  registerAccountId!: number;
  verifyCode!: string;
}

export class AccountDetail
{
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
   endDate!:string;
}