<script lang="ts">
    import { run } from "svelte/legacy";

    import { getPosts, getTag, getTagAutocomplete } from "$lib/api";
    import TagLinkNumbered from "$lib/components/ui/TagLinkNumbered.svelte";
    import PostGallery from "$lib/components/ui/PostGallery.svelte";
    import Tags from "svelte-tags-input";

    import { paginate } from "$lib/simple-pagination";
    import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
    import { page as currentPage } from "$app/state";
    import Pagination from "$lib/components/ui/Pagination.svelte";

    let url = $derived(currentPage.url);

    let tagQuery: string = $state("");
    let searchTerms: string[] = $state([]);

    let loading: LoadingState = $state();

    let page = $state(1);
    let totalPages = $state(1);
    let posts: PostListItem[] = $state([]);
    let tags: TagListItem[] = $state([]);

    let tagInfo: TagGetResponse | null = $state(null);

    const getData = async () => {
        const data = await getPosts({ page, q: searchTerms.join("+") });
        if (data.posts) {
            posts = data.posts;
            tags = data.tags
                .filter(
                    (x) =>
                        !searchTerms.includes(x.tagName) &&
                        !searchTerms.includes(x.tagType + ":" + x.tagName),
                )
                .sort((a, b) => b.postCount - a.postCount);
            totalPages = data.totalPage;
        } else {
            posts = [];
            tags = [];
            totalPages = 0;
        }

        if (searchTerms.filter((x) => !x.startsWith("-")).length == 1) {
            tagInfo = await getTag({ tag: searchTerms[0] });
        }
    };

    const onTagChange = (value: any) => {
        searchTerms = value.detail.tags;
    };

    const onAutocomplete = async (tag: string) => {
        const list = await getTagAutocomplete({ tag });
        return list;
    };

    afterNavigate(() => {
        tagQuery = url.searchParams.get("tags") ?? "";
        if (tagQuery) {
            searchTerms = tagQuery.split(" ");
        } else {
            searchTerms = [];
            tagInfo = null;
        }
        posts = [];
        page = 1;
        loading = getData();
    });
    const onSearch = (e: Event) => {
        e.preventDefault();
        if (searchTerms.length > 0) {
            goto(`/posts?tags=${searchTerms.join("+")}`);
        } else {
            goto(`/posts`);
        }
    };

    const changePage = (i: number) => {
        if (i >= 1 && i <= totalPages) {
            page = i;
            loading = getData();
        }
    };
</script>

<section class="section">
    <div class="container">
        <div class="block">
            <div class="columns is-multiline">
                <div class="column is-one-third">
                    <div class="panel is-primary">
                        <div class="panel-heading">Browse</div>
                        <div class="panel-block column">
                            <form onsubmit={onSearch}>
                                <div class="field">
                                    <div class="control is-expanded">
                                        <div class="control" id="tags">
                                            <Tags
                                                tags={searchTerms}
                                                addKeys={[9, 32]}
                                                on:tags={onTagChange}
                                                autoComplete={onAutocomplete}
                                                autoCompleteFilter={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="control">
                                        <button
                                            type="submit"
                                            class="button is-primary"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {#await loading}
                            <div class="skeleton-block"></div>
                        {:then _}
                            {#each tags as tag (tag)}
                                <TagLinkNumbered
                                    tag={tag.tagType + ":" + tag.tagName}
                                    num={tag.postCount}
                                />
                            {/each}
                        {/await}
                    </div>
                    {#if tagInfo}
                        <div class="panel is-info">
                            <p class="panel-heading">
                                Tag:
                                {tagInfo.tagName.split("_").join(" ")}
                            </p>
                            {#if tagInfo.tagNote}
                                <div class="panel-block column">
                                    <div class="content pre-line">
                                        {tagInfo.tagNote}
                                    </div>
                                </div>
                            {/if}
                            <div class="panel-block column">
                                <a
                                    class="button is-primary is-fullwidth is-outlined"
                                    href="/tags/{tagInfo.tagName}">View Tag</a
                                >
                            </div>
                        </div>
                    {/if}
                </div>
                <div class="column is-two-thirds">
                    <div class="columns is-multiline">
                        {#await loading}
                            <div class="column">
                                <div class="skeleton-block"></div>
                            </div>
                        {:then _}
                            {#if posts.length > 0}
                                <div class="column is-full">
                                    <PostGallery {posts} />
                                </div>
                            {:else}
                                <div class="column is-full">
                                    <div class="notification is-warning">
                                        No posts found.
                                    </div>
                                </div>
                            {/if}

                            <div class="column is-full">
                                <Pagination {page} {changePage} {totalPages} />
                            </div>
                        {/await}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
