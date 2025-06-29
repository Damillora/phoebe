import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { isDesktop } from "./desktop-check";

export const token = writable(
  (browser && localStorage.getItem("apiToken")) || "",
);

token.subscribe((value) => {
  if (value != null) {
    browser && localStorage.setItem("apiToken", value);
  }
});

export const apiUrl = writable(
  browser && isDesktop
    ? localStorage.getItem("apiUrl")
    : window.location.origin,
);

apiUrl.subscribe((value) => {
  if (value != null) {
    if (browser && isDesktop) {
      localStorage.setItem("apiUrl", value);
    }
  }
});
