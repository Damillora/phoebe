//Auth
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
// Error
export interface ErrorResponse {
  code: number;
  message: string;
}

// User
export interface UserProfileResponse {
  email: string;
  username: string;
}

// Tags
export interface TagListItem {
  tagId: string;
  tagName: string;
  tagType: string;
  postCount: number;
}

export interface TagGetResponse {
  tagId: string;
  tagName: string;
  tagType: string;
  tagNote: string;
  postCount: number;
}

export interface TagTypeListItem {
  id: number;
  name: string;
}

// Posts
export interface PostListResponse {
  currentPage: number;
  totalPage: number;
  postCount: number;
  posts: PostListItem[];
  tags: TagListItem[];
}

export interface PostListItem {
  id: string;
  image_path: string;
  thumbnail_path: string;
}

export interface PostGetResponse {
  id: string;
  preview_path: string;
  image_path: string;
  source_url: string;
  tags: TagListItem[];
  width: number;
  height: number;
  uploader: string;
  upload_date: string;
}

export interface PostCountResponse {
  postCount: number;
}

export interface PostCreateResponse {
  id: string;
  image_path: string;
}

// Blobs
export interface BlobUploadResponse {
  id: string;
  width: number;
  height: number;
  previewUrl: string;
}

export interface BlobSimilarListResponse {
  similar: BlobSimilarListItem[];
}

export interface BlobSimilarListItem {
  id: string;
  image_path: string;
  thumbnail_path: string;
  distance: number;
}
