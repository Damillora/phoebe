<script lang="ts">
    import { getTagAutocomplete, postUpdate } from "$lib/api/client";
    import type { TagListItem } from "$lib/api/response";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    import TagsInput from "$lib/iuno/components/form/TagsInput.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    import { onAutocompletePositive } from "$lib/utils/autocomplete";
    import { quadInOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";

    interface Props {
        onModeChange: any;
        post: any;
        onSubmit: any;
    }

    let { onModeChange, post, onSubmit }: Props = $props();

    let editing: LoadingState = $state();

    let form: {
        source_url: "";
        tags: string[];
    } = $state({
        source_url: post.source_url,
        tags: post.tags.map((x: TagListItem) => x.tagType + ":" + x.tagName),
    });

    const onTagChange = (tags: string[]) => {
        form.tags = tags;
    };

    const onAutocomplete = async (tag: string) => {
        const list = await getTagAutocomplete({ tag, positive: true });
        return list;
    };

    const onFormSubmit = async (e: Event) => {
        e.preventDefault();
        editing = postUpdate({ id: post.id, ...form });
        onModeChange();
        onSubmit();
    };
</script>

<form onsubmit={onFormSubmit}>
    <div class="rounded-lg px-4 mb-4">
        <div class="flex flex-row items-center rounded-lg">
            <div
                class="py-2 font-medium grow my-2 mr-2 text-yellow-800 rounded-lg"
            >
                Edit Post
            </div>
            <div class="bg-gray-100 rounded-lg">
                <NavButton class="mr-1" type="submit">Edit</NavButton>
                <NavButton
                    danger
                    onclick={(e: Event) => {
                        e.preventDefault();
                        onModeChange();
                    }}>Cancel</NavButton
                >
            </div>
        </div>
        <div>
            <Label for="url">Source</Label>
            <Input class="mb-4 w-full">
                <TextInput type="url" name="url" bind:value={form.source_url} />
            </Input>
            <Label for="tags">Tags</Label>
            <Input class="mb-4 w-full">
                <TagsInput
                    name="tags"
                    value={form.tags}
                    ontagchange={onTagChange}
                    onautocomplete={onAutocompletePositive}
                />
            </Input>
        </div>
    </div>
</form>
