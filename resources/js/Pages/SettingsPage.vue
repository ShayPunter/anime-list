<script setup lang="ts">
import { computed } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import type { User } from '@/types'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Password from 'primevue/password'
import Button from 'primevue/button'

defineOptions({ layout: AppLayout })

const props = defineProps<{
    timezones: string[]
}>()

const page = usePage<{ auth: { user: User }; flash: { message?: string } }>()
const user = computed(() => page.props.auth.user)

const profileForm = useForm({
    name: user.value.name,
    email: user.value.email,
    bio: user.value.bio ?? '',
    timezone: user.value.timezone,
    avatar_url: user.value.avatar_url ?? '',
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
    </div>
</template>
