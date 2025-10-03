import { getTag } from "$lib/api/client";
import { getPosts } from "$lib/api/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url }) => {
  let tagQuery = url.searchParams.get("tags") ?? "";
  let page = Number.parseInt(url.searchParams.get("page") ?? "1");
  let searchTerms: string[] = [];
  let tagInfo = null;
  if (tagQuery) {
    searchTerms = tagQuery.split(" ");
  } else {
    searchTerms = [];
    tagInfo = null;
  }
  const data = getPosts({ page, q: searchTerms.join("+") }).then((data) => {
    if (data.posts) {
      return {
        posts: data.posts,
        tags: data.tags
          .filter(
            (x) =>
              !searchTerms.includes(x.tagName) &&
              !searchTerms.includes(x.tagType + ":" + x.tagName),
          )
          .sort((a, b) => b.postCount - a.postCount),
        totalPages: data.totalPage,
      };
    } else {
      return {
        posts: [],
        tags: [],
        totalPages: 0,
      };
    }
  });

  if (searchTerms.filter((x) => !x.startsWith("-")).length == 1) {
    tagInfo = getTag({ tag: searchTerms[0] });
  }
  return {
    searchTerms: searchTerms,
    page: page,
    postData: data,
    tagInfo: tagInfo,
  };
};
