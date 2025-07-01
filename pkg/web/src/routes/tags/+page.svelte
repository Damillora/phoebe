<script lang="ts">
    import { run } from "svelte/legacy";

    import { getTags, getTagTypes, searchTags } from "$lib/api";
    import { afterNavigate, goto } from "$app/navigation";
    import { page as currentPage } from "$app/state";
    import TagTypeIndicator from "$lib/components/ui/TagTypeIndicator.svelte";
    import { paginate } from "$lib/simple-pagination";
    import { onMount } from "svelte";
    import TagLinkNumbered from "$lib/components/ui/TagLinkNumbered.svelte";
    import Pagination from "$lib/components/ui/Pagination.svelte";

    let url = $derived(currentPage.url);

    let tags: TagListItem[] = $state([]);
    let tagTypes: TagTypeListItem[] = $state([]);
    let loading: LoadingState = $state();
    let tagTypesLoading: LoadingState = $state();
    let page = $state(1);
    let perPage = 20;
    let totalPages = $state(1);
    let q = $state("");
    let tagtype = $state("");

    const getData = async () => {
        const data = await searchTags({ q, tagtype, page, perPage });
        tags = data.tags;
        page = data.currentPage;
        totalPages = data.totalPage;
    };
    const getTagTypesData = async () => {
        tagTypes = await getTagTypes();
    };

    const handleSearch = (e: Event) => {
        e.preventDefault();
        goto(`/tags?q=${q}&type=${tagtype}`);
    };
    afterNavigate(() => {
        q = url.searchParams.get("q") ?? "";
        tagtype = url.searchParams.get("type") ?? "";
        loading = getData();
    });

    const changePage = (i: number) => {
        if (i >= 1 && i <= totalPages) {
            page = i;
            loading = getData();
        }
    };

    onMount(() => {
        tagTypesLoading = getTagTypesData();
    });
</script>

<section class="section">
    <div class="container">
        <div class="columns is-multiline">
            <div class="column is-one-third">
                <form onsubmit={handleSearch}>
                    <div class="panel is-primary">
                        <div class="panel-heading">Tags</div>
                        {#await tagTypesLoading}
                            <div class="skeleton-block"></div>
                        {:then _}
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
                        {/await}
                    </div>
                </form>
            </div>
            <div class="column is-two-thirds">
                {#await loading}
                    <div class="skeleton-block"></div>
                {:then _}
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
                        <Pagination {page} {totalPages} {changePage} />
                    </div>
                {/await}
            </div>
        </div>
    </div>
</section>
