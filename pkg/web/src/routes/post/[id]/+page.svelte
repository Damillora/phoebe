<script lang="ts">
    import { goto, invalidateAll } from "$app/navigation";
    import DeletePostPanel from "$lib/components/DeletePostPanel.svelte";
    import EditPostPanel from "$lib/components/EditPostPanel.svelte";
    import TagLinkNumbered from "$lib/components/TagLinkNumbered.svelte";
    import Button from "$lib/iuno/components/form/Button.svelte";
    import Image from "$lib/iuno/components/image/Image.svelte";
    import Tabs from "$lib/iuno/components/layout/Tabs.svelte";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    import NavLink from "$lib/iuno/components/nav/NavLink.svelte";
    import { format, formatDistanceToNow } from "date-fns";

    let { data } = $props();

    let isOriginal = $state(false);
    const NO_MODE = 0;
    const EDIT_MODE = 1;
    const DELETE_MODE = 2;
    let mode = $state(NO_MODE);

    const trimUrl = (str: string) => {
        if (str.length > 30) {
            return str.substring(0, 30) + "...";
        }
        return str;
    };

    const onEdit = async () => {
        await invalidateAll();
    };
    const onDelete = async () => {
        goto("/posts");
    };
</script>

<div class="flex flex-col-reverse lg:flex-row lg:min-h-[calc(100vh-4rem)]">
    <div class="w-full lg:w-1/3 2xl:w-1/4 flex flex-col">
        <div>
            {#await data.postData then response}
                <Tabs class="mx-4" tabs={["Tags", "Information", "Actions"]}>
                    {#snippet contents(sidebarTab: number)}
                        {#if sidebarTab === 0}
                            {#if response.post.tags}
                                {#each response.post.tags as tag (tag)}
                                    <TagLinkNumbered
                                        tag={tag.tagType + ":" + tag.tagName}
                                        num={tag.postCount}
                                    />
                                {/each}
                            {/if}
                        {:else if sidebarTab == 1}
                            <div class="rounded-lg px-4 py-2">
                                <div class="mb-2">
                                    <p class="text-lg font-medium">
                                        Upload Date
                                    </p>
                                    <p>
                                        <time
                                            title={format(
                                                response.post.upload_date,
                                                "dd MMMM yyyy HH:mm:ss",
                                            )}
                                            datetime={response.post.upload_date}
                                            >{formatDistanceToNow(
                                                response.post.upload_date,
                                                {
                                                    addSuffix: true,
                                                },
                                            )}</time
                                        >
                                    </p>
                                </div>
                                <div class="mb-2">
                                    <p class="text-lg font-medium">Uploader</p>
                                    <p>
                                        {response.post.uploader}
                                    </p>
                                </div>
                                <div class="mb-2">
                                    <p class="text-lg font-medium">
                                        Dimensions
                                    </p>
                                    <p>
                                        {response.post
                                            .width}&nbsp;x&nbsp;{response.post
                                            .height}
                                    </p>
                                </div>
                                <div class="mb-2">
                                    <p class="text-lg font-medium">Source</p>
                                    <p>
                                        <a
                                            class="text-blue-800 hover:text-blue-600 transition-colors"
                                            href={response.post.source_url}
                                            >{trimUrl(
                                                response.post.source_url,
                                            )}</a
                                        >
                                    </p>
                                </div>
                            </div>
                        {:else if sidebarTab === 2}
                            <NavLink
                                class="w-full"
                                href={response.post.image_path}
                                target="_blank"
                            >
                                Download
                            </NavLink>
                            <NavButton
                                class="w-full text-left"
                                active={mode === EDIT_MODE}
                                onclick={() => {
                                    mode = EDIT_MODE;
                                }}>Edit Post</NavButton
                            >
                            <NavButton
                                class="w-full text-left"
                                active={mode === DELETE_MODE}
                                onclick={() => {
                                    mode = DELETE_MODE;
                                }}>Delete Post</NavButton
                            >
                        {/if}
                    {/snippet}
                </Tabs>
            {/await}
        </div>
    </div>
    <div class="relative px-4 w-full lg:w-2/3 2xl:w-3/4 mx-auto">
        {#await data.postData}
            <p>Loading...</p>
        {:then response}
            {#if mode === EDIT_MODE}
                <EditPostPanel
                    onModeChange={() => {
                        mode = NO_MODE;
                    }}
                    post={response.post}
                    onSubmit={onEdit}
                />
            {:else if mode === DELETE_MODE}
                <DeletePostPanel
                    onModeChange={() => {
                        mode = NO_MODE;
                    }}
                    id={response.post.id}
                    onSubmit={onDelete}
                />
            {/if}
            {#if response.post.width > 1000 && isOriginal == false}
                <div
                    class="p-4 bg-yellow-100 rounded-lg flex flex-col md:flex-row items-center"
                >
                    <div class="mr-2 grow mb-4 md:mb-0">
                        Resized to {response.imagePercentage} of the original image.
                    </div>
                    <Button
                        class="w-full md:w-fit"
                        primary
                        onclick={() => {
                            isOriginal = true;
                        }}>View Original</Button
                    >
                </div>
                <figure class="py-4">
                    <Image
                        class="mx-auto w-full lg:w-1/2"
                        alt={response.post.id}
                        src={response.post.preview_path}
                    />
                </figure>
            {:else}
                <div
                    class="p-4 bg-blue-100 rounded-lg flex flex-col md:flex-row items-center"
                >
                    <span class="mr-2 grow mb-4 md:mb-0">
                        Viewing original image.</span
                    >
                    {#if response.post.width > 1000}
                        <Button
                            class="w-full md:w-fit"
                            primary
                            onclick={() => {
                                isOriginal = false;
                            }}>View Smaller</Button
                        >
                    {/if}
                </div>
                <figure class="py-4">
                    <Image
                        class="w-full"
                        alt={response.post.id}
                        src={response.post.image_path}
                    />
                </figure>
            {/if}
        {/await}
    </div>
</div>
