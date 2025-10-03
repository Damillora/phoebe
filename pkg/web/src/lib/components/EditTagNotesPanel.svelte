<script lang="ts">
    import { onMount } from "svelte";
    import { updateTagNotes } from "$lib/api/client";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    import Label from "$lib/iuno/components/form/Label.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";

    let { tag, onModeChange, onSubmit } = $props();

    let form = $state({
        note: "",
    });
    let editNotesLoading: LoadingState = $state();

    const getData = async () => {
        form.note = tag.tagNote;
    };

    const onFormSubmit = async (e: Event) => {
        e.preventDefault();
        editNotesLoading = updateTagNotes({ id: tag, ...form });
        onModeChange();

        onSubmit();
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
                Edit Notes
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
            <Label for="name">Notes</Label>
            <Input class="mb-4 w-full">
                <textarea
                    bind:value={form.note}
                    class="px-2 py-2 h-16 focus-within:outline-none w-full"
                ></textarea>
            </Input>
        </div>
    </div>
</form>
