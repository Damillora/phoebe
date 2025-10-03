<script lang="ts">
    import { goto } from "$app/navigation";
    import logo from "$lib/assets/phoebe-logo.svg";
    import Button from "$lib/iuno/components/form/Button.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import InputButton from "$lib/iuno/components/form/InputButton.svelte";
    import TagsInput from "$lib/iuno/components/form/TagsInput.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import ScreenCenteredContainer from "$lib/iuno/components/layout/ScreenCenteredContainer.svelte";
    import { onAutocomplete } from "$lib/utils/autocomplete";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let searchTerms: string[] = $state([]);

    const onTagChange = (tags: string[]) => {
        searchTerms = tags;
    };

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        if (searchTerms.length > 0) {
            goto(`/posts?tags=${searchTerms.join("+")}`);
        } else {
            goto(`/posts`);
        }
    };
</script>

<ScreenCenteredContainer>
    <figure class="w-32 mx-auto mb-2">
        <img alt="phoebe logo" src={logo} />
    </figure>
    <h1 class="text-3xl font-bold mb-2 text-blue-800">phoebe</h1>
    <p class="text-lg mb-8">a booru-style image gallery and organizer</p>

    <form onsubmit={onSubmit}>
        <Input class="w-full mb-4">
            <TagsInput
                class="w-full"
                value={searchTerms}
                ontagchange={onTagChange}
                onautocomplete={onAutocomplete}
            />
            <InputButton type="submit" aria-label="Search">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
            </InputButton>
        </Input>
    </form>
    {#await data.postCount then response}
        <p class="block">
            serving <span class="is-primary"
                ><strong>{response.postCount}</strong></span
            > images
        </p>
    {/await}
</ScreenCenteredContainer>
