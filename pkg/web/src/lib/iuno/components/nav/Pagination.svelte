<script lang="ts">
    import { paginate } from "$lib/utils/simple-pagination";
    import NavButton from "./NavButton.svelte";

    let { page, changePage, totalPages } = $props();

    let pagination = $derived(paginate(page, totalPages));
</script>

<nav class="flex flex-row justify-center" aria-label="pagination">
    <div class="flex flex-row justify-center bg-gray-100 rounded-lg">
        {#if page > 1}
            <NavButton
                onclick={() => changePage(page - 1)}
                disabled={page <= 1}
                class="mr-1">Previous</NavButton
            >
        {/if}
        <ul class="flex flex-row">
            {#each pagination as pageEntry, i}
                {#if pageEntry == "..."}
                    <li>
                        <span
                            class="inline-block py-2 px-4 rounded-lg font-medium"
                            >&hellip;</span
                        >
                    </li>
                {:else}
                    <li>
                        <NavButton
                            class={i < pagination.length - 2 ? "mr-1" : ""}
                            onclick={() => changePage(pageEntry)}
                            aria-label="Go to page {pageEntry}"
                            active={page === pageEntry}>{pageEntry}</NavButton
                        >
                    </li>
                {/if}
            {/each}
        </ul>
        {#if page < totalPages}
            <NavButton
                class="ml-1"
                onclick={() => changePage(page + 1)}
                disabled={page >= totalPages}>Next</NavButton
            >
        {/if}
    </div>
</nav>
