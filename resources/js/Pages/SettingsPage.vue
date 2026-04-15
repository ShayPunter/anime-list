<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { router, useForm, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import type { User } from '@/types'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Password from 'primevue/password'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'

defineOptions({ layout: AppLayout })

interface ApiToken {
    id: number
    name: string
    last_used_at: string | null
    last_used_ip: string | null
    last_used_user_agent: string | null
    created_at: string
}

interface NewApiToken {
    id: number
    name: string
    plain_text: string
}

const props = defineProps<{
    timezones: string[]
    publicApiEnabled: boolean
    apiTokens: ApiToken[]
}>()

const page = usePage<{
    auth: { user: User }
    flash: { message?: string; newApiToken?: NewApiToken }
}>()
const user = computed(() => page.props.auth.user)

const profileForm = useForm({
    name: user.value.name,
    username: user.value.username,
    email: user.value.email,
    bio: user.value.bio ?? '',
    timezone: user.value.timezone,
    avatar_url: user.value.avatar_url ?? '',
    list_is_public: user.value.list_is_public ?? false,
})

const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
})

function submitProfile() {
    profileForm.patch(route('settings.profile'), {
        preserveScroll: true,
    })
}

function submitPassword() {
    passwordForm.patch(route('settings.password'), {
        preserveScroll: true,
        onSuccess: () => {
            passwordForm.reset()
        },
    })
}

const timezoneOptions = computed(() =>
    props.timezones.map(tz => ({ label: tz, value: tz }))
)

// ── API tokens ──────────────────────────────────────────────────────────────

const tokenForm = useForm({ name: '' })
const justCreatedToken = ref<NewApiToken | null>(null)
const revokingId = ref<number | null>(null)

watch(
    () => page.props.flash.newApiToken,
    token => {
        if (token) {
            justCreatedToken.value = token
        }
    },
    { immediate: true },
)

function submitTokenForm() {
    tokenForm.post(route('settings.api-tokens.store'), {
        preserveScroll: true,
        onSuccess: () => {
            tokenForm.reset()
        },
    })
}

function revokeToken(token: ApiToken) {
    const confirmed = window.confirm(
        `Revoke "${token.name}"? Any clients using this token will stop working immediately.`,
    )
    if (!confirmed) return

    revokingId.value = token.id
    router.delete(route('settings.api-tokens.destroy', { token: token.id }), {
        preserveScroll: true,
        onFinish: () => {
            revokingId.value = null
        },
    })
}

function dismissNewToken() {
    justCreatedToken.value = null
}

function copyToken(value: string) {
    void navigator.clipboard?.writeText(value)
}

function formatWhen(iso: string | null): string {
    if (!iso) return 'never'
    return new Date(iso).toLocaleString()
}

function summariseUserAgent(ua: string | null): string {
    if (!ua) return 'Unknown device'
    // Very small heuristic — enough to tell a browser from a CLI/extension.
    if (/Chrome\/\S+/.test(ua) && /AniTrack/i.test(ua)) return 'AniTrack Chrome Extension'
    if (/Chrome\/\S+/.test(ua)) return 'Chrome'
    if (/Firefox\/\S+/.test(ua)) return 'Firefox'
    if (/Safari\/\S+/.test(ua) && !/Chrome/.test(ua)) return 'Safari'
    if (/curl\/\S+/i.test(ua)) return 'curl'
    if (/PostmanRuntime/i.test(ua)) return 'Postman'
    return ua.slice(0, 60)
}
</script>

<template>
    <Head title="Settings" />
    <div class="max-w-2xl mx-auto space-y-8">
        <h1 class="text-2xl font-bold">Settings</h1>

        <div
            v-if="page.props.flash.message"
            class="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg"
        >
            {{ page.props.flash.message }}
        </div>

        <!-- Profile Section -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Profile</h2>
            <form class="space-y-4" @submit.prevent="submitProfile">
                <div>
                    <label class="block text-sm text-gray-400 mb-1">Name</label>
                    <InputText
                        v-model="profileForm.name"
                        class="w-full"
                        :invalid="!!profileForm.errors.name"
                    />
                    <p v-if="profileForm.errors.name" class="text-red-400 text-sm mt-1">
                        {{ profileForm.errors.name }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-1">Username</label>
                    <InputText
                        v-model="profileForm.username"
                        class="w-full"
                        :invalid="!!profileForm.errors.username"
                    />
                    <p class="text-gray-500 text-xs mt-1">Your profile URL: /user/{{ profileForm.username || '...' }}</p>
                    <p v-if="profileForm.errors.username" class="text-red-400 text-sm mt-1">
                        {{ profileForm.errors.username }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-1">Email</label>
                    <InputText
                        v-model="profileForm.email"
                        type="email"
                        class="w-full"
                        :invalid="!!profileForm.errors.email"
                    />
                    <p v-if="profileForm.errors.email" class="text-red-400 text-sm mt-1">
                        {{ profileForm.errors.email }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-1">Bio</label>
                    <Textarea
                        v-model="profileForm.bio"
                        rows="3"
                        class="w-full"
                        :invalid="!!profileForm.errors.bio"
                    />
                    <p v-if="profileForm.errors.bio" class="text-red-400 text-sm mt-1">
                        {{ profileForm.errors.bio }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-1">Timezone</label>
                    <Select
                        v-model="profileForm.timezone"
                        :options="timezoneOptions"
                        option-label="label"
                        option-value="value"
                        filter
                        class="w-full"
                        :invalid="!!profileForm.errors.timezone"
                    />
                    <p v-if="profileForm.errors.timezone" class="text-red-400 text-sm mt-1">
                        {{ profileForm.errors.timezone }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-1">Avatar URL</label>
                    <InputText
                        v-model="profileForm.avatar_url"
                        class="w-full"
                        placeholder="https://example.com/avatar.jpg"
                        :invalid="!!profileForm.errors.avatar_url"
                    />
                    <p v-if="profileForm.errors.avatar_url" class="text-red-400 text-sm mt-1">
                        {{ profileForm.errors.avatar_url }}
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    <ToggleSwitch v-model="profileForm.list_is_public" />
                    <label class="text-sm text-gray-400">Make my anime list public</label>
                </div>

                <Button
                    type="submit"
                    label="Save Profile"
                    :loading="profileForm.processing"
                    :disabled="profileForm.processing"
                />
            </form>
        </div>

        <!-- Password Section -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Change Password</h2>
            <form class="space-y-4" @submit.prevent="submitPassword">
                <div>
                    <label class="block text-sm text-gray-400 mb-1">Current Password</label>
                    <Password
                        v-model="passwordForm.current_password"
                        :feedback="false"
                        toggle-mask
                        class="w-full"
                        input-class="w-full"
                        :invalid="!!passwordForm.errors.current_password"
                    />
                    <p v-if="passwordForm.errors.current_password" class="text-red-400 text-sm mt-1">
                        {{ passwordForm.errors.current_password }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-1">New Password</label>
                    <Password
                        v-model="passwordForm.password"
                        :feedback="false"
                        toggle-mask
                        class="w-full"
                        input-class="w-full"
                        :invalid="!!passwordForm.errors.password"
                    />
                    <p v-if="passwordForm.errors.password" class="text-red-400 text-sm mt-1">
                        {{ passwordForm.errors.password }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                    <Password
                        v-model="passwordForm.password_confirmation"
                        :feedback="false"
                        toggle-mask
                        class="w-full"
                        input-class="w-full"
                    />
                </div>

                <Button
                    type="submit"
                    label="Change Password"
                    severity="secondary"
                    :loading="passwordForm.processing"
                    :disabled="passwordForm.processing"
                />
            </form>
        </div>

        <!-- API Tokens Section -->
        <div
            v-if="publicApiEnabled"
            class="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
            <h2 class="text-lg font-semibold mb-1">API Tokens</h2>
            <p class="text-sm text-gray-400 mb-4">
                Issue tokens for third-party integrations.
                Each token can read and modify your list on your behalf — treat them like passwords.
                See the <Link :href="route('developers')" class="text-emerald-400 hover:underline">developer docs</Link>
                for endpoint details.
            </p>

            <!-- Plain-text display for a token that was just created. -->
            <div
                v-if="justCreatedToken"
                class="bg-amber-950/40 border border-amber-800 rounded-lg p-4 mb-4"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1">
                        <p class="text-amber-300 text-sm font-medium mb-1">
                            Copy your token now — you won't be able to see it again.
                        </p>
                        <p class="text-gray-400 text-xs mb-2">
                            <strong>{{ justCreatedToken.name }}</strong>
                        </p>
                        <code
                            class="block w-full break-all bg-gray-950 border border-gray-800 rounded px-3 py-2 text-sm font-mono text-amber-200"
                        >{{ justCreatedToken.plain_text }}</code>
                    </div>
                    <div class="flex flex-col gap-2 shrink-0">
                        <Button
                            type="button"
                            size="small"
                            label="Copy"
                            severity="secondary"
                            @click="copyToken(justCreatedToken.plain_text)"
                        />
                        <Button
                            type="button"
                            size="small"
                            label="Dismiss"
                            severity="secondary"
                            text
                            @click="dismissNewToken"
                        />
                    </div>
                </div>
            </div>

            <!-- Create form -->
            <form class="flex gap-2 mb-6" @submit.prevent="submitTokenForm">
                <div class="flex-1">
                    <InputText
                        v-model="tokenForm.name"
                        placeholder="e.g. Chrome Extension — Work Laptop"
                        class="w-full"
                        :invalid="!!tokenForm.errors.name"
                    />
                    <p v-if="tokenForm.errors.name" class="text-red-400 text-sm mt-1">
                        {{ tokenForm.errors.name }}
                    </p>
                </div>
                <Button
                    type="submit"
                    label="Create Token"
                    :loading="tokenForm.processing"
                    :disabled="tokenForm.processing || tokenForm.name.trim().length === 0"
                />
            </form>

            <!-- Token list -->
            <div v-if="apiTokens.length === 0" class="text-sm text-gray-500">
                No tokens yet. Create one above to get started.
            </div>

            <ul v-else class="divide-y divide-gray-800">
                <li
                    v-for="token in apiTokens"
                    :key="token.id"
                    class="py-3 flex items-start justify-between gap-3"
                >
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-medium truncate">{{ token.name }}</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-1 space-x-2">
                            <span>Last used: {{ formatWhen(token.last_used_at) }}</span>
                            <span v-if="token.last_used_ip">· from {{ token.last_used_ip }}</span>
                            <span v-if="token.last_used_user_agent">
                                · {{ summariseUserAgent(token.last_used_user_agent) }}
                            </span>
                        </div>
                        <div class="text-xs text-gray-600 mt-0.5">
                            Created {{ formatWhen(token.created_at) }}
                        </div>
                    </div>
                    <Button
                        type="button"
                        size="small"
                        label="Revoke"
                        severity="danger"
                        outlined
                        :loading="revokingId === token.id"
                        :disabled="revokingId === token.id"
                        @click="revokeToken(token)"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>
