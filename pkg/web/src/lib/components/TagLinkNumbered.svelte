<script lang="ts">
    import { goto, invalidate, invalidateAll } from "$app/navigation";
    import TagTypeIndicator from "$lib/components/TagTypeIndicator.svelte";
    import TagTypeVariantButton from "./TagTypeVariantButton.svelte";

    let {
        tag,
        num,
        goToTag = false,
        onTagClick = undefined,
        additional = undefined,
    } = $props();

    let tagType = tag.split(":")[0] ?? "";
    let tagName = tag.split(":")[1] ?? "";
    let tagDisplay = tagName.split("_").join(" ");
    let tagUrl = goToTag ? `/tags/${tagName}` : `/posts?tags=${tagName}`;
</script>

<div
    class="flex flex-row items-center hover:bg-blue-200 transition-colors rounded-lg"
    class:hover:bg-purple-200={tagType === "character"}
    class:hover:bg-yellow-200={tagType === "series"}
>
    {@render additional?.()}
    <TagTypeVariantButton
        class="rounded-l-lg"
        {tagType}
        {tagName}
        href={tagUrl}
        onclick={onTagClick}
    />
    <div
        class="mx-4 my-2 rounded-r-lg min-w-12 font-light text-right text-blue-800 cursor-default"
    >
        {num}
    </div>
</div>
