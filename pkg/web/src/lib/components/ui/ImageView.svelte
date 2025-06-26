<script>
    import { apiUrl } from "$lib/stores";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let { alt, src } = $props();
    let loading = $state(false);
    let failed = $state(false);

    let url = get(apiUrl);

    onMount(() => {
        const img = new Image();
        img.src = src;
        loading = true;

        img.onload = () => {
            loading = false;
            failed = false;
        };
        img.onerror = () => {
            loading = true;
            failed = true;
        };
    });
</script>

{#if !failed}
    <figure class:is-skeleton={loading}>
        <img src={url + src} {alt} />
    </figure>
{:else}
    <div class="notification is-danger is-light">
        There was an error loading this image.
    </div>
{/if}
