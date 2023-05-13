export class socketRequest {
  content!: string;
  messageFrom!: string;
  messageFromEmail!: string;
  messageTo!: string;
  messageType!: string;
}

export class SearchResourceRequestBody {
  approverFullName!: string;
  code!: string;
  description!: string;
  location!: string;
  name?: string;
}
