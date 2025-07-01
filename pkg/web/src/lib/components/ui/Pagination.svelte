<script lang="ts">
    import { paginate } from "$lib/simple-pagination";

    let { page, changePage, totalPages } = $props();

    let pagination = $derived(paginate(page, totalPages));
</script>

<nav class="pagination is-centered" aria-label="pagination">
    <a
        href={null}
        onclick={() => changePage(page - 1)}
        class="pagination-previous"
        class:is-disabled={page == 1}>Previous</a
    >
    <a
        href={null}
        onclick={() => changePage(page + 1)}
        class="pagination-next"
        class:is-disabled={page >= totalPages}>Next</a
    >
    <ul class="pagination-list">
        {#each pagination as pageEntry}
            {#if pageEntry == "..."}
                <li>
                    <span class="pagination-ellipsis">&hellip;</span>
                </li>
            {:else}
                <li>
                    <a
                        href={null}
                        onclick={() => changePage(pageEntry)}
                        class="pagination-link"
                        class:is-current={page == pageEntry}
                        aria-label="Goto page {pageEntry}">{pageEntry}</a
                    >
                </li>
            {/if}
        {/each}
    </ul>
</nav>
