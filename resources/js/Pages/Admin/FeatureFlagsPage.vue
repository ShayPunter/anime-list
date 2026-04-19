<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import AdminNav from '@/Components/AdminNav.vue'
import AutoComplete, { type AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import axios from 'axios'

defineOptions({ layout: AppLayout })

interface FeatureUser {
    user_id: number
    username: string
    name: string
    active: boolean
}

interface FeatureFlag {
    name: string
    status: 'everyone' | 'nobody' | 'default' | 'specific'
    users: FeatureUser[]
}

interface UserSuggestion {
    id: number
    name: string
    username: string
    avatar_url: string | null
}

const props = defineProps<{
    features: FeatureFlag[]
}>()

const addingUserFor = ref<string | null>(null)
const selectedUser = ref<UserSuggestion | string | null>(null)
const userSuggestions = ref<UserSuggestion[]>([])
const addingError = ref('')

async function setStatus(feature: string, status: 'everyone' | 'nobody' | 'default') {
    await axios.patch(route('admin.features.update', { feature }), { status })
    router.visit(route('admin.features'), { preserveScroll: true })
}

async function searchUsers(event: AutoCompleteCompleteEvent) {
    try {
        const { data } = await axios.get<{ data: UserSuggestion[] }>(
            route('admin.users.search'),
            { params: { q: event.query } },
        )
        userSuggestions.value = data.data
    } catch {
        userSuggestions.value = []
    }
}

function resetAddUser(feature: string | null) {
    addingUserFor.value = feature
    selectedUser.value = null
    userSuggestions.value = []
    addingError.value = ''
}

async function addUser(feature: string) {
    const value = selectedUser.value
    const username =
        typeof value === 'string' ? value.trim() : value?.username?.trim() ?? ''

    if (!username) return
    addingError.value = ''
    try {
        await axios.post(route('admin.features.activate-user', { feature }), {
            username,
        })
        resetAddUser(null)
        router.visit(route('admin.features'), { preserveScroll: true })
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            addingError.value = e.response?.data?.message ?? 'User not found'
        } else {
            addingError.value = 'Failed to add user'
        }
    }
}

async function removeUser(feature: string, userId: number) {
    await axios.delete(route('admin.features.deactivate-user', { feature, user: userId }))
    router.visit(route('admin.features'), { preserveScroll: true })
}

const statusLabels: Record<string, string> = {
    everyone: 'Everyone',
    nobody: 'Nobody',
    default: 'Default (Off)',
    specific: 'Specific Users',
}

const statusColors: Record<string, string> = {
    everyone: 'text-green-400',
    nobody: 'text-red-400',
    default: 'text-gray-500',
    specific: 'text-yellow-400',
}
</script>

<template>
    <Head title="Feature Flags" />
    <div class="mx-auto max-w-6xl">
        <AdminNav />
        <h1 class="text-2xl font-bold mb-6">Feature Flags</h1>

        <div v-if="features.length === 0" class="text-center py-12 text-gray-500">
            No feature flags defined.
        </div>

        <div v-else class="space-y-4">
            <div
                v-for="feature in features"
                :key="feature.name"
                class="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
                <div class="flex items-center justify-between mb-3">
                    <div>
                        <h2 class="font-semibold text-gray-100 font-mono">{{ feature.name }}</h2>
                        <span class="text-xs" :class="statusColors[feature.status]">
                            {{ statusLabels[feature.status] }}
                        </span>
                    </div>
                    <div class="flex gap-1">
                        <button
                            class="rounded px-3 py-1.5 text-xs transition border"
                            :class="feature.status === 'everyone'
                                ? 'border-green-500 bg-green-600/20 text-green-400'
                                : 'border-gray-700 text-gray-400 hover:text-gray-200'"
                            @click="setStatus(feature.name, 'everyone')"
                        >
                            Everyone
                        </button>
                        <button
                            class="rounded px-3 py-1.5 text-xs transition border"
                            :class="feature.status === 'nobody'
                                ? 'border-red-500 bg-red-600/20 text-red-400'
                                : 'border-gray-700 text-gray-400 hover:text-gray-200'"
                            @click="setStatus(feature.name, 'nobody')"
                        >
                            Nobody
                        </button>
                        <button
                            class="rounded px-3 py-1.5 text-xs transition border"
                            :class="feature.status === 'default'
                                ? 'border-gray-500 bg-gray-600/20 text-gray-300'
                                : 'border-gray-700 text-gray-400 hover:text-gray-200'"
                            @click="setStatus(feature.name, 'default')"
                        >
                            Default
                        </button>
                    </div>
                </div>

                <!-- Per-user overrides -->
                <div class="border-t border-gray-800 pt-3">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs text-gray-500">User overrides</span>
                        <button
                            class="text-xs text-primary-400 hover:text-primary-300 transition"
                            @click="resetAddUser(addingUserFor === feature.name ? null : feature.name)"
                        >
                            + Add user
                        </button>
                    </div>

                    <!-- Add user form -->
                    <div v-if="addingUserFor === feature.name" class="flex items-center gap-2 mb-2">
                        <AutoComplete
                            v-model="selectedUser"
                            :suggestions="userSuggestions"
                            option-label="username"
                            placeholder="Search by username or name"
                            class="flex-1"
                            input-class="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-300"
                            :delay="250"
                            @complete="searchUsers"
                            @keyup.enter="addUser(feature.name)"
                        >
                            <template #option="{ option }">
                                <div class="flex items-center gap-2">
                                    <img
                                        v-if="option.avatar_url"
                                        :src="option.avatar_url"
                                        :alt="option.username"
                                        class="h-6 w-6 rounded-full object-cover"
                                    />
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-200">{{ option.username }}</span>
                                        <span class="text-xs text-gray-500">{{ option.name }}</span>
                                    </div>
                                </div>
                            </template>
                            <template #empty>
                                <span class="block px-3 py-2 text-xs text-gray-500">No users found</span>
                            </template>
                        </AutoComplete>
                        <button
                            class="rounded bg-primary-600 px-3 py-1 text-sm text-white hover:bg-primary-700 transition"
                            @click="addUser(feature.name)"
                        >
                            Add
                        </button>
                        <span v-if="addingError" class="text-xs text-red-400">{{ addingError }}</span>
                    </div>

                    <!-- User list -->
                    <div v-if="feature.users.length > 0" class="flex flex-wrap gap-2">
                        <div
                            v-for="user in feature.users"
                            :key="user.user_id"
                            class="flex items-center gap-1.5 rounded-full bg-gray-800 pl-3 pr-1.5 py-1 text-xs"
                        >
                            <span class="text-gray-300">{{ user.username }}</span>
                            <button
                                class="text-gray-500 hover:text-red-400 transition rounded-full p-0.5"
                                @click="removeUser(feature.name, user.user_id)"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                    <p v-else class="text-xs text-gray-600">No user-specific overrides</p>
                </div>
            </div>
        </div>
    </div>
</template>
