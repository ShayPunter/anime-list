<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import AdminNav from '@/Components/AdminNav.vue'
import axios from 'axios'

defineOptions({ layout: AppLayout })

interface RoleUser {
    id: number
    name: string
    username: string
    avatar_url: string | null
}

interface Role {
    id: number
    slug: string
    name: string
    description: string | null
    users: RoleUser[]
}

defineProps<{
    roles: Role[]
}>()

const assigningFor = ref<string | null>(null)
const usernameInput = ref('')
const assignError = ref('')

async function assignUser(roleSlug: string) {
    if (!usernameInput.value.trim()) return
    assignError.value = ''
    try {
        await axios.post(route('admin.roles.assign', { role: roleSlug }), {
            username: usernameInput.value.trim(),
        })
        usernameInput.value = ''
        assigningFor.value = null
        router.visit(route('admin.roles'), { preserveScroll: true })
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            assignError.value = e.response?.data?.message ?? 'User not found'
        } else {
            assignError.value = 'Failed to assign user'
        }
    }
}

async function removeUser(roleSlug: string, userId: number) {
    await axios.delete(route('admin.roles.remove', { role: roleSlug, user: userId }))
    router.visit(route('admin.roles'), { preserveScroll: true })
}
</script>

<template>
    <Head title="Roles" />
    <div class="mx-auto max-w-6xl">
        <AdminNav />
        <h1 class="text-2xl font-bold mb-2">Roles</h1>
        <p class="text-sm text-gray-500 mb-6">
            Assign users to roles. Features are gated by role name.
        </p>

        <div v-if="roles.length === 0" class="text-center py-12 text-gray-500">
            No roles defined.
        </div>

        <div v-else class="space-y-4">
            <div
                v-for="role in roles"
                :key="role.id"
                class="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h2 class="font-semibold text-gray-100">{{ role.name }}</h2>
                        <span class="text-xs font-mono text-gray-500">{{ role.slug }}</span>
                        <p v-if="role.description" class="text-xs text-gray-400 mt-1">
                            {{ role.description }}
                        </p>
                    </div>
                </div>

                <div class="border-t border-gray-800 pt-3">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs text-gray-500">Assigned users</span>
                        <button
                            class="text-xs text-primary-400 hover:text-primary-300 transition"
                            @click="assigningFor = assigningFor === role.slug ? null : role.slug; usernameInput = ''; assignError = ''"
                        >
                            + Assign user
                        </button>
                    </div>

                    <div v-if="assigningFor === role.slug" class="flex items-center gap-2 mb-2">
                        <input
                            v-model="usernameInput"
                            type="text"
                            placeholder="Username"
                            class="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-gray-300 flex-1"
                            @keyup.enter="assignUser(role.slug)"
                        />
                        <button
                            class="rounded bg-primary-600 px-3 py-1 text-sm text-white hover:bg-primary-700 transition"
                            @click="assignUser(role.slug)"
                        >
                            Assign
                        </button>
                        <span v-if="assignError" class="text-xs text-red-400">{{ assignError }}</span>
                    </div>

                    <div v-if="role.users.length > 0" class="flex flex-wrap gap-2">
                        <div
                            v-for="user in role.users"
                            :key="user.id"
                            class="flex items-center gap-1.5 rounded-full bg-gray-800 pl-3 pr-1.5 py-1 text-xs"
                        >
                            <span class="text-gray-300">{{ user.username }}</span>
                            <button
                                class="text-gray-500 hover:text-red-400 transition rounded-full p-0.5"
                                @click="removeUser(role.slug, user.id)"
                            >
                                &times;
                            </button>
                        </div>
                    </div>
                    <p v-else class="text-xs text-gray-600">No users assigned</p>
                </div>
            </div>
        </div>
    </div>
</template>
