import {
  getPostCount,
  getRelatedTags,
  getTag,
  searchTags,
} from "$lib/api/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, url }) => {
  let q = url.searchParams.get("q") ?? "";
  let tagType = url.searchParams.get("tagType") ?? "";
  let page = Number.parseInt(url.searchParams.get("page") ?? "1");
  let perPage = 20;
  return {
    q: q,
    tagType: tagType,
    tags: searchTags({ q, tagtype: tagType, page, perPage }),
  };
};
