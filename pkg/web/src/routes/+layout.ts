export const ssr = false;
import { access_token, refresh_token } from "$lib/stores";
import { get } from "svelte/store";
import type { LayoutLoad } from "./$types";
import { getUsernameFromToken, isTokenExpired } from "$lib/login-check";
import { updateToken } from "$lib/api/client";

export const load: LayoutLoad = async ({ url }) => {
  let host = url.host;
  let refresh = get(refresh_token);
  let access = get(access_token);
  if (!isTokenExpired(refresh) && isTokenExpired(access)) {
    await updateToken();
  }
  access = get(access_token);
  let loggedIn = !isTokenExpired(access);
  let username = getUsernameFromToken(access);

  return {
    loggedIn: loggedIn,
    username: username,
    currentHost: host,
  };
};
