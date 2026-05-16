<script setup lang="ts">
import { computed, ref } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import AnimeCard from '@/Components/AnimeCard.vue'
import ScoreBadge from '@/Components/ScoreBadge.vue'
import SearchBar from '@/Components/SearchBar.vue'
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
        <meta name="description" content="AniTrack — discover, track and manage your anime. Find what to watch next by mood, see what's trending this week, and uncover hidden gems." />
        <link rel="canonical" :href="route('discover')" />
        <meta property="og:title" content="AniTrack — Discover, track and manage your anime" />
        <meta property="og:description" content="Discover, track and manage your anime — all in one place." />
        <meta property="og:type" content="website" />
    </Head>

    <div class="space-y-20">
        <!-- Hero / Search -->
        <section class="pt-6 pb-2 text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
                AniTrack
            </h1>
            <p class="mx-auto mt-3 max-w-xl text-base text-gray-400 sm:text-lg">
                Discover, track and manage your anime.
            </p>
            <div class="mx-auto mt-8 max-w-xl">
                <SearchBar />
            </div>
        </section>

        <!-- Mood Picker -->
        <section>
            <header class="mb-6 border-b border-gray-800 pb-4">
                <h2 class="text-2xl font-bold text-gray-100">I'm in the mood for…</h2>
                <p class="mt-1 text-sm text-gray-400">Pick a vibe and we'll find a match.</p>
            </header>

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

            <!-- Mood results (horizontal scroller) -->
            <div v-if="activeMood" class="mt-8">
                <div v-if="moodLoading" class="py-12 text-center text-gray-500">
                    Finding matches…
                </div>
                <div
                    v-else-if="moodResults.length"
                    class="flex gap-4 overflow-x-auto pb-4"
                >
                    <div
                        v-for="anime in moodResults"
                        :key="anime.id ?? anime.anilist_id"
                        class="w-40 shrink-0 sm:w-44"
                    >
                        <AnimeCard :anime="anime" view-mode="grid" />
                    </div>
                </div>
                <div v-else class="py-12 text-center text-gray-500">
                    No matches for that combination. Try a different length.
                </div>
            </div>
        </section>

        <!-- Trending this week (horizontal scroller with rank) -->
        <section v-if="trending.length">
            <header class="mb-6 border-b border-gray-800 pb-4">
                <h2 class="text-2xl font-bold text-gray-100">Trending this week</h2>
                <p class="mt-1 text-sm text-gray-400">The top 10 right now.</p>
            </header>

            <div class="flex gap-4 overflow-x-auto pb-4">
                <Link
                    v-for="(anime, index) in trending"
                    :key="anime.id ?? anime.anilist_id"
                    :href="animeUrl(anime)"
                    class="group relative w-40 shrink-0 sm:w-44"
                >
                    <div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-800">
                        <img
                            v-if="anime.cover_image_large || anime.cover_image_medium"
                            :src="(anime.cover_image_large || anime.cover_image_medium) ?? undefined"
                            :alt="displayTitle(anime)"
                            class="h-full w-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                        />
                        <div
                            class="absolute -bottom-2 -left-2 text-6xl font-black leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-7xl"
                            style="-webkit-text-stroke: 2px rgb(17 24 39);"
                        >
                            {{ index + 1 }}
                        </div>
                        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-right">
                            <ScoreBadge :score="anime.average_score" size="sm" />
                        </div>
                    </div>
                    <h3 class="mt-1.5 line-clamp-2 text-sm font-medium text-gray-200 transition group-hover:text-primary-400">
                        {{ displayTitle(anime) }}
                    </h3>
                </Link>
            </div>
        </section>

        <!-- More Like It -->
        <section v-if="moreLikeIt">
            <header class="mb-6 border-b border-gray-800 pb-4">
                <h2 class="text-2xl font-bold text-gray-100">More like it</h2>
                <p class="mt-1 text-sm text-gray-400">
                    Because you liked
                    <Link :href="animeUrl(moreLikeIt.anchor)" class="font-medium text-primary-400 hover:text-primary-300">
                        {{ displayTitle(moreLikeIt.anchor) }}
                    </Link>
                </p>
            </header>

            <div class="flex gap-4 overflow-x-auto pb-4">
                <div
                    v-for="anime in moreLikeIt.similar"
                    :key="anime.id ?? anime.anilist_id"
                    class="w-40 shrink-0 sm:w-44"
                >
                    <AnimeCard :anime="anime" view-mode="grid" />
                </div>
            </div>
        </section>

        <!-- Picked For You -->
        <section v-if="pickedForYou && pickedForYou.items.length">
            <header class="mb-6 border-b border-gray-800 pb-4">
                <h2 class="text-2xl font-bold text-gray-100">Picked for you</h2>
                <p class="mt-1 text-sm text-gray-400">Tuned to the titles you've rated.</p>
            </header>
            <div class="flex gap-4 overflow-x-auto pb-4">
                <div
                    v-for="anime in pickedForYou.items"
                    :key="anime.id ?? anime.anilist_id"
                    class="w-40 shrink-0 sm:w-44"
                >
                    <AnimeCard :anime="anime" view-mode="grid" />
                </div>
            </div>
        </section>
        <section v-else-if="pickedForYou">
            <header class="mb-6 border-b border-gray-800 pb-4">
                <h2 class="text-2xl font-bold text-gray-100">Picked for you</h2>
            </header>
            <div class="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-8 text-center">
                <p class="text-gray-300">Rate a few titles you've enjoyed and we'll tune recommendations to your taste.</p>
            </div>
        </section>

        <!-- Hidden Gems -->
        <section v-if="hiddenGems.length">
            <header class="mb-6 border-b border-gray-800 pb-4">
                <h2 class="text-2xl font-bold text-gray-100">Hidden gems</h2>
                <p class="mt-1 text-sm text-gray-400">Highly rated, rarely watched.</p>
            </header>
            <div class="flex gap-4 overflow-x-auto pb-4">
                <div
                    v-for="anime in hiddenGems"
                    :key="anime.id ?? anime.anilist_id"
                    class="w-40 shrink-0 sm:w-44"
                >
                    <AnimeCard :anime="anime" view-mode="grid" />
                </div>
            </div>
        </section>
    </div>
</template>
