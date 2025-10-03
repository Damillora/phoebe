<script>
    import NavLink from "$lib/iuno/components/nav/NavLink.svelte";
    import { page } from "$app/state";
</script>

<NavLink
    class="mb-1"
    active={page.url.pathname === "/user/profile"}
    href="/user/profile">Profile</NavLink
>
<NavLink
    class="mb-1"
    active={page.url.pathname === "/user/password"}
    href="/user/password">Change Password</NavLink
>
