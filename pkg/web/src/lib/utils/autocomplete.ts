import { getTagAutocomplete } from "$lib/api/client";

export const onAutocomplete = async (tag: string) => {
  const list = await getTagAutocomplete({ tag });
  return list;
};

export const onAutocompletePositive = async (tag: string) => {
  const list = await getTagAutocomplete({ tag, positive: true });
  return list;
};
