import { apiUrl, token } from "./stores.js";
import { browser } from "$app/environment";
import { isDesktop } from "./desktop-check.js";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";

// Stores
let url: string = (browser && window.location.origin) || "";
apiUrl.subscribe((value) => {
  url = value ?? "";
});
let current_token: string;
token.subscribe((value) => {
  current_token = value;
});
let currentFetch = isDesktop ? tauriFetch : fetch;

// Auth
export async function login({ username, password }: LoginRequest) {
  const endpoint = url + "/api/auth/login";
  const response = await currentFetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data: TokenResponse = await response.json();
  token.set(data.token);
  return data;
}

export async function register({ email, username, password }: RegisterRequest) {
  const endpoint = url + "/api/user/register";
  const response = await currentFetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      email,
      username,
      password,
    }),
  });
  const data: TokenResponse = await response.json();
  token.set(data.token);
  return data;
}

export async function updateToken() {
  const endpoint = url + "/api/auth/token";
  const response = await currentFetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_token,
    },
  });
  const data: TokenResponse = await response.json();
  token.set(data.token);
  return data;
}

// Tags
export async function getTags() {
  const endpoint = url + "/api/tag";
  const response = await currentFetch(endpoint);
  const data: Array<TagListItem> = await response.json();
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
  let endpoint = url + "/api/tag/search";
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
  const response = await currentFetch(endpoint);
  const data = await response.json();
  return data;
}

export async function getTag({ tag }: TagGetRequest) {
  const endpoint = url + "/api/tag/" + tag;
  const response = await currentFetch(endpoint);
  const data: TagGetResponse = await response.json();
  return data;
}

export async function getRelatedTags({ tag }: TagGetRequest) {
  const endpoint = url + "/api/tag-related/" + tag;
  const response = await currentFetch(endpoint);
  const data: Array<TagListItem> = await response.json();
  return data;
}
export async function getTagAutocomplete({
  tag,
  positive,
}: TagAutocompleteRequest) {
  let endpoint = url + "/api/tag-autocomplete?tag=" + tag;
  if (positive) {
    endpoint = endpoint + "&positive=true";
  }
  const response = await currentFetch(endpoint);
  const data: Array<string> = await response.json();
  return data;
}
export async function getPosts({ page, q, perPage }: PostListRequest) {
  if (!perPage) {
    perPage = 20;
  }
  let endpoint = url + "/api/post?page=" + page + "&perPage=" + perPage;
  if (q) {
    endpoint =
      url + "/api/post?tags=" + q + "&page=" + page + "&perPage=" + perPage;
  }
  const response = await currentFetch(endpoint);
  const data: PostListResponse = await response.json();
  return data;
}

export async function getPost({ id }: PostGetRequest) {
  const endpoint = url + "/api/post/" + id;
  const response = await currentFetch(endpoint);
  const data: PostGetResponse = await response.json();
  return data;
}

export async function getPostCount() {
  const endpoint = url + "/api/post-count";
  const response = await currentFetch(endpoint);
  const data: PostCountResponse = await response.json();
  return data;
}

export async function uploadBlob({ file }: BlobUploadRequest) {
  var formData = new FormData();
  formData.append("file", file);
  const endpoint = url + "/api/blob/upload";
  const response = await currentFetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_token,
    },
    body: formData,
  });
  const data: BlobUploadResponse = await response.json();
  return data;
}

export async function searchBlob({ file }: BlobUploadRequest) {
  var formData = new FormData();
  formData.append("file", file);
  const endpoint = url + "/api/blob/search";
  const response = await currentFetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_token,
    },
    body: formData,
  });
  const data: BlobSimilarListResponse = await response.json();
  return data;
}

export async function postCreate({
  blob_id,
  source_url,
  tags,
}: PostCreateRequest) {
  const endpoint = url + "/api/post/create";
  const response = await currentFetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_token,
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

export async function postUpdate({ id, source_url, tags }: PostUpdateRequest) {
  const endpoint = url + "/api/post/" + id;
  const response = await currentFetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + current_token,
    },
    body: JSON.stringify({
      source_url,
      tags,
    }),
  });
  const data = await response.json();
  return data;
}

export async function postDelete({ id }: PostDeleteRequest) {
  const endpoint = url + "/api/post/" + id;
  const response = await currentFetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + current_token,
    },
  });
  return response.status == 200;
}

export async function getUserProfile() {
  const endpoint = url + "/api/user/profile";
  const response = await currentFetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + current_token,
    },
  });
  const data: UserProfileResponse = await response.json();
  return data;
}

export async function updateTagNotes({ id, note }: TagNoteUpdateRequest) {
  const endpoint = url + "/api/tag/" + id + "/note";
  const response = await currentFetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_token,
    },
    body: JSON.stringify({
      note,
    }),
  });
  const data = await response.json();
  return data;
}

export async function updateTag({ id, name, tagTypeId }: TagUpdateRequest) {
  const endpoint = url + "/api/tag/" + id;
  const response = await currentFetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_token,
    },
    body: JSON.stringify({
      name,
      tagTypeId,
    }),
  });
  const data = await response.json();
  return data;
}

export async function updateUserProfile({
  email,
  username,
}: UserProfileUpdateRequest) {
  const endpoint = url + "/api/user/update";
  const response = await currentFetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_token,
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
  const endpoint = url + "/api/user/update-password";
  const response = await currentFetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + current_token,
    },
    body: JSON.stringify({
      old_password,
      new_password,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getTagTypes() {
  const endpoint = url + "/api/tagtype";
  const response = await currentFetch(endpoint);
  const data: Array<TagTypeListItem> = await response.json();
  return data;
}
