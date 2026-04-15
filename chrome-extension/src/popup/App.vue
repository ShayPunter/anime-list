<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LoginView from './views/LoginView.vue';
import WatchingView from './views/WatchingView.vue';
import SearchView from './views/SearchView.vue';
import { getAuth } from '@/lib/storage';
import type { AuthenticatedUser } from '@/types/api';
import { logout } from '@/lib/api';

type Tab = 'watching' | 'search';

const ready = ref(false);
const user = ref<AuthenticatedUser | null>(null);
const tab = ref<Tab>('watching');

async function refreshAuth() {
    const auth = await getAuth();
    user.value = auth?.user ?? null;
}

onMounted(async () => {
    await refreshAuth();
    ready.value = true;
});

async function onLoggedIn() {
    await refreshAuth();
}

async function onLogout() {
    await logout();
    user.value = null;
}
</script>

<template>
    <div v-if="!ready" class="loading empty">Loading…</div>

    <LoginView v-else-if="!user" @logged-in="onLoggedIn" />

    <div v-else class="app">
        <header class="header">
            <div class="brand">AniTrack</div>
            <div class="header-right">
                <span class="username">@{{ user.username }}</span>
                <button class="btn-ghost" title="Sign out" @click="onLogout">Sign out</button>
            </div>
        </header>

        <nav class="tabs">
            <button
                class="tab"
                :class="{ active: tab === 'watching' }"
                @click="tab = 'watching'"
            >
                Watching
            </button>
            <button
                class="tab"
                :class="{ active: tab === 'search' }"
                @click="tab = 'search'"
            >
                Search
            </button>
        </nav>

        <main class="content">
            <WatchingView v-if="tab === 'watching'" />
            <SearchView v-else />
        </main>
    </div>
</template>

<style scoped>
.app {
    display: flex;
    flex-direction: column;
    min-height: 480px;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
}
.brand {
    font-weight: 600;
    letter-spacing: 0.02em;
}
.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
}
.username {
    font-size: 12px;
    color: var(--fg-muted);
}
.tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
}
.tab {
    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    color: var(--fg-muted);
    border-bottom: 2px solid transparent;
}
.tab.active {
    color: var(--fg);
    border-bottom-color: var(--accent);
}
.content {
    flex: 1;
    overflow-y: auto;
    max-height: 440px;
}
</style>
