<script lang="ts">
    let { children, class: className = "" } = $props();
</script>

<div
    class="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center p-8 {className}"
>
    <div class="text-center lg:w-3/4 xl:w-1/2 bg-white p-8 rounded-lg">
        {@render children?.()}
    </div>
</div>
