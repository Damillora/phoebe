<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import {
        getUserProfile,
        updateToken,
        updateUserProfile,
    } from "$lib/api/client";
    import UserActionsPanel from "$lib/components/UserActionsPanel.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import ContainerWithSidebar from "$lib/iuno/components/layout/ContainerWithSidebar.svelte";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    import { onMount } from "svelte";

    let { data } = $props();
    let updated: LoadingState = $state();
    let loading: LoadingState = $state();

    let form = $state({
        email: "",
        username: "",
    });

    const submitForm = async () => {
        updated = updateUserProfile({
            email: form.email,
            username: form.username,
        }).then(() => updateToken());
        await updated;
        invalidateAll();
    };
    const getData = async () => {
        const user = await getUserProfile();
        form.email = user.email;
        form.username = user.username;
    };
    onMount(() => {
        loading = getData();
    });
</script>

<ContainerWithSidebar>
    {#snippet sidebar()}
        <div class="mx-4 my-2 flex flex-col">
            <UserActionsPanel />
        </div>
    {/snippet}
    {#snippet contents()}
        <form onsubmit={submitForm}>
            <div class="rounded-lg px-4 mb-4">
                <div class="flex flex-row items-center rounded-lg">
                    <div
                        class="py-2 font-medium grow my-2 mr-2 text-blue-800 rounded-lg"
                    >
                        User Profile
                    </div>
                    <div class="bg-gray-100 rounded-lg">
                        <NavButton class="mr-1" type="submit">Edit</NavButton>
                    </div>
                </div>
                {#if updated}
                    {#await updated then _}
                        <div class="p-4 bg-green-100 rounded-lg mb-4">
                            Profile updated!
                        </div>
                    {/await}
                {/if}
                <div>
                    <Label for="url">Email</Label>
                    <Input class="mb-4 w-full">
                        <TextInput
                            type="email"
                            name="email"
                            bind:value={form.email}
                        />
                    </Input>
                    <Label for="url">Username</Label>
                    <Input class="mb-4 w-full">
                        <TextInput
                            type="text"
                            name="username"
                            bind:value={form.username}
                        />
                    </Input>
                </div>
            </div>
        </form>
    {/snippet}
</ContainerWithSidebar>
