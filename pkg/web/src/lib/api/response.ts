//Auth
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// User
interface UserProfileResponse {
  email: string;
  username: string;
}

// Tags
interface TagListItem {
  tagId: string;
  tagName: string;
  tagType: string;
  postCount: number;
}

interface TagGetResponse {
  tagId: string;
  tagName: string;
  tagType: string;
  tagNote: string;
  tagCount: number;
}

interface TagTypeListItem {
  id: number;
  name: string;
}

// Posts
interface PostListResponse {
  currentPage: number;
  totalPage: number;
  postCount: number;
  posts: PostListItem[];
  tags: TagListItem[];
}

interface PostListItem {
  id: string;
  image_path: string;
  thumbnail_path: string;
}

interface PostGetResponse {
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

interface PostCountResponse {
  postCount: number;
}

interface PostCreateResponse {
  id: string;
  image_path: string;
}

// Blobs
interface BlobUploadResponse {
  id: string;
  width: number;
  height: number;
  previewUrl: string;
}

interface BlobSimilarListResponse {
  similar: BlobSimilarListItem[];
}

interface BlobSimilarListItem {
  id: string;
  image_path: string;
  thumbnail_path: string;
  distance: number;
}
