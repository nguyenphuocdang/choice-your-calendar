export class ResourceDetail {
  id!: number;
  code!: string;
  name!: string;
  location!: string;
  description!: string;
  imagePath!: string;
  deviceType!: string;
  enable!: true;
  deviceDefaultFlag?: false;
  approverFullName!: string;
  approverEmail?: string;
  approverName?: string;
}

export class ResourceBasicInfo {
  label!: string;
  value!: string;
}

export class SearchDevice {
  approverFullName!: string;
  code!: string;
  description!: string;
  location!: string;
  name!: string;
}

export class DeviceOfEvent {
  id!: number;
  status!: string;
  code!: string;
  deviceType!: string;
  location!: string;
  name!: string;
  constructor() {
    this.id = 0;
    this.status = '';
    this.code = '';
    this.location = '';
    this.name = '';
  }
}
