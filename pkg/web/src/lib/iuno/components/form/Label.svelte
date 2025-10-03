<script lang="ts">
    let {
        children,
        for: forName = "",
        class: className = "",
        ...restProps
    } = $props();
</script>

<div class="font-medium mb-2 text-base text-left {className}" {...restProps}>
    <label for={forName}>{@render children?.()}</label>
</div>
