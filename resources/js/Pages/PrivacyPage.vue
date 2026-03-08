<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'

defineOptions({ layout: AppLayout })
</script>

<template>
    <Head title="Privacy Policy">
        <meta name="description" content="AniTrack Privacy Policy." />
        <link rel="canonical" :href="route('privacy')" />
    </Head>

    <div class="mx-auto max-w-3xl space-y-8 py-4">
        <h1 class="text-3xl font-bold">Privacy Policy</h1>
        <p class="text-sm text-gray-500">Last updated: March 8, 2026</p>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">1. Information We Collect</h2>
            <p class="text-gray-400 leading-relaxed">When you create an account, we collect:</p>
            <ul class="list-disc pl-6 space-y-1 text-gray-400">
                <li><strong class="text-gray-300">Account information:</strong> name, email address, and password</li>
                <li><strong class="text-gray-300">Profile information:</strong> username, bio, timezone, and avatar (optional)</li>
                <li><strong class="text-gray-300">Anime list data:</strong> your watchlist entries, scores, progress, and notes</li>
                <li><strong class="text-gray-300">Error diagnostics:</strong> when errors occur, we may collect your IP address, browser information, and the page you were visiting to help us diagnose and fix issues</li>
            </ul>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">2. How We Use Your Information</h2>
            <p class="text-gray-400 leading-relaxed">Your information is used to:</p>
            <ul class="list-disc pl-6 space-y-1 text-gray-400">
                <li>Provide and maintain the AniTrack service</li>
                <li>Display your anime tracking data to you</li>
                <li>Show your public profile and list to other users (if you enable sharing)</li>
                <li>Authenticate your account and secure your data</li>
            </ul>
            <p class="text-gray-400 leading-relaxed">
                We do not sell your personal information. We do not use your data for advertising or marketing purposes.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">3. Cookies</h2>
            <p class="text-gray-400 leading-relaxed">AniTrack uses the following cookies:</p>
            <ul class="list-disc pl-6 space-y-1 text-gray-400">
                <li><strong class="text-gray-300">Essential cookies:</strong> session cookies to keep you logged in and protect against cross-site request forgery</li>
                <li><strong class="text-gray-300">Analytics cookies:</strong> Google Analytics cookies (e.g. <code class="text-gray-300">_ga</code>, <code class="text-gray-300">_ga_*</code>) to help us understand how visitors use the site. These cookies collect anonymous usage data such as pages visited and session duration</li>
            </ul>
            <p class="text-gray-400 leading-relaxed">
                We do not use third-party advertising cookies.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">4. Third-Party Services</h2>
            <p class="text-gray-400 leading-relaxed">AniTrack uses the following third-party services:</p>
            <ul class="list-disc pl-6 space-y-1 text-gray-400">
                <li><strong class="text-gray-300">AniList:</strong> we retrieve anime information from the <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">AniList API</a>. Cover images are served directly from AniList's CDN.</li>
                <li><strong class="text-gray-300">Google Analytics:</strong> we use <a href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Google Analytics 4</a> to collect anonymous usage statistics. This data helps us understand traffic patterns and improve the site. Google may process this data as described in <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Google's Privacy Policy</a>.</li>
                <li><strong class="text-gray-300">Sentry:</strong> we use <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Sentry</a> for error tracking and performance monitoring. When an error occurs, Sentry may receive personally identifiable information including your IP address, browser and OS details, the URL you were visiting, and request data. This data is used solely to diagnose and fix bugs. See <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300">Sentry's Privacy Policy</a> for details.</li>
            </ul>
            <p class="text-gray-400 leading-relaxed">
                When you visit AniTrack, your browser may make requests to these external services.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">5. Data Retention</h2>
            <p class="text-gray-400 leading-relaxed">
                Your account data is retained for as long as your account is active. If you delete your account, your data will be soft-deleted and may be permanently removed after a reasonable retention period. Anime list entries you have deleted are soft-deleted and not immediately purged.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">6. Data Security</h2>
            <p class="text-gray-400 leading-relaxed">
                We take reasonable measures to protect your information. Passwords are hashed using industry-standard algorithms. All traffic is encrypted via HTTPS. However, no method of transmission over the internet is 100% secure.
            </p>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">7. Your Rights</h2>
            <p class="text-gray-400 leading-relaxed">You have the right to:</p>
            <ul class="list-disc pl-6 space-y-1 text-gray-400">
                <li>Access your personal data through your account settings</li>
                <li>Update or correct your information at any time</li>
                <li>Export your anime list data</li>
                <li>Delete your account and associated data</li>
                <li>Make your anime list private or public</li>
            </ul>
        </section>

        <section class="space-y-3">
            <h2 class="text-xl font-semibold text-gray-200">8. Changes to This Policy</h2>
            <p class="text-gray-400 leading-relaxed">
                We may update this privacy policy from time to time. Continued use of the service after changes constitutes acceptance of the updated policy. We encourage you to review this page periodically.
            </p>
        </section>
    </div>
</template>
