<script lang="ts">
    let {
        sidebar = undefined,
        contents = undefined,
        reverse = false,
        class: className = "",
    } = $props();
</script>

<div
    class="flex lg:flex-row {className}"
    class:flex-col-reverse={reverse}
    class:flex-col={!reverse}
>
    <div
        class="relative w-full lg:w-1/3 2xl:w-1/4 flex flex-col min-h-[calc(100vh-4rem)] pb-8"
    >
        {@render sidebar?.()}
    </div>
    <div
        class="relative w-full lg:w-2/3 2xl:w-3/4 flex flex-col min-h-[calc(100vh-4rem)] pb-8"
    >
        {@render contents?.()}
    </div>
</div>
