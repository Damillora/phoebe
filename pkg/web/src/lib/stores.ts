import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const token = writable(
  (browser && localStorage.getItem("apiToken")) || "",
);

token.subscribe((value) => {
  if (value != null) {
    browser && localStorage.setItem("apiToken", value);
  }
});

export const apiUrl = writable(
  browser && window?.__TAURI__
    ? localStorage.getItem("apiUrl")
    : window.location.origin,
);

apiUrl.subscribe((value) => {
  if (value != null) {
    if (browser && window?.__TAURI__) {
      localStorage.setItem("apiUrl", value);
    }
  }
});
