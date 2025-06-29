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
    import { handlePaste } from "$lib/paste";

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
        file = await handlePaste(e);
        fileName = "";
        similar = [];
        await handleFileChange();
    };

    const onFileChange = async (e) => {
        file = e.target.files[0];
        fileName = "";
        similar = [];
        await handleFileChange();
    };

    const handleFileChange = async () => {
        if (file) {
            loading = true;
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
        var blobResponse = await uploadBlob({ file });
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
                                disabled={uploading || similarLoading}
                                >Submit</button
                            >
                        </div>
                    </form>
                </div>
            </div>
            <div class="column is-two-thirds">
                <div class="block">
                    {#if fileName}
                        {#if uploading}
                            <div class="notification is-info">
                                Uploading post...
                            </div>
                        {:else if similarLoading}
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
                {:else if loading}
                    <div class="skeleton-block"></div>
                {/if}
            </div>
        </div>
    </div>
</section>

<svelte:window onpaste={onPaste} />
