<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let { alt, src, class: className = "" } = $props();
    let loading = $state(false);
    let failed = $state(false);

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
    <figure class={className} class:bg-gray-300={loading}>
        <img class="w-full" {src} {alt} />
    </figure>
{:else}
    <div class="bg-red-300">There was an error loading this image.</div>
{/if}
