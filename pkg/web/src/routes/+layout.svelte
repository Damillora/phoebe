<script lang="ts">
    import "./app.css";
    import logo from "$lib/assets/phoebe-logo.svg";
    import { access_token, refresh_token } from "$lib/stores";
    import { get } from "svelte/store";
    import { getUsernameFromToken, isTokenExpired } from "$lib/login-check";
    import { updateToken } from "$lib/api/client";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import Footer from "$lib/iuno/components/layout/Footer.svelte";
    import Nav from "$lib/iuno/components/nav/Nav.svelte";
    import NavLink from "$lib/iuno/components/nav/NavLink.svelte";
    import type { LayoutData } from "./$types";
    import NavDropdown from "$lib/iuno/components/nav/NavDropdown.svelte";
    const tokenUpdate = async () => {
        let refresh = get(refresh_token);
        let access = get(access_token);
        if (!isTokenExpired(refresh) && isTokenExpired(access)) {
            await updateToken();
        }
    };
    let access = get(access_token);
    let loggedIn = $state(!isTokenExpired(access));
    let username = $state(getUsernameFromToken(access));
    access_token.subscribe((value) => {
        loggedIn = !isTokenExpired(value);
    });
    access_token.subscribe((value) => {
        username = getUsernameFromToken(value);
    });

    interface Props {
        children?: import("svelte").Snippet;
        data: LayoutData;
    }

    afterNavigate(() => tokenUpdate());

    let { children, data }: Props = $props();
</script>

<Nav>
    {#snippet logoItem()}
        <!-- <img src={logo} class="h-8 mr-2" alt="phoebe-logo" /> -->
        <span class="text-lg"> phoebe</span>
    {/snippet}
    {#snippet centerItems()}
        <NavLink href="/posts">Posts</NavLink>
        <NavLink href="/tags">Tags</NavLink>
        <NavLink href="/imagesearch">Image Search</NavLink>
        {#if loggedIn}
            <NavLink href="/upload">Upload</NavLink>
        {/if}
    {/snippet}
    {#snippet rightItems()}
        {#if loggedIn}
            <NavDropdown>
                {username}
                {#snippet dropdownList()}
                    <NavLink href="/user/profile">Profile</NavLink>
                    <NavLink href="/user/password">Change Password</NavLink>
                    <NavLink href="/auth/logout">Logout</NavLink>
                {/snippet}
            </NavDropdown>
        {:else}
            <NavDropdown>
                {username}
                {#snippet dropdownList()}
                    <NavLink href="/auth/login">Login</NavLink>
                {/snippet}
            </NavDropdown>
        {/if}
    {/snippet}
</Nav>
<svelte:head>
    <title>phoebe</title>
</svelte:head>
<div class="min-h-[calc(100vh-4rem)]">
    {@render children?.()}
</div>

<Footer>
    <p>
        <strong class="text-blue-800 hover:text-blue-600">
            <a href="https://github.com/Damillora/phoebe">phoebe</a>
        </strong>
        : a booru-style image gallery and organizer
    </p>
</Footer>
