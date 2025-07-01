<script lang="ts">
    import { login } from "$lib/api";
    import { goto } from "$app/navigation";
    let form = $state({
        username: "",
        password: "",
    });
    let error = $state("");

    const doLogin = async (e: Event) => {
        e.preventDefault();
        error = "";
        try {
            const tokenData = await login(form);
            goto("/");
        } catch (e) {
            error = "We had trouble logging you in";
            return;
        }
    };
</script>

<div class="container">
    <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <div class="block has-text-centered">
                <p class="title">Login</p>
            </div>
            <div class="box">
                <form onsubmit={doLogin}>
                    <div class="field">
                        <label for="username" class="label">Username</label>
                        <div class="control">
                            <input
                                id="username"
                                class="input"
                                type="text"
                                placeholder="Username"
                                bind:value={form.username}
                                required
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label for="password" class="label">Password</label>
                        <div class="control">
                            <input
                                id="password"
                                class="input"
                                type="password"
                                placeholder="Password"
                                bind:value={form.password}
                                required
                            />
                        </div>
                    </div>
                    {#if error}
                        <div class="field">
                            <p class="has-text-danger">{error}</p>
                        </div>
                    {/if}
                    <div class="field">
                        <div class="control">
                            <button class="button is-primary">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
