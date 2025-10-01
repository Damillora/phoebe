<script>
    import { access_token } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    onMount(() => {
        access_token.set("");
        goto("/");
    });
</script>
