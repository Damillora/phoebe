import { getPostCount } from "$lib/api/client";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({}) => {
  return {
    postCount: getPostCount(),
  };
};
