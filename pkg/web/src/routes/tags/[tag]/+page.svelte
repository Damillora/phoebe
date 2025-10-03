<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import EditTagPanel from "$lib/components/EditTagPanel.svelte";
    import EditTagNotesPanel from "$lib/components/EditTagNotesPanel.svelte";
    import PostGallery from "$lib/components/PostGallery.svelte";
    import TagLinkNumbered from "$lib/components/TagLinkNumbered.svelte";
    import TagTypeIndicator from "$lib/components/TagTypeIndicator.svelte";
    import ContainerWithSidebar from "$lib/iuno/components/layout/ContainerWithSidebar.svelte";
    import Tabs from "$lib/iuno/components/layout/Tabs.svelte";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    import NavLink from "$lib/iuno/components/nav/NavLink.svelte";

    let { data } = $props();

    let tagSearch = $state("");
    let tagType = $state("");

    let onSubmit = async (e: Event) => {
        e.preventDefault();
        let url = "/tags?";
        let newParams: string[] = [];
        if (tagSearch) {
            newParams.push(`q=${tagSearch}`);
        }
        if (tagType) {
            newParams.push(`tagType=${tagType}`);
        }
        url = url + newParams.join("&");
        await goto(url);
    };
    const NO_MODE = 0;
    const EDIT_TAG_MODE = 1;
    const EDIT_NOTES_MODE = 2;
    let mode = $state(NO_MODE);

    const onEdit = () => {
        invalidateAll();
    };
</script>

<ContainerWithSidebar>
    {#snippet sidebar()}
        {#await data.tagData then responseTagData}
            {#if responseTagData}
                <Tabs tabs={["Related Tags", "Actions"]}>
                    {#snippet contents(n: number)}
                        {#if n === 0}
                            {#await data.tags then responseTags}
                                {#each responseTags.tags as tag}
                                    <TagLinkNumbered
                                        tag={tag.tagType + ":" + tag.tagName}
                                        num={tag.postCount}
                                        goToTag={true}
                                    />
                                {/each}
                            {/await}
                        {:else if n === 1}
                            <div class="flex flex-col">
                                <NavLink
                                    class="mb-1 text-left"
                                    href="/posts?tags={responseTagData.tagName}"
                                    >Browse Posts</NavLink
                                >
                                <NavButton
                                    class="mb-1 text-left"
                                    active={mode === EDIT_TAG_MODE}
                                    onclick={() => {
                                        mode = EDIT_TAG_MODE;
                                    }}>Edit Tag</NavButton
                                >
                                <NavButton
                                    class="mb-1 text-left"
                                    active={mode === EDIT_NOTES_MODE}
                                    onclick={() => {
                                        mode = EDIT_NOTES_MODE;
                                    }}>Edit Notes</NavButton
                                >
                            </div>
                        {/if}
                    {/snippet}
                </Tabs>
            {/if}
        {/await}
    {/snippet}
    {#snippet contents()}
        {#await data.tagData then response}
            {#if response}
                {#if mode === EDIT_TAG_MODE}
                    <EditTagPanel
                        tag={response}
                        onModeChange={() => {
                            mode = NO_MODE;
                        }}
                        onSubmit={onEdit}
                    />
                {:else if mode === EDIT_NOTES_MODE}
                    <EditTagNotesPanel
                        tag={response}
                        onModeChange={() => {
                            mode = NO_MODE;
                        }}
                        onSubmit={onEdit}
                    />
                {/if}
                <div class="py-2">
                    <div
                        class="px-4 pb-4 font-medium flex flex-row items-center"
                    >
                        <div class="grow text-4xl">
                            {response.tagName.split("_").join(" ")}
                        </div>
                    </div>
                    <div class="mx-4 mb-4">
                        <div class="rounded-lg bg-gray-100 px-4 py-2">
                            <div class="mb-2">
                                <p class="text-lg font-medium">Name</p>
                                <p>{response.tagName}</p>
                            </div>
                            <div class="mb-2">
                                <p class="text-lg font-medium">Category</p>
                                <p>
                                    <TagTypeIndicator
                                        class="my-1"
                                        tagType={response.tagType}
                                    />
                                </p>
                            </div>
                            <div class="mb-2">
                                <p class="text-lg font-medium">Post Count</p>
                                <p>
                                    {response.postCount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="mx-4">
                        {#if response.tagNote}
                            <div class="p-4 bg-blue-100 rounded-lg mb-4">
                                response.tagNote
                            </div>
                        {:else}
                            <div class="p-4 bg-yellow-100 rounded-lg mb-4">
                                There are no notes for this tag.
                            </div>
                        {/if}
                    </div>
                    {#await data.relatedPosts then responsePosts}
                        <div class="mx-2">
                            <PostGallery posts={responsePosts.posts} />
                        </div>
                    {/await}
                </div>
            {/if}
        {/await}
    {/snippet}
</ContainerWithSidebar>
