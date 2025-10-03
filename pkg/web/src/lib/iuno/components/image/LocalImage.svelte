<script>
    let { alt, src, class: className = "" } = $props();
</script>

<figure>
    <img class={className} {src} {alt} />
</figure>
