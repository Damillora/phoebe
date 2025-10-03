<script lang="ts">
    let { children, class: className = "", ...restProps } = $props();
</script>

<footer
    class="min-h-16 text-center bg-gray-100 py-4 my-auto flex flex-col justify-center {className}"
>
    {@render children?.()}
</footer>
