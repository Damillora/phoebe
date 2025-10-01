<script lang="ts">
    import "./app.scss";
    import Navbar from "$lib/components/ui/Navbar.svelte";
    import Footer from "$lib/components/ui/Footer.svelte";
    import { access_token, refresh_token } from "$lib/stores";
    import { get } from "svelte/store";
    import { isTokenExpired } from "$lib/login-check";
    import { updateToken } from "$lib/api";
    import { afterNavigate, beforeNavigate } from "$app/navigation";

    afterNavigate(async () => {
        let refresh = get(refresh_token);
        let access = get(access_token);
        if (!isTokenExpired(refresh) && isTokenExpired(access)) {
            await updateToken();
        }
    });

    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();
</script>

<svelte:head>
    <title>phoebe</title>
</svelte:head>

<Navbar />

{@render children?.()}

<Footer />
