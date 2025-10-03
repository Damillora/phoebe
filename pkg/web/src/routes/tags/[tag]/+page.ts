import {
  getPostCount,
  getPosts,
  getRelatedTags,
  getTag,
  searchTags,
} from "$lib/api/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, url }) => {
  return {
    tags: getRelatedTags({ tag: params.tag }).then((tags) => {
      return {
        currentPage: 1,
        totalPages: 1,
        tagCount: tags.length,
        tags: tags,
      };
    }),
    tagData: getTag({ tag: params.tag }),
    currentTag: params.tag,
    relatedPosts: getPosts({
      page: 1,
      q: params.tag,
      perPage: 4,
    }),
  };
};
