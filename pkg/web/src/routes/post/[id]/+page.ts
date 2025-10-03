import { getTag } from "$lib/api/client";
import { getPost, getPosts } from "$lib/api/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url, params }) => {
  const { id } = params;
  const postData = getPost({ id }).then((post) => {
    return {
      post: post,
      imagePercentage: ((1000 * 100) / post.width).toFixed(0) + "%",
    };
  });
  return {
    postData: postData,
  };
};
