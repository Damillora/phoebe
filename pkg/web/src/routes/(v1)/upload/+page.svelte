<script lang="ts">
    import {
        uploadBlob,
        postCreate,
        getTagAutocomplete,
        searchBlob,
    } from "$lib/api";
    import { goto } from "$app/navigation";
    import Tags from "svelte-tags-input";
    import AuthRequired from "$lib/components/checks/AuthRequired.svelte";
    import ImageViewLocal from "$lib/components/ui/ImageViewLocal.svelte";
    import { handlePaste } from "$lib/paste";
    import { readFileAsDataUrl } from "$lib/common";

    let fileName = $state("");
    let file: File | undefined = $state();
    let contentsUrl = $state("");
    let similar: BlobSimilarListItem[] = $state([]);
    let loading: LoadingState = $state();
    let uploading: LoadingState = $state();
    let similarLoading: LoadingStateWithResponse<BlobSimilarListResponse> =
        $state();

    let form = $state({
        blob_id: "",
        source_url: "",
        tags: [],
    });

    const onPaste = async (e: any) => {
        const pastedFile = await handlePaste(e);
        if (pastedFile) {
            file = pastedFile;
            fileName = "";
            similar = [];
            await handleFileChange();
        }
    };

    const onFileChange = async (e: any) => {
        file = e.target.files[0];
        fileName = "";
        similar = [];
        await handleFileChange();
    };

    const handleFileChange = async () => {
        if (file) {
            fileName = file.name;
            loading = readFileAsDataUrl(file);
            contentsUrl = await loading;
            similarLoading = searchBlob({
                file,
            });
            var similarResponse = await similarLoading;
            if (similarResponse.similar) {
                similar = similarResponse.similar;
            }
        }
    };

    const onTagChange = (value: any) => {
        form.tags = value.detail.tags;
    };

    const onAutocomplete = async (tag: string) => {
        const list = await getTagAutocomplete({ tag, positive: true });
        return list;
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
</script>

<AuthRequired />

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-one-third">
                <div class="panel is-primary">
                    <form onsubmit={onSubmit}>
                        <p class="panel-heading">Upload Image</p>
                        <div class="panel-block column">
                            <div class="row">
                                <label for="file" class="label">Image:</label>
                            </div>
                            <div class="row">
                                <div class="field">
                                    <div class="control">
                                        <div class="file">
                                            <label class="file-label">
                                                <input
                                                    id="file"
                                                    class="file-input"
                                                    type="file"
                                                    onchange={onFileChange}
                                                />
                                                <span class="file-cta">
                                                    <span class="file-label">
                                                        Upload an image...
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <p class="help">
                                        ...or paste your image here.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="panel-block column">
                            <div class="row">
                                <label for="source" class="label"
                                    >Source URL:</label
                                >
                            </div>
                            <div class="row">
                                <div class="field">
                                    <div class="control">
                                        <input
                                            id="source"
                                            class="input"
                                            type="url"
                                            placeholder="Source URL"
                                            bind:value={form.source_url}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-block column">
                            <div class="row">
                                <label for="tags" class="label">Tags</label>
                            </div>
                            <div class="row">
                                <div class="field">
                                    <div class="control" id="tags">
                                        <Tags
                                            tags={form.tags}
                                            addKeys={[9, 32]}
                                            on:tags={onTagChange}
                                            autoComplete={onAutocomplete}
                                            autoCompleteFilter={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-block column">
                            <button
                                type="submit"
                                class="button is-primary is-fullwidth is-outlined"
                                disabled={file == null}>Submit</button
                            >
                        </div>
                    </form>
                </div>
            </div>
            <div class="column is-two-thirds">
                <div class="block">
                    {#if fileName}
                        {#await uploading}
                            <div class="notification is-info">
                                Uploading post...
                            </div>
                        {/await}
                        {#await similarLoading}
                            <div class="notification is-info">
                                Searching for similar images...
                            </div>
                        {:then _}
                            {#if similar.length > 0}
                                <div class="notification is-warning">
                                    There are similar images existing:
                                    {#each similar as post, i}
                                        <a href="/post/{post.id}">{post.id}</a>
                                        {#if i < similar.length - 1}
                                            ,
                                        {/if}
                                    {/each}
                                </div>
                            {:else}
                                <div class="notification is-success">
                                    No similar images found.
                                </div>
                            {/if}
                        {/await}
                    {:else}
                        <div class="notification is-primary">
                            Your image preview will appear here.
                        </div>
                    {/if}
                </div>
                {#await loading}
                    <div class="skeleton-block"></div>
                {:then _}
                    {#if fileName}
                        <div class="box">
                            <figure class="image">
                                <ImageViewLocal
                                    alt={fileName}
                                    src={contentsUrl}
                                />
                            </figure>
                        </div>
                    {/if}
                {/await}
            </div>
        </div>
    </div>
</section>

<svelte:window onpaste={onPaste} />
