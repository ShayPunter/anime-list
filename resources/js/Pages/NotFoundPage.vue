<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'

defineOptions({ layout: AppLayout })
</script>

<template>
    <Head title="404 - Not Found" />
    <div class="text-center mt-24">
        <h1 class="text-6xl font-bold text-gray-700">404</h1>
        <p class="text-gray-400 mt-4">Page not found.</p>
        <Link :href="route('home')" class="text-primary-400 hover:text-primary-300 mt-6 inline-block">Go Home</Link>
    </div>
</template>
