import { isDesktop } from "./desktop-check";
import { readImage } from "@tauri-apps/plugin-clipboard-manager";
import { invoke } from "@tauri-apps/api/core";

const handlePaste = async (e?: any) => {
  if (e.clipboardData.files[0]) {
    return e.clipboardData.files[0];
  }
  return null;
};
export { handlePaste };
