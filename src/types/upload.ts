export interface UploadResult {
  id: string;
  url: string;
  thumbnail?: string;
  medium?: string;
  large?: string;
}

export interface UploadOptions {
  resourceType?: "dish" | "avatar" | "banner" | "chat" | "profile";
  entityId?: string;
}
