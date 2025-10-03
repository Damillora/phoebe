import { access_token, refresh_token } from "$lib/stores";
import { get } from "svelte/store";
import type {
  BlobSimilarListResponse,
  BlobUploadResponse,
  ErrorResponse,
  PostCountResponse,
  PostCreateResponse,
  PostGetResponse,
  PostListResponse,
  TagGetResponse,
  TagListItem,
  TagTypeListItem,
  TokenResponse,
  UserProfileResponse,
} from "./response";
import type {
  BlobUploadRequest,
  LoginRequest,
  PostCreateRequest,
  PostDeleteRequest,
  PostGetRequest,
  PostListRequest,
  PostUpdateRequest,
  RegisterRequest,
  TagAutocompleteRequest,
  TagGetRequest,
  TagNoteUpdateRequest,
  TagSearchRequest,
  TagUpdateRequest,
  UserPasswordUpdateRequest,
  UserProfileUpdateRequest,
} from "./request";

export async function getPostCount() {
  const response = await fetch("/api/post-count");
  const data: PostCountResponse = await response.json();
  return data;
}

// Auth
export async function login({ username, password }: LoginRequest) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (response.status !== 200) {
    let error: ErrorResponse = await response.json();
    throw {
      code: error.code,
      message: error.message,
    };
  }
  const data: TokenResponse = await response.json();
  access_token.set(data.accessToken);
  refresh_token.set(data.refreshToken);

  return data;
}

export async function register({ email, username, password }: RegisterRequest) {
  const response = await fetch("/api/user/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      username,
      password,
    }),
  });
  if (response.status !== 200) {
    let error: ErrorResponse = await response.json();
    throw {
      code: error.code,
      message: error.message,
    };
  }
  const data: UserProfileResponse = await response.json();
  return data;
}
export async function updateToken() {
  const current_access = get(access_token);
  let current_refresh = get(refresh_token);
  const endpoint = "/api/auth/token";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: JSON.stringify({
      refreshToken: current_refresh,
    }),
  });
  const data: TokenResponse = await response.json();
  access_token.set(data.accessToken);
  refresh_token.set(data.refreshToken);
  return data;
}

// User
export async function getUserProfile() {
  const current_access = get(access_token);
  const endpoint = "/api/user/profile";
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + current_access,
    },
  });
  const data: UserProfileResponse = await response.json();
  return data;
}

export async function updateUserProfile({
  email,
  username,
}: UserProfileUpdateRequest) {
  const current_access = get(access_token);
  const endpoint = "/api/user/update";
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: JSON.stringify({
      email,
      username,
    }),
  });
  const data = await response.json();
  return data;
}
export async function updateUserPassword({
  old_password,
  new_password,
}: UserPasswordUpdateRequest) {
  const current_access = get(access_token);
  const endpoint = "/api/user/update-password";
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: JSON.stringify({
      old_password,
      new_password,
    }),
  });
  const data = await response.json();
  return data;
}

// Blobs
export async function searchBlob({ file }: BlobUploadRequest) {
  const current_access = get(access_token);
  var formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/blob/search", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: formData,
  });
  const data: BlobSimilarListResponse = await response.json();
  return data;
}

export async function uploadBlob({ file }: BlobUploadRequest) {
  const current_access = get(access_token);
  var formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/blob/upload", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: formData,
  });
  const data: BlobUploadResponse = await response.json();
  return data;
}

// Posts
export async function postCreate({
  blob_id,
  source_url,
  tags,
}: PostCreateRequest) {
  const current_access = get(access_token);
  const response = await fetch("/api/post/create", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: JSON.stringify({
      blob_id,
      source_url,
      tags,
    }),
  });
  const data: PostCreateResponse = await response.json();
  return data;
}

export async function getPosts({ page, q, perPage }: PostListRequest) {
  if (!perPage) {
    perPage = 20;
  }
  let endpoint = "/api/post?page=" + page + "&perPage=" + perPage;
  if (q) {
    endpoint = "/api/post?tags=" + q + "&page=" + page + "&perPage=" + perPage;
  }
  const response = await fetch(endpoint);
  const data: PostListResponse = await response.json();
  return data;
}

export async function postUpdate({ id, source_url, tags }: PostUpdateRequest) {
  const current_access = get(access_token);
  const endpoint = "/api/post/" + id;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: JSON.stringify({
      source_url,
      tags,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getPost({ id }: PostGetRequest) {
  const endpoint = "/api/post/" + id;
  const response = await fetch(endpoint);
  const data: PostGetResponse = await response.json();
  return data;
}

export async function postDelete({ id }: PostDeleteRequest) {
  const current_access = get(access_token);
  const endpoint = "/api/post/" + id;
  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + current_access,
    },
  });
  return response.status == 200;
}

// Tags
export async function getTags() {
  const endpoint = "/api/tag";
  const response = await fetch(endpoint);
  const data: Array<TagListItem> = await response.json();
  return data;
}
export async function getTag({ tag }: TagGetRequest) {
  const endpoint = "/api/tag/" + tag;
  const response = await fetch(endpoint);
  const data: TagGetResponse = await response.json();
  return data;
}

export async function getRelatedTags({ tag }: TagGetRequest) {
  const endpoint = "/api/tag-related/" + tag;
  const response = await fetch(endpoint);
  const data: Array<TagListItem> = await response.json();
  return data;
}

export async function getTagAutocomplete({
  tag,
  positive,
}: TagAutocompleteRequest) {
  let endpoint = "/api/tag-autocomplete?tag=" + tag;
  if (positive) {
    endpoint = endpoint + "&positive=true";
  }
  const response = await fetch(endpoint);
  const data: Array<string> = await response.json();
  return data;
}

export async function searchTags({
  q,
  tagtype,
  page,
  perPage,
}: TagSearchRequest) {
  if (!perPage) {
    perPage = 20;
  }
  let endpoint = "/api/tag/search";
  endpoint =
    endpoint +
    "?q=" +
    q +
    "&type=" +
    tagtype +
    "&page=" +
    page +
    "&perPage=" +
    perPage;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
}

export async function updateTagNotes({ id, note }: TagNoteUpdateRequest) {
  const current_access = get(access_token);
  const endpoint = "/api/tag/" + id + "/note";
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: JSON.stringify({
      note,
    }),
  });
  const data = await response.json();
  return data;
}

export async function updateTag({ id, name, tagTypeId }: TagUpdateRequest) {
  const current_access = get(access_token);
  const endpoint = "/api/tag/" + id;
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_access,
    },
    body: JSON.stringify({
      name,
      tagTypeId,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getTagTypes() {
  const endpoint = "/api/tagtype";
  const response = await fetch(endpoint);
  const data: Array<TagTypeListItem> = await response.json();
  return data;
}
