// Auth
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// User
export interface UserProfileUpdateRequest {
  email: string;
  username: string;
}
export interface UserPasswordUpdateRequest {
  old_password: string;
  new_password: string;
}
// Tags
export interface TagSearchRequest {
  q: string;
  tagtype: string;
  page: number;
  perPage: number;
}

export interface TagGetRequest {
  tag: string;
}

export interface TagAutocompleteRequest {
  tag: string;
  positive?: boolean;
}

export interface TagUpdateRequest {
  id: string;
  name: string;
  tagTypeId: number;
}

export interface TagNoteUpdateRequest {
  id: string;
  note: string;
}

// Posts
export interface PostListRequest {
  page: number;
  q?: string;
  perPage?: number;
}
export interface PostGetRequest {
  id: string;
}

export interface PostCreateRequest {
  blob_id: string;
  source_url: string;
  tags: string[];
}

export interface PostUpdateRequest {
  id: string;
  source_url: string;
  tags: string[];
}

export interface PostDeleteRequest {
  id: string;
}

// Blobs
export interface BlobUploadRequest {
  file: File;
}
