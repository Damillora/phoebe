<script lang="ts">
    import { register } from "$lib/api/client";
    import { goto } from "$app/navigation";
    import ScreenCenteredContainer from "$lib/iuno/components/layout/ScreenCenteredContainer.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import Button from "$lib/iuno/components/form/Button.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    let form = $state({
        username: "",
        password: "",
        email: "",
    });
    let error = $state("");
    async function doRegister(e: Event) {
        e.preventDefault();
        try {
            const tokenData = await register(form);
            goto("/");
        } catch (error) {
            error = "We had trouble registering you";
        }
    }
</script>

<ScreenCenteredContainer>
    <h1 class="text-3xl font-bold mb-4 text-left">Register</h1>
    <form onsubmit={doRegister}>
        <Label for="email">Email</Label>
        <Input class="mb-4 w-full">
            <TextInput type="email" name="email" bind:value={form.email} />
        </Input>
        <Label for="username">Username</Label>
        <Input class="mb-4 w-full">
            <TextInput name="username" bind:value={form.username} />
        </Input>
        <Label for="password">Password</Label>
        <Input class="mb-8 w-full">
            <TextInput
                type="password"
                name="password"
                bind:value={form.password}
            />
        </Input>

        <Button class="w-full mb-4" type="submit">Register</Button>
        {#if error}
            <p class="text-red-500 font-medium text-lg">{error}</p>
        {/if}
    </form>
</ScreenCenteredContainer>
