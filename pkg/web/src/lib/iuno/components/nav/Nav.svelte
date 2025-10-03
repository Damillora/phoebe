<script lang="ts">
    let menuVisible = $state(false);
    let {
        logoItem = undefined,
        centerItems = undefined,
        rightItems = undefined,
    } = $props();
</script>

<nav class="relative w-full h-16 py-2 px-4 flex flex-row items-center z-30">
    <a
        href="/"
        class="text-white font-bold hover:bg-blue-200 py-2 px-4 rounded-lg transition-colors md:mr-1"
    >
        <div class="flex flex-row items-center text-blue-800">
            {@render logoItem?.()}
        </div>
    </a>
    <div
        class="flex flex-row md:flex-row items-end md:items-start justify-end w-full"
    >
        <button
            aria-label="Menu"
            class="md:hidden py-2 px-2 hover:bg-blue-200 rounded-lg cursor-pointer transition-colors"
            class:bg-blue-100={menuVisible}
            class:text-blue-800={menuVisible}
            onclick={() => {
                menuVisible = !menuVisible;
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
            </svg>
        </button>
        <div
            class="absolute top-16 left-0 right-0 px-2 md:px-0 md:static flex flex-col md:flex-row md:flex md:grow bg-white md:bg-transparent pb-2 md:pb-0"
            class:hidden={!menuVisible}
        >
            <div class="flex flex-col md:flex-row grow *:md:mr-1">
                {@render centerItems?.()}
            </div>
            <div class="*:md:mr-1">
                {@render rightItems?.()}
            </div>
        </div>
    </div>
</nav>
