<script lang="ts">
    import { postDelete } from "$lib/api";

    let { id, toggleDeleteMenu, onDelete } = $props();
    let deleteLoading: LoadingState = $state();

    const deletePost = async (e: Event) => {
        e.preventDefault();
        deleteLoading = postDelete({ id });
        toggleDeleteMenu(e);
        let success = await deleteLoading;
        onDelete(success);
    };
</script>

<div class="block">
    <div class="panel is-danger">
        <p class="panel-heading">Delete Post</p>
        {#if !deleteLoading}
            <div class="panel-block">
                Are you sure to delete post {id}?
            </div>
            <div class="panel-block column">
                <button onclick={deletePost} class="button is-danger"
                    >Delete</button
                >
                <button class="button" onclick={toggleDeleteMenu}>Cancel</button
                >
            </div>
        {:else}
            <div class="panel-block column">
                <progress class="progress is-small is-danger" max="100"
                ></progress>
            </div>
        {/if}
    </div>
</div>
