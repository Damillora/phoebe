<script>
    let { tagType, class: className = "" } = $props();
</script>

{#if tagType == "character"}
    <span
        class="text-sm bg-purple-800 text-white px-2 py-1 rounded-full {className}"
        >{tagType}</span
    >
{:else if tagType == "series"}
    <span
        class="text-sm bg-yellow-400 text-black px-2 py-1 rounded-full {className}"
        >{tagType}</span
    >
{:else}
    <span
        class="text-sm bg-gray-300 text-black px-2 py-1 rounded-full {className}"
        >{tagType}</span
    >
{/if}
