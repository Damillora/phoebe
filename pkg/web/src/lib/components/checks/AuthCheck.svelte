<script lang="ts">
    import { access_token } from "$lib/stores";
    import { isTokenExpired } from "$lib/login-check";
    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();

    let loggedIn = $state(false);
    access_token.subscribe((value) => {
        loggedIn = !isTokenExpired(value);
    });
</script>

{#if loggedIn == true}
    {@render children?.()}
{/if}
