<script>
    import { access_token, refresh_token } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    onMount(() => {
        access_token.set("");
        refresh_token.set("");
        goto("/");
    });
</script>
