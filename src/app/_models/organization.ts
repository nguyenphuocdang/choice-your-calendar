export class OrganizationDetails {
  id!: number;
  code!: string;
  name!: string;
  description!: string;
  organizationType!: string;
  numberUsers?: number;
}
export class AssignedPermission {
  createEventFlag!: boolean;
  createPublicEventFlag!: boolean;
  grantedUserId!: number;
  managerFlag!: boolean;
}
