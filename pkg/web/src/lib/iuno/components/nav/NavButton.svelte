<script lang="ts">
    let {
        onclick = undefined,
        active = false,
        class: className = "",
        children,
        disabled = false,
        danger = false,
        ...restProps
    } = $props();
</script>

<button
    class="inline-block py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer {className}"
    class:bg-blue-100={active}
    class:text-blue-800={active}
    class:bg-gray-200={disabled}
    class:text-gray-700={disabled}
    class:hover:bg-gray-100={disabled}
    class:hover:cursor-default={disabled}
    class:text-red-800={danger}
    class:hover:bg-red-200={danger}
    {disabled}
    {onclick}
    {...restProps}
>
    {@render children?.()}
</button>
