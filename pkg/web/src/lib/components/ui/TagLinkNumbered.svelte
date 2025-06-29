<script lang="ts">
    import TagTypeIndicator from "$lib/components/ui/TagTypeIndicator.svelte";

    let { tag, num, goToTag = false } = $props();

    let tagType = tag.split(":")[0] ?? "";
    let tagName = tag.split(":")[1] ?? "";
    let tagDisplay = tagName.split("_").join(" ");
    let tagUrl = goToTag ? `/tags/${tagName}` : `/posts?tags=${tagName}`;
</script>

<a class="panel-block is-block" href={tagUrl}>
    <span>
        {tagDisplay}
    </span>
    <TagTypeIndicator {tagType}></TagTypeIndicator>
    <span class="is-pulled-right">{num}</span>
</a>
