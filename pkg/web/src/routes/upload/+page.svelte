<script>
    import {
        uploadBlob,
        postCreate,
        getTagAutocomplete,
        searchBlob,
    } from "$lib/api";
    import { goto } from "$app/navigation";
    import Tags from "svelte-tags-input";
    import AuthRequired from "$lib/components/checks/AuthRequired.svelte";
    import ImageView from "$lib/components/ui/ImageView.svelte";
    import ImageViewLocal from "$lib/components/ui/ImageViewLocal.svelte";

    let currentProgress = $state(0);
    let similarityProgress = $state(0);

    let fileName = $state("");
    let file = $state();
    let contentsUrl = $state("");
    let similar = $state([]);
    let loading = $state(false);
    let uploading = $state(false);
    let similarLoading = $state(false);

    let form = $state({
        blob_id: "",
        source_url: "",
        tags: [],
    });

    const onPaste = async (e) => {
        if (e.clipboardData.files[0]) {
            loading = true;
            file = e.clipboardData.files[0];
            fileName = "";
            similar = [];
            await handleFileChange();
        }
    };
    const onProgress = (e) => {
        var percentCompleted = Math.round((e.loaded * 100) / e.total);
        currentProgress = percentCompleted;
    };
    const onSimilarityProgress = (e) => {
        var percentCompleted = Math.round((e.loaded * 100) / e.total);
        similarityProgress = percentCompleted;
    };
    const onFileChange = async (e) => {
        loading = true;
        file = e.target.files[0];
        fileName = "";
        similar = [];
        await handleFileChange();
    };

    const handleFileChange = async () => {
        if (file) {
            similarLoading = true;
            fileName = file.name;
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                contentsUrl = reader.result ?? "";
                loading = false;
            });
            reader.readAsDataURL(file);
            var similarResponse = await searchBlob({
                file,
                onProgress: onSimilarityProgress,
            });
            if (similarResponse.similar) {
                similar = similarResponse.similar;
            }
            similarLoading = false;
        }
    };

    const onTagChange = (value) => {
        form.tags = value.detail.tags;
    };

    const onAutocomplete = async (tag) => {
        const list = await getTagAutocomplete({ tag, positive: true });
        return list;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        uploading = true;
        if (similarLoading) return;
        var blobResponse = await uploadBlob({ file, onProgress });
        form.blob_id = blobResponse.id;
        const response = await postCreate(form);
        uploading = false;
        goto(`/post/${response.id}`);
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
                                                        Choose a file or paste
                                                        your image...
                                                    </span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {#if currentProgress > 0 && currentProgress < 100}
                            <div class="panel-block column">
                                <progress
                                    class="progress is-primary is-small"
                                    value={currentProgress}
                                    max="100"
                                >
                                    {currentProgress}%
                                </progress>
                            </div>
                        {/if}
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
                                disabled={uploading}>Submit</button
                            >
                        </div>
                    </form>
                </div>
            </div>
            <div class="column is-two-thirds">
                <div class="block">
                    {#if fileName}
                        {#if similarLoading}
                            <div class="notification is-info">
                                Searching for similar images...
                            </div>
                        {:else if similar.length > 0}
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
                    {:else if currentProgress > 0 && currentProgress < 100}
                        <div class="notification is-info">
                            Your image is currently uploading...
                        </div>
                    {:else}
                        <div class="notification is-primary">
                            Your image preview will appear here.
                        </div>
                    {/if}
                </div>
                {#if fileName}
                    <div class="box">
                        <figure class="image">
                            <ImageViewLocal alt={fileName} src={contentsUrl} />
                        </figure>
                    </div>
                {:else if loading && !(currentProgress > 0 && currentProgress < 100)}
                    <div class="skeleton-block"></div>
                {/if}
            </div>
        </div>
    </div>
</section>

<svelte:window onpaste={onPaste} />
