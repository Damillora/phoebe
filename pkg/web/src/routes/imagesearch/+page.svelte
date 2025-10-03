<script lang="ts">
    import { searchBlob } from "$lib/api/client";
    import type {
        BlobSimilarListItem,
        BlobSimilarListResponse,
    } from "$lib/api/response";
    import PostGallery from "$lib/components/PostGallery.svelte";
    import LocalImage from "$lib/iuno/components/image/LocalImage.svelte";
    import ContainerWithSidebar from "$lib/iuno/components/layout/ContainerWithSidebar.svelte";
    import { handlePaste } from "$lib/utils/paste";
    import type { ChangeEventHandler } from "svelte/elements";

    const onSubmit = () => {};

    let file: File | undefined = $state();
    let loadingContents = $state("");
    let similar: BlobSimilarListItem[] | undefined = $state();

    let similarLoading: LoadingStateWithResponse<BlobSimilarListResponse> =
        $state();
    let loading: LoadingState = $state();

    const onPaste = async (e: Event) => {
        const pastedFile = await handlePaste(e);
        if (pastedFile) {
            file = pastedFile;
            similar = [];
            await handleFileChange();
        }
    };

    const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const fileElement = e.target as HTMLInputElement;
        file = fileElement?.files?.item(0) ?? undefined;
        similar = [];
        await handleFileChange();
    };
    const handleFileChange = async () => {
        if (file) {
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                loadingContents = reader.result as string;
            });
            reader.readAsDataURL(file);
            similar = [];
            loading = searchBlob({ file });
            const response = await loading;
            similar = response.similar;
        }
    };
</script>

<form onsubmit={onSubmit}>
    <input id="image" class="hidden" type="file" onchange={onFileChange} />
    <ContainerWithSidebar class="pb-8">
        {#snippet sidebar()}
            <div class="mx-4 my-2">
                <label
                    for="image"
                    class="mb-4 h-24 w-full p-4 flex flex-col items-center justify-center bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer center border-dashed border-1 border-blue-800 transition-colors"
                >
                    <div class="mb-2">
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
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                            />
                        </svg>
                    </div>
                    <span class="font-medium text-lg">Upload image here</span>
                </label>
            </div>
        {/snippet}
        {#snippet contents()}
            <div class="mx-4 my-2">
                <div class="mb-4 bg-blue-100 rounded-lg p-4">
                    {#await loading}
                        <p>Searching for similar images...</p>
                    {:then _}
                        {#if similar}
                            {#if similar.length > 0}
                                <p>
                                    Found {similar.length} similar posts.
                                </p>
                            {:else}
                                <p>Found no similar posts.</p>
                            {/if}
                        {:else}
                            <p>Similar posts will appear here.</p>
                        {/if}
                    {/await}
                </div>
            </div>
            <div class="mx-4 my-2">
                <PostGallery posts={similar} />
            </div>
        {/snippet}
    </ContainerWithSidebar>
</form>

<svelte:window onpaste={onPaste} />
