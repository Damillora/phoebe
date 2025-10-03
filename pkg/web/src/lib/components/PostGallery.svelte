<script lang="ts">
    import { onMount } from "svelte";
    import Image from "$lib/iuno/components/image/Image.svelte";
    import { fly } from "svelte/transition";

    let { posts = [], class: className = "" } = $props();
</script>

<div class="flex flex-row items-center flex-wrap {className}">
    {#each posts as post, i (post.id)}
        <div class="w-full sm:w-1/2 md:w-1/4 rounded-lg mb-2">
            <a
                class="block rounded-lg p-2 hover:bg-blue-200 transition-colors"
                href="/post/{post.id}"
            >
                <Image
                    class="w-full rounded-lg overflow-hidden"
                    alt={post.id}
                    src={post.thumbnail_path}
                />
            </a>
        </div>
    {/each}
</div>
