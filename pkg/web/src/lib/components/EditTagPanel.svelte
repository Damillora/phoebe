<script lang="ts">
    import { onMount } from "svelte";

    import { getTagTypes, updateTag } from "$lib/api/client";
    import { goto } from "$app/navigation";
    import type { TagTypeListItem } from "$lib/api/response";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";

    let { tag, onModeChange, onSubmit } = $props();
    let oldTagName = $state(tag.tagName);
    let tagTypes: TagTypeListItem[] = $state([]);
    let form = $state({
        name: tag.tagName,
        tagTypeId: 1,
    });
    let editTagLoading: LoadingState = $state();

    const getData = async () => {
        tagTypes = await getTagTypes();
        form.name = tag.tagName;
        let tagType = tagTypes.filter((x) => x.name == tag.tagType);
        form.tagTypeId = tagType[0].id;
    };

    const onFormSubmit = async (e: Event) => {
        e.preventDefault();
        console.log(form);
        editTagLoading = updateTag({
            id: oldTagName,
            name: form.name,
            tagTypeId: form.tagTypeId,
        });
        await editTagLoading;
        onSubmit(form.name);
    };

    onMount(() => {
        getData();
    });
</script>

<form onsubmit={onFormSubmit}>
    <div class="rounded-lg px-4 mb-4">
        <div class="flex flex-row items-center rounded-lg">
            <div
                class="py-2 font-medium grow my-2 mr-2 text-yellow-800 rounded-lg"
            >
                Edit Tag
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
            <Label for="name">Name</Label>
            <Input class="mb-4 w-full">
                <TextInput type="name" name="name" bind:value={form.name} />
            </Input>
            <Label for="tagType">Tag Type</Label>
            <Input class="mb-4 w-full">
                <select bind:value={form.tagTypeId} class="py-2 px-2 w-full">
                    {#each tagTypes as tagType}
                        <option
                            value={tagType.id}
                            selected={form.tagTypeId === tagType.id}
                        >
                            {tagType.name}
                        </option>
                    {/each}
                </select>
            </Input>
        </div>
    </div>
</form>
