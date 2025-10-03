<script lang="ts">
    let {
        primary = false,
        children,
        class: className = "",
        ...restProps
    } = $props();
</script>

<button
    class="cursor-pointer hover:bg-blue-200 rounded-r-lg transition-colors px-2 {className}"
    class:bg-blue-800={primary}
    class:hover:bg-blue-600={primary}
    class:text-white={primary}
    {...restProps}
>
    {@render children?.()}
</button>
