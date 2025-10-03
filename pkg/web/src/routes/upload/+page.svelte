<script lang="ts">
    import { goto } from "$app/navigation";
    import LocalImage from "$lib/iuno/components/image/LocalImage.svelte";
    import { handlePaste } from "$lib/utils/paste";
    import { readFileAsDataUrl } from "$lib/utils/files";
    import type {
        BlobSimilarListItem,
        BlobSimilarListResponse,
    } from "$lib/api/response";
    import type { ChangeEventHandler } from "svelte/elements";
    import { postCreate, searchBlob, uploadBlob } from "$lib/api/client";
    import Button from "$lib/iuno/components/form/Button.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import TagsInput from "$lib/iuno/components/form/TagsInput.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import ContainerWithSidebar from "$lib/iuno/components/layout/ContainerWithSidebar.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    import { onAutocompletePositive } from "$lib/utils/autocomplete.js";
    let { data } = $props();
    // Auth guard
    if (data.loggedIn === false) {
        goto("/auth/login");
    }

    let form: {
        blob_id: string;
        source_url: string;
        tags: string[];
    } = $state({
        blob_id: "",
        source_url: "",
        tags: [],
    });

    let file: File | undefined = $state();
    let loadedContent = $state("");
    let similar: BlobSimilarListItem[] = $state([]);

    let similarLoading: LoadingStateWithResponse<BlobSimilarListResponse> =
        $state();
    let loading: LoadingState = $state();
    let uploading: LoadingState = $state();

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
            uploading = undefined;
            loading = readFileAsDataUrl(file);
            loadedContent = await loading;
            similarLoading = searchBlob({
                file,
            });
            var similarResponse = await similarLoading;
            if (similarResponse.similar) {
                similar = similarResponse.similar;
            }
        }
    };

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        if (file) {
            uploading = uploadBlob({ file });
            var blobResponse = await uploading;
            form.blob_id = blobResponse.id;
            const response = await postCreate(form);
            goto(`/post/${response.id}`);
        }
    };

    const onTagChange = (tags: string[]) => {
        form.tags = tags;
    };
</script>

<form onsubmit={onSubmit}>
    <input id="image" class="hidden" type="file" onchange={onFileChange} />
    <ContainerWithSidebar reverse>
        {#snippet sidebar()}
            <div class="mx-4 my-2">
                <div class="mb-4">
                    {#if file}
                        {#await loading}
                            <div
                                class="h-24 w-full p-4 flex flex-col items-center justify-center bg-blue-100 rounded-lg cursor-pointer center border-dashed border-1 border-blue-800 transition-colors"
                            >
                                <span class="font-medium text-lg"
                                    >Loading...</span
                                >
                            </div>
                        {:then _}
                            <label
                                for="image"
                                class="h-24 w-full p-4 flex flex-col items-center justify-center bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer center border-dashed border-1 border-blue-800 transition-colors"
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
                                <span class="font-medium text-lg"
                                    >Replace image</span
                                >
                            </label>
                        {/await}
                    {:else}
                        <label
                            for="image"
                            class="w-full h-24 p-4 flex flex-col items-center justify-center bg-blue-100 rounded-lg hover:bg-blue-200 cursor-pointer center border-dashed border-1 border-blue-800 transition-colors"
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
                            <span class="font-medium text-lg"
                                >Upload image here</span
                            >
                        </label>
                    {/if}
                </div>
                {#if file}
                    <Label for="url">Source</Label>
                    <Input class="mb-4 w-full">
                        <TextInput
                            type="url"
                            name="url"
                            bind:value={form.source_url}
                        />
                    </Input>
                    <Label for="tags">Tags</Label>
                    <Input class="mb-4 w-full">
                        <TagsInput
                            name="tags"
                            value={form.tags}
                            ontagchange={onTagChange}
                            onautocomplete={onAutocompletePositive}
                        />
                    </Input>
                    <div class="mb-4 bg-blue-100 rounded-lg p-4">
                        {#await similarLoading}
                            <p>Searching for similar images...</p>
                        {:then _}
                            {#if similar.length > 0}
                                <p>
                                    Similar posts found:
                                    {#each similar as post, i}
                                        <a
                                            class="text-blue-800 hover:text-blue-600 transition-colors"
                                            href="/post/{post.id}">{post.id}</a
                                        >
                                        {#if i < similar.length - 1}
                                            ,
                                        {/if}
                                    {/each}
                                </p>
                            {:else}
                                <p>No similar posts found.</p>
                            {/if}
                        {/await}
                    </div>
                    {#await uploading}
                        <div
                            class="mb-4 h-24 w-full p-4 flex flex-col items-center justify-center bg-green-100 rounded-lg cursor-pointer center border-dashed border-1 border-blue-800 transition-colors"
                        >
                            <span class="font-medium text-lg">Uploading...</span
                            >
                        </div>
                    {/await}
                {/if}
                {#if file}
                    <Button class="w-full" primary type="submit">Submit</Button>
                {/if}
            </div>
        {/snippet}
        {#snippet contents()}
            <div class="mx-4 my-2">
                {#await uploading}
                    <div
                        class="p-4 bg-blue-100 rounded-lg flex flex-col md:flex-row items-center"
                    >
                        <span class="mr-2 grow mb-4 md:mb-0">
                            Uploading your image...</span
                        >
                    </div>
                {/await}
                {#if file}
                    {#await loading}
                        <div
                            class="p-4 bg-purple-100 rounded-lg flex flex-col md:flex-row items-center"
                        >
                            <span class="mr-2 grow mb-4 md:mb-0">
                                Previewing your image...</span
                            >
                        </div>
                    {:then _}
                        <LocalImage
                            class="w-full"
                            alt={file.name}
                            src={loadedContent}
                        />
                    {/await}
                {:else}
                    <div
                        class="p-4 bg-blue-100 rounded-lg flex flex-col md:flex-row items-center"
                    >
                        <span class="mr-2 grow mb-4 md:mb-0">
                            Your image will appear as a preview here.</span
                        >
                    </div>
                {/if}
            </div>{/snippet}
    </ContainerWithSidebar>
</form>

<svelte:window onpaste={onPaste} />
