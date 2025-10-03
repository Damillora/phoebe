<script lang="ts">
    let {
        href,
        class: className = "",
        active = false,
        children,
        ...restProps
    } = $props();
</script>

<a
    {href}
    class="inline-block py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors {className}"
    class:bg-blue-100={active}
    class:text-blue-800={active}
    {...restProps}
>
    {@render children?.()}
</a>
