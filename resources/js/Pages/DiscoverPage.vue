<script setup lang="ts">
import { computed, ref } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import AnimeCard from '@/Components/AnimeCard.vue'
import ScoreBadge from '@/Components/ScoreBadge.vue'
import { useDiscoverMood, type DiscoverLength } from '@/composables/useDiscoverMood'
import type { AnimeCard as AnimeCardType } from '@/types/anime'

defineOptions({ layout: AppLayout })

interface Mood {
    slug: string
    label: string
    description: string | null
    emoji: string | null
    gradient: string | null
}

interface LengthOption {
    value: DiscoverLength
    label: string
}

interface MoreLikeIt {
    anchor: AnimeCardType
    similar: AnimeCardType[]
}

interface PickedForYou {
    source: 'precomputed' | 'live'
    items: AnimeCardType[]
}

defineProps<{
    moods: Mood[]
    trending: AnimeCardType[]
    hiddenGems: AnimeCardType[]
    lengths: LengthOption[]
    moreLikeIt: MoreLikeIt | null
    pickedForYou: PickedForYou | null
}>()

const selectedMood = ref<string | null>(null)
const selectedLength = ref<DiscoverLength | null>(null)

const { results: moodResults, isLoading: moodLoading } = useDiscoverMood(
    selectedMood,
    selectedLength,
)

const activeMood = computed(() => selectedMood.value)

function selectMood(slug: string) {
    selectedMood.value = selectedMood.value === slug ? null : slug
}

function toggleLength(value: DiscoverLength) {
    selectedLength.value = selectedLength.value === value ? null : value
}

function displayTitle(anime: AnimeCardType): string {
    return anime.title_english || anime.title_romaji
}

function animeUrl(anime: AnimeCardType): string {
    if (anime.slug) {
        return route('anime.show', { anime: anime.slug })
    }
    if (anime.anilist_id) {
        return route('anime.show.anilist', { anilistId: anime.anilist_id })
    }
    return '#'
}
</script>

<template>
    <Head title="Discover">
        <meta name="description" content="Discover anime by mood, find hidden gems, and see what's trending this week on AniTrack." />
        <link rel="canonical" :href="route('discover')" />
        <meta property="og:title" content="Discover — AniTrack" />
        <meta property="og:description" content="Find anime by mood, length, and taste." />
        <meta property="og:type" content="website" />
    </Head>

    <div class="space-y-14">
        <!-- I'm in the mood for -->
        <section>
            <header class="mb-6">
                <h1 class="text-3xl font-bold text-gray-100">Discover</h1>
                <p class="mt-1 text-gray-400">Start with a mood — we'll do the rest.</p>
            </header>

            <h2 class="mb-4 text-lg font-semibold text-gray-200">I'm in the mood for…</h2>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <button
                    v-for="mood in moods"
                    :key="mood.slug"
                    type="button"
                    class="relative overflow-hidden rounded-xl border p-4 text-left transition"
                    :class="[
                        activeMood === mood.slug
                            ? 'border-primary-400 ring-2 ring-primary-400/40'
                            : 'border-gray-800 hover:border-gray-700',
                    ]"
                    @click="selectMood(mood.slug)"
                >
                    <div
                        class="absolute inset-0 bg-gradient-to-br opacity-60"
                        :class="mood.gradient ?? 'from-gray-700/30 to-gray-900/30'"
                    />
                    <div class="relative">
                        <div class="text-2xl">{{ mood.emoji }}</div>
                        <div class="mt-2 font-semibold text-gray-100">{{ mood.label }}</div>
                        <div v-if="mood.description" class="mt-1 text-xs text-gray-300/80">
                            {{ mood.description }}
                        </div>
                    </div>
                </button>
            </div>

            <!-- Filters -->
            <div class="mt-6 flex flex-wrap items-center gap-2">
                <span class="text-sm text-gray-500">Length:</span>
                <button
                    v-for="opt in lengths"
                    :key="opt.value"
                    type="button"
                    class="rounded-full border px-3 py-1 text-xs transition"
                    :class="[
                        selectedLength === opt.value
                            ? 'border-primary-400 bg-primary-500/10 text-primary-300'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200',
                    ]"
                    @click="toggleLength(opt.value)"
                >
                    {{ opt.label }}
                </button>
            </div>

            <!-- Mood results -->
            <div v-if="activeMood" class="mt-8">
                <div v-if="moodLoading" class="py-12 text-center text-gray-500">
                    Finding matches…
                </div>
                <div
                    v-else-if="moodResults.length"
                    class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                >
                    <AnimeCard
                        v-for="anime in moodResults"
                        :key="anime.id ?? anime.anilist_id"
                        :anime="anime"
                        view-mode="grid"
                    />
                </div>
                <div v-else class="py-12 text-center text-gray-500">
                    No matches for that combination. Try a different length.
                </div>
            </div>
        </section>

        <!-- More Like It -->
        <section v-if="moreLikeIt">
            <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-100">More like it</h2>
                <p class="mt-1 text-sm text-gray-400">
                    Because you liked
                    <Link :href="animeUrl(moreLikeIt.anchor)" class="font-medium text-primary-400 hover:text-primary-300">
                        {{ displayTitle(moreLikeIt.anchor) }}
                    </Link>
                </p>
            </div>

            <div class="flex gap-4 overflow-x-auto pb-4">
                <div
                    v-for="anime in moreLikeIt.similar"
                    :key="anime.id ?? anime.anilist_id"
                    class="w-36 shrink-0"
                >
                    <AnimeCard :anime="anime" view-mode="grid" />
                </div>
            </div>
        </section>

        <!-- Picked For You -->
        <section v-if="pickedForYou && pickedForYou.items.length">
            <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-100">Picked for you</h2>
                <p class="mt-1 text-sm text-gray-400">Tuned to the titles you've rated.</p>
            </div>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <AnimeCard
                    v-for="anime in pickedForYou.items"
                    :key="anime.id ?? anime.anilist_id"
                    :anime="anime"
                    view-mode="grid"
                />
            </div>
        </section>
        <section v-else-if="pickedForYou">
            <h2 class="mb-3 text-xl font-bold text-gray-100">Picked for you</h2>
            <div class="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-8 text-center">
                <p class="text-gray-300">Rate a few titles you've enjoyed and we'll tune recommendations to your taste.</p>
            </div>
        </section>

        <!-- Hidden Gems -->
        <section v-if="hiddenGems.length">
            <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-100">Hidden gems</h2>
                <p class="mt-1 text-sm text-gray-400">Highly rated, rarely watched.</p>
            </div>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <AnimeCard
                    v-for="anime in hiddenGems"
                    :key="anime.id ?? anime.anilist_id"
                    :anime="anime"
                    view-mode="grid"
                />
            </div>
        </section>

        <!-- Trending Top 10 -->
        <section v-if="trending.length">
            <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-100">Trending this week</h2>
                <p class="mt-1 text-sm text-gray-400">The top 10 right now.</p>
            </div>
            <ol class="space-y-3">
                <li
                    v-for="(anime, index) in trending"
                    :key="anime.id ?? anime.anilist_id"
                    class="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/40 p-3 transition hover:border-gray-700"
                >
                    <div class="w-10 shrink-0 text-center text-3xl font-bold text-gray-600 tabular-nums">
                        {{ index + 1 }}
                    </div>
                    <Link
                        :href="animeUrl(anime)"
                        class="flex min-w-0 flex-1 items-center gap-4"
                    >
                        <div class="h-20 w-14 shrink-0 overflow-hidden rounded bg-gray-800">
                            <img
                                v-if="anime.cover_image_medium || anime.cover_image_large"
                                :src="(anime.cover_image_medium || anime.cover_image_large) ?? undefined"
                                :alt="displayTitle(anime)"
                                class="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="truncate text-base font-semibold text-gray-100">
                                {{ displayTitle(anime) }}
                            </h3>
                            <div class="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <span v-if="anime.format">{{ anime.format.replace(/_/g, ' ') }}</span>
                                <span v-if="anime.season_year">{{ anime.season_year }}</span>
                                <ScoreBadge :score="anime.average_score" size="sm" />
                            </div>
                        </div>
                    </Link>
                </li>
            </ol>
        </section>
    </div>
</template>
