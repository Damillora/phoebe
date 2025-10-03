<script lang="ts">
    import { goto } from "$app/navigation";
    import TagLinkNumbered from "$lib/components/TagLinkNumbered.svelte";
    import TagTypeIndicator from "$lib/components/TagTypeIndicator.svelte";
    import Input from "$lib/iuno/components/form/Input.svelte";
    import InputButton from "$lib/iuno/components/form/InputButton.svelte";
    import TextInput from "$lib/iuno/components/form/TextInput.svelte";
    import ContainerWithSidebar from "$lib/iuno/components/layout/ContainerWithSidebar.svelte";
    import Tabs from "$lib/iuno/components/layout/Tabs.svelte";
    import NavButton from "$lib/iuno/components/nav/NavButton.svelte";
    import Pagination from "$lib/iuno/components/nav/Pagination.svelte";

    let { data } = $props();

    let tagSearch = $state("");
    let tagType = $state("");

    let onSubmit = async (e: Event) => {
        e.preventDefault();
        let url = "/tags?";
        let newParams: string[] = [];
        if (tagSearch) {
            newParams.push(`q=${tagSearch}`);
        }
        if (tagType) {
            newParams.push(`tagType=${tagType}`);
        }
        url = url + newParams.join("&");
        await goto(url);
    };

    const onChangePage = async (n: number) => {
        let url = "/tags?";
        let newParams: string[] = [];
        newParams.push(`page=${n}`);
        if (data.q) {
            newParams.push(`q=${data.q}`);
        }
        if (data.tagType) {
            newParams.push(`tagType=${data.tagType}`);
        }
        url = url + newParams.join("&");
        await goto(url);
    };
</script>

<ContainerWithSidebar>
    {#snippet sidebar()}
        <div class="px-4 py-2">
            <form onsubmit={onSubmit}>
                <Input>
                    <TextInput bind:value={tagSearch} />
                    <InputButton type="submit">
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
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </InputButton>
                </Input>
            </form>
        </div>
    {/snippet}
    {#snippet contents()}
        <div class="px-4 py-2">
            {#await data.tags then response}
                <div class="mb-4">
                    {#each response.tags as tag}
                        <TagLinkNumbered
                            tag={tag.tagType + ":" + tag.tagName}
                            num={tag.postCount}
                            goToTag={true}
                        />
                    {/each}
                </div>
                <div>
                    <Pagination
                        page={response.currentPage}
                        totalPages={response.totalPage}
                        changePage={onChangePage}
                    />
                </div>
            {/await}
        </div>
    {/snippet}
</ContainerWithSidebar>
