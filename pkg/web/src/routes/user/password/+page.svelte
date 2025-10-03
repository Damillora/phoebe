<script lang="ts">
    import { updateToken, updateUserPassword } from "$lib/api/client";
    import UserActionsPanel from "$lib/components/UserActionsPanel.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import ContainerWithSidebar from "$lib/iuno/components/layout/ContainerWithSidebar.svelte";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    let loading: LoadingState = $state();
    let updated: LoadingState = $state();

    let form = $state({
        old_password: "",
        new_password: "",
    });
    const submitForm = async () => {
        updated = updateUserPassword({
            old_password: form.old_password,
            new_password: form.new_password,
        }).then(() => updateToken());
    };
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
                        Change Password
                    </div>
                    <div class="bg-gray-100 rounded-lg">
                        <NavButton class="mr-1" type="submit">Change</NavButton>
                    </div>
                </div>
                {#if updated}
                    {#await updated then _}
                        <div class="p-4 bg-green-100 rounded-lg mb-4">
                            Password changed!
                        </div>
                    {/await}
                {/if}
                <div>
                    <Label for="url">Old Password</Label>
                    <Input class="mb-4 w-full">
                        <TextInput
                            type="password"
                            name="oldPassword"
                            bind:value={form.old_password}
                        />
                    </Input>
                    <Label for="url">New Password</Label>
                    <Input class="mb-4 w-full">
                        <TextInput
                            type="password"
                            name="newPassword"
                            bind:value={form.new_password}
                        />
                    </Input>
                </div>
            </div>
        </form>
    {/snippet}
</ContainerWithSidebar>
