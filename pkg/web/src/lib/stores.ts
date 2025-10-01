import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const access_token = writable("");

export const refresh_token = writable(
  (browser && localStorage.getItem("refreshToken")) || "",
);

refresh_token.subscribe((value) => {
  if (value != null) {
    browser && localStorage.setItem("refreshToken", value);
  }
});
