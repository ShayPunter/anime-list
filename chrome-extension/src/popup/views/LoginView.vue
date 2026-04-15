<script setup lang="ts">
import { ref } from 'vue';
import { login, ApiClientError } from '@/lib/api';
import { getSettings, setApiBaseUrl } from '@/lib/storage';

const emit = defineEmits<{ 'logged-in': [] }>();

const email = ref('');
const password = ref('');
const apiBaseUrl = ref('');
const showSettings = ref(false);
const submitting = ref(false);
const error = ref<string | null>(null);

// Load the current API base URL so it can be edited if needed.
getSettings().then((s) => {
    apiBaseUrl.value = s.apiBaseUrl;
});

async function onSubmit() {
    error.value = null;
    submitting.value = true;
    try {
        if (apiBaseUrl.value) await setApiBaseUrl(apiBaseUrl.value.replace(/\/$/, ''));
        await login(email.value, password.value);
        emit('logged-in');
    } catch (err) {
        if (err instanceof ApiClientError) {
            error.value = err.message;
        } else {
            error.value = 'Could not reach the server. Check the API URL.';
        }
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <form class="login" @submit.prevent="onSubmit">
        <h1>Sign in to AniTrack</h1>

        <div class="field">
            <label for="email">Email</label>
            <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                autofocus
            />
        </div>

        <div class="field">
            <label for="password">Password</label>
            <input
                id="password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
            />
        </div>

        <button
            type="button"
            class="btn-ghost toggle-settings"
            @click="showSettings = !showSettings"
        >
            {{ showSettings ? 'Hide' : 'Advanced' }} settings
        </button>

        <div v-if="showSettings" class="field">
            <label for="api">API base URL</label>
            <input id="api" v-model="apiBaseUrl" type="url" placeholder="https://anitrack.app" />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" class="btn" :disabled="submitting">
            {{ submitting ? 'Signing in…' : 'Sign in' }}
        </button>

        <p class="hint muted">
            Requires the <code>public-api</code> feature flag to be enabled for your account.
        </p>
    </form>
</template>

<style scoped>
.login {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
}
h1 {
    font-size: 16px;
    margin: 0 0 16px;
}
.toggle-settings {
    align-self: flex-start;
    margin: -4px 0 8px;
    font-size: 12px;
}
.hint {
    margin-top: 12px;
    font-size: 11px;
    line-height: 1.4;
}
code {
    background: var(--bg-elevated);
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 10px;
}
</style>
