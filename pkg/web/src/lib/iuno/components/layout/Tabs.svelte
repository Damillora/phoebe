<script lang="ts">
    import type { Snippet } from "svelte";
    import NavButton from "../nav/NavButton.svelte";

    let { margin = true, tabs, contents, class: className = "" } = $props();

    let currentTab = $state(0);
    const changeTab = (tab: number) => {
        currentTab = tab;
    };
</script>

<div class="flex flex-row mx-4 my-2">
    <div class="bg-gray-100 rounded-lg">
        {#each tabs as tab, i}
            <NavButton
                active={currentTab === i}
                onclick={() => changeTab(i)}
                class={i > 0 ? "ml-1" : ""}
            >
                {tab}
            </NavButton>
        {/each}
    </div>
</div>

<div class:mx-4={margin} class:my-2={margin} class={className}>
    {@render contents?.(currentTab)}
</div>
