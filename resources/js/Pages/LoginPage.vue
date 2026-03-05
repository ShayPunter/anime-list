<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'

defineOptions({ layout: AppLayout })

const form = useForm({
    email: '',
    password: '',
})

function submit() {
    form.post(route('login'))
}
</script>

<template>
    <Head title="Login" />
    <div class="max-w-md mx-auto mt-16">
        <h1 class="text-2xl font-bold mb-6">Login</h1>
        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label for="email" class="block text-sm text-gray-400 mb-1">Email</label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none"
                    required
                    autofocus
                />
                <p v-if="form.errors.email" class="text-red-400 text-sm mt-1">{{ form.errors.email }}</p>
            </div>
            <div>
                <label for="password" class="block text-sm text-gray-400 mb-1">Password</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:border-primary-500 focus:outline-none"
                    required
                />
                <p v-if="form.errors.password" class="text-red-400 text-sm mt-1">{{ form.errors.password }}</p>
            </div>
            <button
                type="submit"
                :disabled="form.processing"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition disabled:opacity-50"
            >
                Login
            </button>
        </form>
        <p class="text-gray-500 text-sm mt-4 text-center">
            Don't have an account? <Link :href="route('register')" class="text-primary-400 hover:text-primary-300">Sign up</Link>
        </p>
    </div>
</template>
