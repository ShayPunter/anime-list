<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'

defineOptions({ layout: AppLayout })
</script>

<template>
    <Head title="Terms of Service">
        <meta name="description" content="AniTrack Terms of Service." />
        <link rel="canonical" :href="route('terms')" />
    </Head>

    <div class="mx-auto max-w-3xl space-y-8 py-4">
        <h1 class="text-3xl font-bold">Terms of Service</h1>
        <p class="text-sm text-gray-500">Last updated: March 8, 2026</p>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">1. Acceptance of Terms</h2>
            <p class="text-gray-400 leading-relaxed">
                By accessing or using AniTrack, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">2. Description of Service</h2>
            <p class="text-gray-400 leading-relaxed">
                AniTrack is a personal anime tracking platform that allows users to browse anime information, maintain a personal watchlist, track viewing progress, and share their anime list with others.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">3. User Accounts</h2>
            <p class="text-gray-400 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate information when creating an account and keep it up to date. You may not create accounts for the purpose of abusing the service or other users.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">4. Acceptable Use</h2>
            <p class="text-gray-400 leading-relaxed">You agree not to:</p>
            <ul class="list-disc pl-6 space-y-1 text-gray-400">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorised access to any part of the service</li>
                <li>Interfere with or disrupt the service or its infrastructure</li>
                <li>Scrape, crawl, or otherwise extract data from the service in an automated manner beyond normal use</li>
                <li>Impersonate any person or entity</li>
            </ul>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">5. Third-Party Content</h2>
            <p class="text-gray-400 leading-relaxed">
                Anime information, metadata, and images displayed on AniTrack are sourced from third-party providers, primarily AniList. AniTrack does not claim ownership of this content. The accuracy and availability of third-party content is not guaranteed.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">6. Limitation of Liability</h2>
            <p class="text-gray-400 leading-relaxed">
                AniTrack is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free. In no event shall AniTrack be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">7. Termination</h2>
            <p class="text-gray-400 leading-relaxed">
                We reserve the right to suspend or terminate your account at our discretion, without prior notice, for conduct that we determine violates these terms or is harmful to the service or other users. You may delete your account at any time through the settings page.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">8. Changes to Terms</h2>
            <p class="text-gray-400 leading-relaxed">
                We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms. We encourage you to review this page periodically.
            </p>
        </section>
    </div>
</template>
