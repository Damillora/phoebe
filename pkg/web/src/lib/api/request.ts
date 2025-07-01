// Auth
interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

// User
interface UserProfileUpdateRequest {
  email: string;
  username: string;
}
interface UserPasswordUpdateRequest {
  old_password: string;
  new_password: string;
}
// Tags
interface TagSearchRequest {
  q: string;
  tagtype: string;
  page: number;
  perPage: number;
}

interface TagGetRequest {
  tag: string;
}

interface TagAutocompleteRequest {
  tag: string;
  positive?: boolean;
}

interface TagUpdateRequest {
  id: string;
  name: string;
  tagTypeId: number;
}

interface TagNoteUpdateRequest {
  id: string;
  note: string;
}

// Posts
interface PostListRequest {
  page: number;
  q?: string;
  perPage?: number;
}
interface PostGetRequest {
  id: string;
}

interface PostCreateRequest {
  blob_id: string;
  source_url: string;
  tags: string[];
}

interface PostUpdateRequest {
  id: string;
  source_url: string;
  tags: string[];
}

interface PostDeleteRequest {
  id: string;
}

// Blobs
interface BlobUploadRequest {
  file: File;
}
