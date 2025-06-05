<script lang="ts">
    import "../app.scss";
    import Navbar from "$lib/components/ui/Navbar.svelte";
    import Footer from "$lib/components/ui/Footer.svelte";
    import { apiUrl } from "$lib/stores";
    import { get } from "svelte/store";
    import { afterNavigate, goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { isDesktop } from "$lib/desktop-check";
    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();

    let is_desktop = isDesktop();

    afterNavigate(() => {
        if (is_desktop) {
            let url = get(apiUrl);

            if (!url && $page.url.pathname !== "/desktop/settings") {
                console.log($page.url.pathname);
                goto("/desktop/settings");
            }
        }
    });
</script>

<svelte:head>
    <title>phoebe</title>
</svelte:head>

<Navbar />

{@render children?.()}

<Footer />
