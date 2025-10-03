<script lang="ts">
    import { postDelete } from "$lib/api/client";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";

    let { id, onModeChange, onSubmit } = $props();
    let deleteLoading: LoadingState = $state();

    const deletePost = async (e: Event) => {
        e.preventDefault();
        deleteLoading = postDelete({ id });
        onModeChange();
        let success = await deleteLoading;
        onSubmit(success);
    };
</script>

<form onsubmit={deletePost}>
    <div class="rounded-lg px-4 mb-4">
        <div class="flex flex-row items-center rounded-lg">
            <div
                class="py-2 font-medium grow my-2 mr-2 text-red-800 rounded-lg"
            >
                Delete Post
            </div>
            <div class="bg-gray-100 rounded-lg">
                <NavButton type="submit" danger class="mr-1">Delete</NavButton>
                <NavButton
                    onclick={(e: Event) => {
                        e.preventDefault();
                        onModeChange();
                    }}>Cancel</NavButton
                >
            </div>
        </div>
        <div class="py-4 mb-4 rounded-lg">
            Are you sure to <span class="text-red-800 font-medium"
                >delete this post?</span
            >
        </div>
    </div>
</form>
