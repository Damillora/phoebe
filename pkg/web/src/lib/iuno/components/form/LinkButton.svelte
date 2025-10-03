<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";

    let {
        href,
        children,
        primary = false,
        class: className = "",
        ...restProps
    } = $props();
</script>

<a
    class="inline-block py-1 px-4 rounded-lg border border-blue-800 font-bold transition-colors cursor-pointer hover:bg-blue-200 {className}"
    class:bg-blue-800={primary}
    class:text-white={primary}
    class:hover:bg-blue-600={primary}
    {href}
    {...restProps}>{@render children?.()}</a
>
