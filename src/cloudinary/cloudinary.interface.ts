export interface CloudinaryResponse {
  readonly public_id: string;
  version: number;
  signature: string;
  secure_url: string;
  url: string;
  bytes: number;
  format: string;
  resource_type: string;
}
