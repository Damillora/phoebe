<script lang="ts">
    import type { KeyboardEventHandler } from "svelte/elements";
    import NavButton from "../nav/NavButton.svelte";

    let {
        value = [],
        class: className = "",
        ontagchange,
        name = "",
        onautocomplete = undefined,
        ...restProps
    } = $props();
    let textValue = $state("");
    let id = $state(0);

    let timer: Timeout | undefined = $state();

    let autocompleteEntries: string[] = $state([]);
    let selectedAutocomplete: number | undefined = $state();

    const appendTextValue = (textValue: string) => {
        let newValue = value.concat(textValue);
        if (ontagchange) {
            ontagchange(newValue);
        }
        id += 1;
    };
    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (selectedAutocomplete === undefined) {
                selectedAutocomplete = (autocompleteEntries.length + 5 - 1) % 5;
            } else {
                selectedAutocomplete = (selectedAutocomplete + 5 - 1) % 5;
            }
            return;
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (selectedAutocomplete === undefined) {
                console.log("up");
                selectedAutocomplete = 0;
            } else {
                console.log("up");
                selectedAutocomplete = (selectedAutocomplete + 1) % 5;
            }
            return;
        }
        if (e.key === " ") {
            e.preventDefault();
            if (selectedAutocomplete !== undefined) {
                console.log(autocompleteEntries[selectedAutocomplete]);
                autocompleteSelect(autocompleteEntries[selectedAutocomplete]);
                return;
            }
            if (textValue !== "") {
                const exist = value.find((x) => x === textValue);
                if (!exist) {
                    appendTextValue(textValue);
                    textValue = "";
                    id += 1;
                }
            } else {
                textValue = "";
            }
        } else if (
            e.key === "Backspace" &&
            textValue === "" &&
            value.length > 0
        ) {
            removeTag(value[value.length - 1]);
        } else if (onautocomplete) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                invokeAutocomplete(textValue);
            }, 400);
        }
        autocompleteEntries = [];
    };
    const invokeAutocomplete = async (str: string) => {
        let autocomplete: string[] = await onautocomplete(str);
        autocomplete = autocomplete.filter((x) => !value.includes(x));
        autocompleteEntries = autocomplete.slice(0, 5);
    };
    const removeTag = (i: string) => {
        let newValue = value.filter((x) => x != i);
        console.log(newValue);
        if (ontagchange) {
            ontagchange(newValue);
        }
    };
    const autocompleteSelect = (str: string) => {
        appendTextValue(str);
        autocompleteEntries = [];
        selectedAutocomplete = undefined;
        textValue = "";
        id += 1;
    };
</script>

<div
    class="relative group py-2 px-2 w-full rounded-lg transition-shadow {className} flex flex-row flex-wrap cursor-text"
    {...restProps}
>
    {#each value as item, i}
        <div
            class="text-sm mr-1 rounded-lg bg-blue-100 group-focus-within:bg-blue-200 transition-colors px-2 my-1 cursor-default flex flex-row items-center justify-center"
        >
            <span class="mr-1">{item}</span>
            <button
                class="cursor-pointer hover:text-red-800 rounded-full transition-colors"
                type="button"
                onclick={() => removeTag(item)}>✕</button
            >
        </div>
    {/each}
    <input
        type="text"
        {name}
        class="outline-none focus-within:outline-none grow min-w-32"
        bind:value={textValue}
        onkeydown={onKeyDown}
        {...restProps}
    />
    <div
        class="hidden group-focus-within:flex absolute left-0 top-full bg-gray-100 flex-col rounded-lg *:w-full transition-all"
    >
        {#each autocompleteEntries as autocomplete, i}
            <NavButton
                active={selectedAutocomplete === i}
                class="text-left"
                type="button"
                onclick={() => autocompleteSelect(autocomplete)}
            >
                {autocomplete}
            </NavButton>
        {/each}
    </div>
</div>
