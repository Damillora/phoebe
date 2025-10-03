<script lang="ts">
    import { login } from "$lib/api/client";
    import { goto } from "$app/navigation";
    import ScreenCenteredContainer from "$lib/iuno/components/layout/ScreenCenteredContainer.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import Button from "$lib/iuno/components/form/Button.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    let form = $state({
        username: "",
        password: "",
    });
    let error = $state("");

    const doLogin = async (e: Event) => {
        e.preventDefault();
        error = "";
        try {
            await login(form);
            goto("/");
        } catch (e: any) {
            error = "We had trouble logging you in";
            if ("message" in e) {
                error = e.message;
            }
            return;
        }
    };
</script>

<ScreenCenteredContainer>
    <h1 class="text-3xl font-bold mb-4 text-left">Login</h1>
    <form onsubmit={doLogin}>
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

        <Button class="w-full mb-4" type="submit">Login</Button>
        {#if error}
            <p class="text-red-500 font-medium text-lg">{error}</p>
        {/if}
    </form>
</ScreenCenteredContainer>
