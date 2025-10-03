<script lang="ts">
    let {
        type: typeName = "text",
        value = $bindable(),
        class: className = "",
        ...restProps
    } = $props();
</script>

<input
    type={typeName}
    class="py-2 px-2 rounded-lg outline-none focus-within:outline-none transition-shadow w-full {className}"
    bind:value
    {...restProps}
/>
