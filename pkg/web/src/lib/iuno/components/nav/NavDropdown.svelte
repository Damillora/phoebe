<script lang="ts">
    let { class: className = "", children, dropdownList } = $props();
    import { fade, fly } from "svelte/transition";
    let isDropdownVisible = $state(false);
</script>

<div class="relative">
    <button
        class="w-full py-2 px-4 rounded-lg hover:bg-blue-200 cursor-pointer text-left flex flex-row items-center transition-colors {className}"
        class:bg-blue-100={isDropdownVisible}
        class:text-blue-800={isDropdownVisible}
        onclick={() => {
            isDropdownVisible = !isDropdownVisible;
        }}
    >
        {@render children?.()}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6 ml-2"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
        </svg>
    </button>
    {#if isDropdownVisible}
        <div
            class="absolute top-12 w-full md:min-w-64 right-0 md:px-0 flex flex-col bg-gray-100 rounded-lg *:w-full transition-all"
            transition:fade={{
                duration: 50,
            }}
        >
            {@render dropdownList?.()}
        </div>
    {/if}
</div>
