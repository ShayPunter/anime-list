<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const heroEmail = ref('')
const ctaEmail = ref('')

function handoff(email: string) {
    const trimmed = email.trim()
    if (!trimmed) {
        return
    }
    router.visit(route('register', { email: trimmed }))
}

interface PosterCard {
    title: string
    status: string
    progress: string
    from: string
    to: string
}

// NOTE: titles are placeholders for visual fidelity only — no artwork is used.
// Swap currently-airing series in this list as the season rotates.
const posters: PosterCard[] = [
    { title: 'Frieren', status: 'Watching', progress: 'Ep 24 / 28', from: '#6366f1', to: '#0ea5e9' },
    { title: 'Solo Leveling', status: 'Watching', progress: 'Ep 11 / 13', from: '#7c3aed', to: '#ec4899' },
    { title: 'Jujutsu Kaisen', status: 'Watching', progress: 'Ep 18 / 23', from: '#dc2626', to: '#f97316' },
    { title: 'Dandadan', status: 'Watching', progress: 'Ep 7 / 12', from: '#10b981', to: '#06b6d4' },
    { title: 'Apothecary Diaries', status: 'Watching', progress: 'Ep 14 / 24', from: '#a855f7', to: '#6366f1' },
    { title: 'Bleach: TYBW', status: 'Watching', progress: 'Ep 9 / 13', from: '#0ea5e9' , to: '#1e3a8a' },
]

interface Feature {
    label: string
    title: string
    body: string
}

const features: Feature[] = [
    {
        label: '01 / Track',
        title: 'Never lose your place',
        body: 'One tap to mark an episode watched. Your progress syncs instantly across every device you sign in on, so picking up where you left off is friction-free.',
    },
    {
        label: '02 / Discover',
        title: 'Find your next favourite',
        body: 'Browse what is airing this season, what is trending right now, and what reviewers actually rate. Real-time countdowns tell you when the next episode drops.',
    },
    {
        label: '03 / Share',
        title: 'Compare lists with friends',
        body: 'Public profiles, shareable watchlists, and side-by-side comparisons. Find out who in your circle has the best taste — and who needs an intervention.',
    },
]

// NOTE: stat copy below is intentionally non-numeric where we cannot back the
// number up. Adjust "10K+ anime in database" to the real catalogue size before
// pointing ad spend at this page.
const stats = [
    { value: '10K+', label: 'Anime in database' },
    { value: '100%', label: 'Free, forever' },
    { value: '0', label: 'Ads, ever' },
    { value: '<30s', label: 'To get set up' },
]
</script>

<template>
    <Head title="Track every anime you watch">
        <meta name="description" content="AniTrack is a free anime tracker. Build your watchlist, mark episodes watched, follow seasonal releases, and sync across devices. No ads, no paywall." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" :href="route('welcome')" />
        <meta property="og:title" content="AniTrack — Track every anime you watch" />
        <meta property="og:description" content="Free anime tracker. No ads, no paywall, ever. Built by anime fans, for anime fans." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
    </Head>

    <div class="min-h-screen bg-gray-950 text-gray-100 dark">
        <!-- Minimal nav -->
        <nav class="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
            <div class="container mx-auto flex h-14 items-center justify-between px-4">
                <Link :href="route('welcome')" class="flex items-center gap-2 text-lg font-bold">
                    <span class="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-primary-400 to-primary-700"></span>
                    <span class="text-primary-400">AniTrack</span>
                </Link>
                <Link :href="route('login')" class="text-sm text-gray-400 transition hover:text-gray-100">Sign in</Link>
            </div>
        </nav>

        <main>
            <!-- Hero -->
            <section class="relative overflow-hidden">
                <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent_70%)]"></div>
                <div class="container relative mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20">
                    <div class="mx-auto max-w-3xl text-center">
                        <span class="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-300">
                            <span class="h-1.5 w-1.5 rounded-full bg-primary-400"></span>
                            Free anime tracker. No paywall, ever.
                        </span>

                        <h1 class="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-50 sm:text-5xl md:text-6xl">
                            Track every anime you watch.
                            <span class="block bg-gradient-to-r from-primary-300 via-primary-400 to-fuchsia-400 bg-clip-text text-transparent">
                                All in one place.
                            </span>
                        </h1>

                        <p class="mx-auto mt-5 max-w-2xl text-base text-gray-400 sm:text-lg">
                            Build a watchlist, mark episodes watched, and keep up with seasonal releases.
                            Get notified when new episodes drop and pick up where you left off on any device.
                        </p>

                        <form
                            class="mx-auto mt-8 flex w-full max-w-lg flex-col gap-2 sm:flex-row"
                            @submit.prevent="handoff(heroEmail)"
                        >
                            <label for="hero-email" class="sr-only">Email address</label>
                            <input
                                id="hero-email"
                                v-model="heroEmail"
                                type="email"
                                required
                                autocomplete="email"
                                placeholder="you@example.com"
                                class="w-full flex-1 rounded-lg border border-gray-700 bg-gray-900/80 px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                            />
                            <button
                                type="submit"
                                class="rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            >
                                Start tracking — free
                            </button>
                        </form>

                        <ul class="mx-auto mt-5 flex max-w-lg flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
                            <li v-for="claim in ['Free forever', 'No credit card', 'No ads, ever']" :key="claim" class="flex items-center gap-1.5">
                                <svg class="h-3.5 w-3.5 text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                                {{ claim }}
                            </li>
                        </ul>
                    </div>

                    <!-- Mock dashboard preview -->
                    <div class="mx-auto mt-14 max-w-5xl">
                        <div class="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/60 shadow-2xl shadow-primary-950/40">
                            <!-- Browser chrome -->
                            <div class="flex items-center gap-2 border-b border-gray-800 bg-gray-950/80 px-4 py-2.5">
                                <div class="flex gap-1.5">
                                    <span class="h-2.5 w-2.5 rounded-full bg-red-500/70"></span>
                                    <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/70"></span>
                                    <span class="h-2.5 w-2.5 rounded-full bg-green-500/70"></span>
                                </div>
                                <div class="ml-3 flex-1 truncate rounded-md bg-gray-800/70 px-3 py-1 text-center text-xs text-gray-400">
                                    anitrack.app/my-list
                                </div>
                            </div>

                            <!-- Poster grid -->
                            <div class="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
                                <div
                                    v-for="poster in posters"
                                    :key="poster.title"
                                    class="group rounded-lg border border-gray-800 bg-gray-950/40 p-2 transition hover:border-primary-500/40"
                                >
                                    <div
                                        class="relative aspect-[3/4] overflow-hidden rounded-md"
                                        :style="`background-image: linear-gradient(135deg, ${poster.from}, ${poster.to});`"
                                    >
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                                        <p class="absolute inset-x-2 bottom-2 text-center text-sm font-semibold text-white drop-shadow">
                                            {{ poster.title }}
                                        </p>
                                    </div>
                                    <p class="mt-2 flex items-center justify-between px-1 text-xs">
                                        <span class="text-primary-300">{{ poster.status }}</span>
                                        <span class="text-gray-500">{{ poster.progress }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features -->
            <section class="container mx-auto px-4 py-16 sm:py-24">
                <div class="mx-auto max-w-5xl rounded-2xl border border-gray-800 bg-gray-950">
                    <div class="grid grid-cols-1 divide-y divide-gray-800 md:grid-cols-3 md:divide-x md:divide-y-0">
                        <div v-for="feature in features" :key="feature.label" class="p-8 sm:p-10">
                            <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">{{ feature.label }}</p>
                            <div class="mt-4 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 bg-gray-900 text-primary-400">
                                <svg v-if="feature.label.startsWith('01')" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                </svg>
                                <svg v-else-if="feature.label.startsWith('02')" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                                <svg v-else class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.97 5.97 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </div>
                            <h3 class="mt-4 text-lg font-semibold text-gray-100">{{ feature.title }}</h3>
                            <p class="mt-2 text-sm leading-relaxed text-gray-400">{{ feature.body }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Free forever pitch -->
            <section class="container mx-auto px-4 pb-16 sm:pb-24">
                <div class="mx-auto max-w-3xl text-center">
                    <p class="text-xs font-semibold uppercase tracking-wider text-primary-400">Why we are different</p>
                    <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-50 sm:text-4xl">
                        Free forever isn't a
                        <span class="bg-gradient-to-r from-primary-300 to-fuchsia-400 bg-clip-text text-transparent">marketing line.</span>
                    </h2>
                    <p class="mt-5 text-base leading-relaxed text-gray-400 sm:text-lg">
                        AniTrack has no ads, no premium tier, and no plan to add either.
                        It is built by anime fans for anime fans, and run on a few friends'
                        spare evenings. The whole project exists because the older trackers
                        feel ancient and the newer ones want a subscription. We just wanted
                        a fast, modern place to keep our lists. So we made one, and we are
                        sharing it.
                    </p>
                </div>
            </section>

            <!-- Proof strip -->
            <section class="border-y border-gray-800 bg-gray-950">
                <div class="container mx-auto px-4 py-10">
                    <div class="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
                        <div v-for="stat in stats" :key="stat.label">
                            <p class="text-3xl font-bold text-gray-50 sm:text-4xl">{{ stat.value }}</p>
                            <p class="mt-1 text-xs uppercase tracking-wider text-gray-500">{{ stat.label }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Final CTA -->
            <section class="container mx-auto px-4 py-20 sm:py-28">
                <div class="mx-auto max-w-2xl text-center">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-50 sm:text-5xl">
                        Start tracking.
                        <span class="bg-gradient-to-r from-primary-300 to-fuchsia-400 bg-clip-text text-transparent">It's free.</span>
                    </h2>

                    <form
                        class="mx-auto mt-8 flex w-full max-w-lg flex-col gap-2 sm:flex-row"
                        @submit.prevent="handoff(ctaEmail)"
                    >
                        <label for="cta-email" class="sr-only">Email address</label>
                        <input
                            id="cta-email"
                            v-model="ctaEmail"
                            type="email"
                            required
                            autocomplete="email"
                            placeholder="you@example.com"
                            class="w-full flex-1 rounded-lg border border-gray-700 bg-gray-900/80 px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                        <button
                            type="submit"
                            class="rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        >
                            Create account
                        </button>
                    </form>

                    <p class="mt-4 text-sm text-gray-500">
                        Create your account in under thirty seconds. No card, no trial, no catch.
                    </p>
                </div>
            </section>
        </main>

        <!-- Minimal footer -->
        <footer class="border-t border-gray-800 bg-gray-950">
            <div class="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 font-mono text-xs text-gray-600 sm:flex-row">
                <p>&copy; {{ new Date().getFullYear() }} AniTrack</p>
                <ul class="flex items-center gap-5">
                    <li><Link :href="route('privacy')" class="transition hover:text-gray-300">Privacy</Link></li>
                    <li><Link :href="route('terms')" class="transition hover:text-gray-300">Terms</Link></li>
                    <li><a href="mailto:hello@anitrack.app" class="transition hover:text-gray-300">Contact</a></li>
                </ul>
            </div>
        </footer>
    </div>
</template>
