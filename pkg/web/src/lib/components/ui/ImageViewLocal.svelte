<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let { alt, src } = $props();
</script>

<figure>
    <img {src} {alt} />
</figure>
