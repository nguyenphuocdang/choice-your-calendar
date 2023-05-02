export class socketRequest {
  content!: string;
  messageFrom!: string;
  messageFromEmail!: string;
  messageTo!: 0;
  messageType!: string;
}

export class SearchResourceRequestBody {
  approverFullName!: string;
  code!: string;
  description!: string;
  location!: string;
  name?: string;
}
