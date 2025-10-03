<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import PostGallery from "$lib/components/PostGallery.svelte";
    import TagLinkNumbered from "$lib/components/TagLinkNumbered.svelte";
    import TagTypeIndicator from "$lib/components/TagTypeIndicator.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import InputButton from "$lib/iuno/components/form/InputButton.svelte";
    import LinkButton from "$lib/iuno/components/form/LinkButton.svelte";
    import TagsInput from "$lib/iuno/components/form/TagsInput.svelte";
    import ContainerWithSidebar from "$lib/iuno/components/layout/ContainerWithSidebar.svelte";
    import Tabs from "$lib/iuno/components/layout/Tabs.svelte";
    import Pagination from "$lib/iuno/components/nav/Pagination.svelte";
    import { onAutocomplete } from "$lib/utils/autocomplete";

    let { data } = $props();
    let tags: string[] = $state(data.searchTerms);

    let onChangeTag = (tagChanges: string[]) => {
        tags = tagChanges;
    };
    let onChangePage = async (pageNumber: number) => {
        if (tags.length > 0) {
            await goto(`/posts?tags=${tags.join("+")}&page=${pageNumber}`);
        } else {
            await goto(`/posts?page=${pageNumber}`);
        }
    };
    let onSubmit = async (e: Event) => {
        e.preventDefault();
        if (tags.length > 0) {
            goto(`/posts?tags=${tags.join("+")}`);
        } else {
            goto("/posts");
        }
    };
</script>

<ContainerWithSidebar reverse>
    {#snippet sidebar()}
        <div class="px-4 py-2">
            <form onsubmit={onSubmit}>
                <Input>
                    <TagsInput
                        value={tags}
                        ontagchange={onChangeTag}
                        onautocomplete={onAutocomplete}
                    />
                    <InputButton type="submit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </InputButton>
                </Input>
            </form>
        </div>
        <div class="px-4 py-2">
            {#await data.postData then response}
                {#each response.tags as tag}
                    <TagLinkNumbered
                        tag={tag.tagType + ":" + tag.tagName}
                        num={tag.postCount}
                        goToTag={false}
                        onTagClick={() => {
                            onChangeTag([tag.tagName]);
                        }}
                    >
                        {#snippet additional()}
                            <button
                                class="ml-2 px-2 py-2 font-light text-right text-green-800 hover:bg-green-200 hover:text-green-600 cursor-pointer transition-colors"
                                onclick={() => {
                                    onChangeTag(
                                        tags
                                            .filter((x) => x != tag.tagName)
                                            .concat(tag.tagName),
                                    );
                                }}
                            >
                                +
                            </button>
                            <button
                                class="px-2 py-2 font-light text-right text-red-800 hover:bg-red-200 hover:Text-red-600 cursor-pointer transition-colors"
                                onclick={() => {
                                    onChangeTag(
                                        tags.filter((x) => x != tag.tagName),
                                    );
                                }}
                            >
                                -
                            </button>
                        {/snippet}
                    </TagLinkNumbered>
                {/each}
            {/await}
        </div>
    {/snippet}
    {#snippet contents()}
        {#await data.postData}
            <p>Loading...</p>
        {:then response}
            <Tabs
                margin={false}
                tabs={["Posts", ...(data.tagInfo ? ["Tag"] : [])]}
            >
                {#snippet contents(n: number)}
                    {#if n === 0}
                        <div class="p-2">
                            <PostGallery posts={response.posts} />
                        </div>
                        <div>
                            <Pagination
                                page={data.page}
                                totalPages={response.totalPages}
                                changePage={onChangePage}
                            />
                        </div>
                    {:else if n === 1}
                        <div class="px-4 py-2">
                            {#await data.tagInfo then response}
                                {#if response}
                                    <div
                                        class="text-4xl font-medium mb-4 flex flex-row items-center"
                                    >
                                        <p class="mr-4">
                                            {response.tagName
                                                .split("_")
                                                .join(" ")}
                                        </p>
                                        <TagTypeIndicator
                                            tagType={response.tagType}
                                        />
                                    </div>
                                    {#if response.tagNote}
                                        <div
                                            class="p-4 bg-blue-100 rounded-lg mb-4"
                                        >
                                            response.tagNote
                                        </div>
                                    {:else}
                                        <div
                                            class="p-4 bg-yellow-100 rounded-lg mb-4"
                                        >
                                            There are no notes for this tag.
                                        </div>
                                    {/if}
                                    <LinkButton
                                        href="/tags/{response.tagName}"
                                        primary
                                    >
                                        View Tag
                                    </LinkButton>
                                {/if}
                            {/await}
                        </div>
                    {/if}
                {/snippet}
            </Tabs>
        {/await}
    {/snippet}
</ContainerWithSidebar>
