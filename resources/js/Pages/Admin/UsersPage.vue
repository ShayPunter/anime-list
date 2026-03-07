<script setup lang="ts">
import { ref, watch } from 'vue'
import { router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import PaginationBar from '@/Components/PaginationBar.vue'
import UserAvatar from '@/Components/UserAvatar.vue'
import type { AdminUser } from '@/types/admin'
import type { PaginatedResponse } from '@/types/api'

defineOptions({ layout: AppLayout })

const props = defineProps<{
    users: PaginatedResponse<AdminUser>
    filters: { search: string | null }
}>()

const search = ref(props.filters.search ?? '')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(search, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        router.get(route('admin.users'), { search: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        })
    }, 300)
})

const confirmingDelete = ref<number | null>(null)

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

function toggleAdmin(userId: number) {
    router.patch(route('admin.users.toggle-admin', { user: userId }), {}, {
        preserveScroll: true,
    })
}

function deleteUser(userId: number) {
    router.delete(route('admin.users.destroy', { user: userId }), {
        preserveScroll: true,
        onSuccess: () => { confirmingDelete.value = null },
    })
}
</script>

<template>
    <Head title="User Management" />

    <div class="mx-auto max-w-6xl space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">User Management</h1>
                <p class="mt-1 text-sm text-gray-400">{{ users.meta.total }} total users</p>
            </div>
            <Link
                :href="route('admin.dashboard')"
                class="text-sm text-gray-400 transition hover:text-gray-200"
            >
                &larr; Dashboard
            </Link>
        </div>

        <!-- Search -->
        <input
            v-model="search"
            type="text"
            placeholder="Search by name, email, or username..."
            class="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-gray-200 placeholder-gray-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />

        <!-- Users Table -->
        <div class="overflow-x-auto rounded-xl border border-gray-800">
            <table class="w-full">
                <thead class="border-b border-gray-800 bg-gray-900">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">User</th>
                        <th class="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 md:table-cell">Email</th>
                        <th class="hidden px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400 sm:table-cell">Anime</th>
                        <th class="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400 lg:table-cell">Joined</th>
                        <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                    <tr
                        v-for="user in users.data"
                        :key="user.id"
                        class="bg-gray-950 transition hover:bg-gray-900"
                    >
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <UserAvatar :name="user.name" :avatar-url="user.avatar_url" size="sm" />
                                <div>
                                    <div class="font-medium text-gray-200">
                                        {{ user.name }}
                                        <span v-if="user.is_admin" class="ml-1 rounded bg-primary-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-400">
                                            ADMIN
                                        </span>
                                    </div>
                                    <div class="text-xs text-gray-500">@{{ user.username }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="hidden px-4 py-3 text-sm text-gray-400 md:table-cell">{{ user.email }}</td>
                        <td class="hidden px-4 py-3 text-center text-sm text-gray-400 sm:table-cell">{{ user.anime_count }}</td>
                        <td class="hidden px-4 py-3 text-sm text-gray-500 lg:table-cell">{{ formatDate(user.created_at) }}</td>
                        <td class="px-4 py-3 text-right">
                            <div class="flex items-center justify-end gap-2">
                                <button
                                    class="rounded px-2.5 py-1 text-xs transition"
                                    :class="user.is_admin
                                        ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
                                    @click="toggleAdmin(user.id)"
                                >
                                    {{ user.is_admin ? 'Revoke Admin' : 'Make Admin' }}
                                </button>
                                <template v-if="confirmingDelete === user.id">
                                    <button
                                        class="rounded bg-red-600 px-2.5 py-1 text-xs text-white transition hover:bg-red-700"
                                        @click="deleteUser(user.id)"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        class="rounded px-2.5 py-1 text-xs text-gray-400 transition hover:text-gray-200"
                                        @click="confirmingDelete = null"
                                    >
                                        Cancel
                                    </button>
                                </template>
                                <button
                                    v-else
                                    class="rounded bg-red-600/20 px-2.5 py-1 text-xs text-red-400 transition hover:bg-red-600/30"
                                    @click="confirmingDelete = user.id"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <PaginationBar
            :current-page="users.meta.current_page"
            :last-page="users.meta.last_page"
            :total="users.meta.total"
        />
    </div>
</template>
