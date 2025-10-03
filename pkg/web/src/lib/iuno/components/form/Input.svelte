<script>
    let { children, class: className = "", ...restProps } = $props();
</script>

<div
    class="group rounded-lg bg-gray-100 focus-within:bg-blue-100 focus-within:ring focus-within:ring-blue-800 transition-all flex flex-row cursor-text {className}"
    {...restProps}
>
    {@render children?.()}
</div>
