<script lang="ts">
    let { children } = $props();
</script>

<div class="mx-4 my-2 flex flex-col items-center">
    <div class="rounded-lg bg-gray-100">
        {@render children?.()}
    </div>
</div>
