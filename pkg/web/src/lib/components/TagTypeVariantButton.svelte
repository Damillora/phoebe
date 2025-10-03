<script>
    let {
        tagType,
        tagName,
        href,
        class: className = "",
        ...restProps
    } = $props();
</script>

{#if tagType == "character"}
    <a
        class="mx-4 my-2 flex flex-row items-center grow text-purple-800 hover:text-purple-600 text-left cursor-pointer transition-colors {className}"
        {href}
        {...restProps}
    >
        <span> {tagName.split("_").join(" ")}</span>
    </a>
{:else if tagType == "series"}
    <a
        class="mx-4 my-2 flex flex-row items-center hover:text-yellow-600 grow text-yellow-800 text-left cursor-pointer transition-colors {className}"
        {href}
        {...restProps}
    >
        <span> {tagName.split("_").join(" ")}</span>
    </a>
{:else}
    <a
        class="mx-4 my-2 flex flex-row items-center hover:bg-blue-200 grow text-blue-800 hover:text-blue-600 text-left cursor-pointer transition-colors {className}"
        {href}
        {...restProps}
    >
        <span> {tagName.split("_").join(" ")}</span>
    </a>
{/if}
