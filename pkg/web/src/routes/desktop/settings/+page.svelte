<script>
    import DesktopActionsPanel from "$lib/components/panels/DesktopActionsPanel.svelte";
    import { isDesktop } from "$lib/desktop-check";
    import { apiUrl } from "$lib/stores";
    import { get } from "svelte/store";
    let loading = $state(false);
    let updated = $state(false);

    let url = $state(get(apiUrl));

    let is_desktop = isDesktop();

    const submitForm = async () => {
        updated = false;
        apiUrl.set(url);
        updated = true;
    };
</script>

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-one-third">
                <DesktopActionsPanel />
            </div>
            <div class="column is-two-thirds">
                <div class="box">
                    <form onsubmit={submitForm}>
                        <div class="field">
                            <label class="label" for="email"
                                >Phoebe server URL</label
                            >
                            <div class="control">
                                <input
                                    id="url"
                                    class="input"
                                    class:is-skeleton={loading}
                                    type="text"
                                    placeholder="Phoebe server"
                                    bind:value={url}
                                    disabled={!is_desktop}
                                />
                            </div>
                        </div>
                        <div class="field">
                            <button
                                class="button is-primary is-fullwidth is-outlined"
                                type="submit">Update</button
                            >
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
