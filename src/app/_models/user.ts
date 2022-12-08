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