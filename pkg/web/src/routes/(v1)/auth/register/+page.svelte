<script lang="ts">
    import { register } from "$lib/api";
    import { goto } from "$app/navigation";
    let form = $state({
        username: "",
        password: "",
        email: "",
    });

    async function doRegister(e: Event) {
        e.preventDefault();
        try {
            const tokenData = await register(form);
            goto("/");
        } catch (error) {
            error = "We had trouble registering you";
        }
    }
</script>

<div class="container">
    <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <div class="block has-text-centered">
                <p class="title">Register</p>
            </div>
            <div class="box">
                <form onsubmit={doRegister}>
                    <div class="field">
                        <label for="email" class="label">Email</label>
                        <div class="control">
                            <input
                                id="email"
                                class="input"
                                type="text"
                                placeholder="Email"
                                bind:value={form.email}
                                required
                            />
                        </div>
                    </div>
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
                    <div class="field">
                        <div class="control">
                            <button class="button is-primary">Register</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
