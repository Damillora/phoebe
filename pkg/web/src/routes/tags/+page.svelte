<script lang="ts">
    import { run } from "svelte/legacy";

    import { getTags, getTagTypes, searchTags } from "$lib/api";
    import { afterNavigate, goto } from "$app/navigation";
    import { page as currentPage } from "$app/state";
    import TagTypeIndicator from "$lib/components/ui/TagTypeIndicator.svelte";
    import { paginate } from "$lib/simple-pagination";
    import { onMount } from "svelte";
    import TagLinkNumbered from "$lib/components/ui/TagLinkNumbered.svelte";

    let url = $derived(currentPage.url);

    let tags = $state([]);
    let tagTypes = $state([]);
    let loading = $state(false);
    let tagTypesLoading = $state(false);
    let page = $state(1);
    let totalPages = $state(1);
    let totalTags = $state(0);
    let q = $state("");
    let tagtype = $state("");
    let pagination: string[] = $state([]);

    const getData = async () => {
        const data = await searchTags({ q, tagtype });
        tags = data.tags;
        page = data.currentPage;
        totalPages = data.totalPage;
        totalTags = data.tagCount;
        pagination = paginate(page, totalPages);
        loading = false;
    };
    const getTagTypesData = async () => {
        tagTypes = await getTagTypes();
        tagTypesLoading = false;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        goto(`/tags?q=${q}&type=${tagtype}`);
    };
    afterNavigate(() => {
        loading = true;
        q = url.searchParams.get("q") ?? "";
        tagtype = url.searchParams.get("type") ?? "";
        getData();
    });

    const changePage = (i) => {
        if (i >= 1 && i <= totalPages) {
            loading = true;
            page = i;
            getData();
        }
    };

    onMount(() => {
        tagTypesLoading = true;
        getTagTypesData();
    });
</script>

<section class="section">
    <div class="container">
        <div class="columns is-multiline">
            <div class="column is-one-third">
                <form onsubmit={handleSearch}>
                    <div class="panel is-primary">
                        <div class="panel-heading">Tags</div>
                        {#if !tagTypesLoading}
                            <div class="panel-block column">
                                <div class="row">
                                    <strong>Name:</strong>
                                </div>
                                <div class="row">
                                    <div class="field">
                                        <div class="control">
                                            <input
                                                class="input"
                                                type="text"
                                                bind:value={q}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-block column">
                                <div class="row">
                                    <strong>Category:</strong>
                                </div>
                                <div class="row">
                                    <div class="field">
                                        <div class="select">
                                            <select bind:value={tagtype}>
                                                <option
                                                    value=""
                                                    selected={tagtype === ""}
                                                >
                                                    all
                                                </option>
                                                {#each tagTypes as tagType}
                                                    <option
                                                        value={tagType.name}
                                                        selected={tagtype ===
                                                            tagType.name}
                                                    >
                                                        {tagType.name}
                                                    </option>
                                                {/each}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="panel-block column">
                                <button class="button is-primary" type="submit"
                                    >Search</button
                                >
                            </div>
                        {:else}
                            <div class="skeleton-block"></div>
                        {/if}
                    </div>
                </form>
            </div>
            <div class="column is-two-thirds">
                {#if !loading}
                    {#if tags.length > 0}
                        <div class="panel is-info">
                            {#each tags as tag}
                                <TagLinkNumbered
                                    tag={tag.tagType + ":" + tag.tagName}
                                    num={tag.postCount}
                                    goToTag={true}
                                />
                            {/each}
                        </div>
                    {:else}
                        <div class="notification is-warning">
                            No tags found.
                        </div>
                    {/if}
                    <div class="column is-full">
                        <nav
                            class="pagination is-centered"
                            aria-label="pagination"
                        >
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
                                            <span class="pagination-ellipsis"
                                                >&hellip;</span
                                            >
                                        </li>
                                    {:else}
                                        <li>
                                            <a
                                                href={null}
                                                onclick={() =>
                                                    changePage(pageEntry)}
                                                class="pagination-link"
                                                class:is-current={page ==
                                                    pageEntry}
                                                aria-label="Goto page {pageEntry}"
                                                >{pageEntry}</a
                                            >
                                        </li>
                                    {/if}
                                {/each}
                            </ul>
                        </nav>
                    </div>
                {:else}
                    <div class="skeleton-block"></div>
                {/if}
            </div>
        </div>
    </div>
</section>
