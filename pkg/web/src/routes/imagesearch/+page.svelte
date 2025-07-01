<script lang="ts">
    import { getTagAutocomplete, searchBlob } from "$lib/api";
    import PostGallery from "$lib/components/ui/PostGallery.svelte";
    import ImageView from "$lib/components/ui/ImageView.svelte";
    import { paginate } from "$lib/simple-pagination";
    import ImageViewLocal from "$lib/components/ui/ImageViewLocal.svelte";
    import { handlePaste } from "$lib/paste";

    let uploading = $state(false);

    let file: File | undefined = $state();
    let fileName = $state("");
    let contentsUrl = $state("");
    let similar: BlobSimilarListItem[] | null = $state(null);
    let similarCount = $state(0);
    let loading: LoadingStateWithResponse<BlobSimilarListResponse> = $state();

    let form = $state({
        blob_id: "",
        source_url: "",
        tags: [],
    });

    const onPaste = async (e: any) => {
        file = await handlePaste(e);
        await handleFileChange();
    };
    const onFileChange = async (e: any) => {
        file = e.target.files[0];
        await handleFileChange();
    };
    const handleFileChange = async () => {
        if (file) {
            fileName = file.name;
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                contentsUrl = reader.result as string;
            });
            reader.readAsDataURL(file);
            similar = [];
            loading = searchBlob({ file });
            const response = await loading;
            similar = response.similar;
            similarCount = similar?.length ?? 0;
        }
    };
</script>

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-one-third">
                <div class="panel is-primary">
                    <form>
                        <p class="panel-heading">Image Search</p>
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
                                                    name="resume"
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
                        {#if fileName}
                            <div class="panel-block column">
                                <ImageViewLocal
                                    alt={fileName}
                                    src={contentsUrl}
                                />
                            </div>
                        {/if}
                    </form>
                </div>
            </div>
            <div class="column is-two-thirds">
                {#await loading}
                    <div class="notification is-info">
                        Searching for similar images...
                    </div>
                {:then _}
                    {#if similar}
                        {#if similarCount > 0}
                            <div class="block">
                                <div class="notification is-success">
                                    Found {similarCount} similar posts.
                                </div>
                            </div>
                        {:else}
                            <div class="block">
                                <div class="notification is-warning">
                                    Found no similar posts.
                                </div>
                            </div>
                        {/if}
                    {:else}
                        <div class="notification is-primary">
                            Similar posts will appear here.
                        </div>
                    {/if}
                {/await}
                <div class="columns is-multiline">
                    {#await loading}
                        <div class="column">
                            <div class="skeleton-block"></div>
                        </div>
                    {:then _}
                        {#if similar && similarCount > 0}
                            <div class="column is-full">
                                <PostGallery posts={similar} />
                            </div>
                        {/if}
                    {/await}
                </div>
            </div>
        </div>
    </div>
</section>

<svelte:window onpaste={onPaste} />
