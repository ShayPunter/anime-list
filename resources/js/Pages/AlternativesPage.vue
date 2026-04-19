<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'

defineOptions({ layout: AppLayout })

interface Platform {
    name: string
    tagline: string
    description: string
    pros: string[]
    cons: string[]
    url?: string
    highlight?: boolean
}

const platforms: Platform[] = [
    {
        name: 'AniTrack',
        tagline: 'That’s us — the one you’re on right now.',
        description:
            'A modern, fast anime tracker built on top of the AniList GraphQL API with a clean, distraction-free interface. Personal watchlists, progress tracking, seasonal schedules and shareable profiles — without the clutter.',
        pros: [
            'Snappy, modern UI with a proper dark theme',
            'Seasonal calendar and weekly airing schedule baked in',
            'Import from MyAnimeList and AniList so switching is painless',
            'Free, no ads, and actively developed',
        ],
        cons: [
            'Smaller community than the veteran sites',
            'Social features are still growing',
        ],
        highlight: true,
    },
    {
        name: 'MyAnimeList (MAL)',
        tagline: 'The granddaddy of anime tracking.',
        description:
            'The largest and longest-running anime database on the web, with a huge community, forums and reviews. If you’ve been in the hobby for a decade, you probably already have an account.',
        pros: [
            'Massive, near-exhaustive database',
            'Huge user base — reviews and discussions on almost every title',
            'Industry-standard scoring most sites reference',
        ],
        cons: [
            'UI feels dated and slow in places',
            'Ad-heavy unless you pay for MAL Supporter',
            'Moderation and data updates can be slow',
        ],
        url: 'https://myanimelist.net',
    },
    {
        name: 'AniList',
        tagline: 'The data-rich, developer-friendly pick.',
        description:
            'A modern tracker with a powerful GraphQL API, rich statistics and good social features. Popular with people who want graphs, activity feeds and a more contemporary UI than MAL.',
        pros: [
            'Beautiful stats and activity pages',
            'Excellent public GraphQL API (it powers us too)',
            'Active, friendly community',
        ],
        cons: [
            'Can feel overwhelming for brand-new users',
            'Mobile experience lags behind the desktop one',
        ],
        url: 'https://anilist.co',
    },
    {
        name: 'Kitsu',
        tagline: 'Clean, social, and beginner-friendly.',
        description:
            'A polished tracker with a focus on discovery and social features. Nice-looking out of the box and easy to get started with, especially if you’re coming from MAL and want something prettier.',
        pros: [
            'Friendly onboarding and clean visual design',
            'Built-in discussions and social feed',
            'Good mobile apps',
        ],
        cons: [
            'Smaller catalogue than MAL or AniList',
            'Metadata occasionally lags behind new releases',
        ],
        url: 'https://kitsu.app',
    },
    {
        name: 'Anime-Planet',
        tagline: 'The recommendation engine.',
        description:
            'One of the oldest anime sites, best known for its hand-curated recommendations and tag-based discovery. Great if you want to find your next show rather than just log the last one.',
        pros: [
            'Excellent recommendations and “if you liked X…” lists',
            'Detailed tag system for mood-based browsing',
            'Covers both anime and manga equally well',
        ],
        cons: [
            'UI shows its age',
            'Tracking features are less flexible than competitors',
        ],
        url: 'https://www.anime-planet.com',
    },
    {
        name: 'Shikimori',
        tagline: 'The power-user’s playground.',
        description:
            'A feature-packed tracker originally from the Russian anime community, now widely used internationally. Deep filtering, clubs, reviews and a very active userbase.',
        pros: [
            'Extremely detailed filters and stats',
            'Strong club/forum culture',
            'Free and ad-light',
        ],
        cons: [
            'Interface can feel dense if you’re not used to it',
            'Some content still skews Russian-language',
        ],
        url: 'https://shikimori.one',
    },
    {
        name: 'AniDB',
        tagline: 'The metadata obsessive’s choice.',
        description:
            'A non-profit, community-run database obsessed with getting the metadata exactly right. Loved by automation tools (Plex, Jellyfin, Sonarr) for its precise episode and release data.',
        pros: [
            'Unmatched accuracy of episode and release metadata',
            'Integrates with home-media tooling',
            'Run by the community, not a company',
        ],
        cons: [
            'UI is the definition of utilitarian',
            'Tracking/social features are minimal',
        ],
        url: 'https://anidb.net',
    },
]

const recommendations: { title: string; body: string }[] = [
    {
        title: 'If you want the best balance of speed, design and features → AniTrack',
        body:
            'A modern UI, AniList-powered data, seasonal schedules and MAL/AniList import make it the easiest place to land today — especially if you’re tired of clunky, ad-laden alternatives.',
    },
    {
        title: 'If you care about community size above all → MyAnimeList',
        body:
            'Nothing beats MAL for sheer volume of reviews and forum activity. Just be ready for the dated UI and the ads.',
    },
    {
        title: 'If you love stats, graphs and a modern API → AniList',
        body:
            'Great data visualisation and a first-class GraphQL API. A solid daily-driver for data nerds.',
    },
    {
        title: 'If you want something friendly and sociable → Kitsu',
        body:
            'Probably the easiest tracker for a total newcomer to pick up and enjoy.',
    },
    {
        title: 'If you need recommendations more than tracking → Anime-Planet',
        body:
            'Its tag-based discovery and curated lists are still hard to beat.',
    },
    {
        title: 'If you’re a power user who wants every knob → Shikimori',
        body:
            'Deep filters, clubs and reviews for people who live inside their tracker.',
    },
    {
        title: 'If you automate your anime library → AniDB',
        body:
            'The right pick when metadata accuracy matters more than UI polish.',
    },
]
</script>

<template>
    <Head title="MyAnimeList Alternatives">
        <meta
            name="description"
            content="A side-by-side look at the best MyAnimeList alternatives, including AniTrack, AniList, Kitsu, Anime-Planet, Shikimori and AniDB — with honest pros, cons and recommendations."
        />
        <link rel="canonical" :href="route('alternatives')" />
    </Head>

    <div class="mx-auto max-w-4xl space-y-10 py-4">
        <header class="space-y-3">
            <h1 class="text-3xl font-bold">MyAnimeList Alternatives</h1>
            <p class="text-gray-400 leading-relaxed">
                MyAnimeList has been the default anime tracker for well over a decade, but it’s far from the only
                option. Here’s an honest, up-to-date look at the main alternatives — starting, shamelessly, with us.
                For each one we’ve broken down what it is, what it does well, where it falls short, and at the
                bottom we’ve put together a short recommendation list to help you pick.
            </p>
        </header>

        <section class="space-y-6">
            <h2 class="text-2xl font-semibold text-gray-100">The platforms</h2>

            <article
                v-for="platform in platforms"
                :key="platform.name"
                class="rounded-lg border p-6 space-y-4"
                :class="
                    platform.highlight
                        ? 'border-primary-500/60 bg-primary-500/5'
                        : 'border-gray-800 bg-gray-900/40'
                "
            >
                <div class="flex flex-wrap items-baseline justify-between gap-2">
                    <div class="space-y-1">
                        <h3 class="text-xl font-semibold text-gray-100">
                            {{ platform.name }}
                            <span
                                v-if="platform.highlight"
                                class="ml-2 rounded-full bg-primary-500/20 px-2 py-0.5 text-xs font-medium text-primary-300 align-middle"
                            >
                                Our pick
                            </span>
                        </h3>
                        <p class="text-sm text-gray-400">{{ platform.tagline }}</p>
                    </div>
                    <a
                        v-if="platform.url"
                        :href="platform.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-sm text-primary-400 hover:text-primary-300"
                    >
                        Visit site →
                    </a>
                </div>

                <p class="text-gray-400 leading-relaxed">{{ platform.description }}</p>

                <div class="grid gap-4 sm:grid-cols-2">
                    <div class="space-y-2">
                        <h4 class="text-sm font-semibold uppercase tracking-wide text-emerald-400">The good</h4>
                        <ul class="list-disc space-y-1 pl-5 text-sm text-gray-300">
                            <li v-for="pro in platform.pros" :key="pro">{{ pro }}</li>
                        </ul>
                    </div>
                    <div class="space-y-2">
                        <h4 class="text-sm font-semibold uppercase tracking-wide text-rose-400">The bad</h4>
                        <ul class="list-disc space-y-1 pl-5 text-sm text-gray-300">
                            <li v-for="con in platform.cons" :key="con">{{ con }}</li>
                        </ul>
                    </div>
                </div>
            </article>
        </section>

        <section class="space-y-4">
            <h2 class="text-2xl font-semibold text-gray-100">What we recommend</h2>
            <p class="text-gray-400 leading-relaxed">
                There’s no single right answer — it depends on what you actually want from a tracker. In rough
                order, here’s how we’d suggest picking:
            </p>
            <ol class="list-decimal space-y-3 pl-6 text-gray-300">
                <li v-for="rec in recommendations" :key="rec.title">
                    <p class="font-semibold text-gray-100">{{ rec.title }}</p>
                    <p class="text-gray-400 text-sm leading-relaxed">{{ rec.body }}</p>
                </li>
            </ol>
        </section>
    </div>
</template>
