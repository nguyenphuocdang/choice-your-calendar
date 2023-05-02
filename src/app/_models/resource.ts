export class ResourceDetail {
  id!: number;
  code!: string;
  name!: string;
  location!: string;
  description!: string;
  imagePath!: string;
  deviceType!: string;
  enable!: true;
  deviceDefaultFlag!: false;
  approverFullName!: string;
}

export class ResourceBasicInfo {
  label!: string;
  value!: string;
}
