<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'
import ImportWizard from '@/Components/ImportWizard.vue'

defineOptions({ layout: AppLayout })
</script>

<template>
    <Head title="Import from MAL" />
    <div>
        <h1 class="text-2xl font-bold mb-6">Import from MAL</h1>
        <ImportWizard />
    </div>
</template>
