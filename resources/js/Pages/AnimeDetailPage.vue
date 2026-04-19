<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePage, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { useFeature } from '@/composables/useFeature'
import ScoreBadge from '@/Components/ScoreBadge.vue'
import AddToListButton from '@/Components/AddToListButton.vue'
import type { AnimeDetail, SeasonEntry, StudioEntry, VoiceActorEntry } from '@/types/anime'
import type { ListEntryResource, User } from '@/types'
import { useCountdown } from '@/composables/useCountdown'

defineOptions({ layout: AppLayout })

interface OgMeta {
    title: string
    description: string
    image: string | null
    url: string
}

const props = defineProps<{
    anime: AnimeDetail
    list_entry: ListEntryResource | null
    seasons: SeasonEntry[]
    og: OgMeta
}>()

const page = usePage<{ auth: { user: User | null } }>()
const isAuthenticated = computed(() => !!page.props.auth.user)
const studioPagesEnabled = useFeature('studio-pages')
const voiceActorPagesEnabled = useFeature('voice-actor-pages')

const { formatCountdown, formatLocalDate } = useCountdown()

function displayTitle(anime: AnimeDetail): string {
    return anime.title_english || anime.title_romaji
}

function formatLabel(format: string | null): string {
    if (!format) return 'Unknown'
    return format.replace(/_/g, ' ')
}

function statusLabel(status: string | null): string {
    if (!status) return 'Unknown'
    const map: Record<string, string> = {
        FINISHED: 'Finished',
        RELEASING: 'Airing',
        NOT_YET_RELEASED: 'Not Yet Aired',
        CANCELLED: 'Cancelled',
        HIATUS: 'Hiatus',
    }
    return map[status] || status
}

function sourceLabel(source: string | null): string {
    if (!source) return 'Unknown'
    return source.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function seasonLabel(season: string | null, year: number | null): string {
    if (!season || !year) return 'Unknown'
    return `${season.charAt(0) + season.slice(1).toLowerCase()} ${year}`
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '?'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function relationLabel(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const mainStudios = computed(() => props.anime.studios?.filter(s => s.is_main) ?? [])
const otherStudios = computed(() => props.anime.studios?.filter(s => !s.is_main) ?? [])

function studioRoute(studio: StudioEntry): string | null {
    if (!studio.slug) return null
    const routeName = studio.is_animation_studio ? 'studios.show' : 'producers.show'
    return route(routeName, { studio: studio.slug })
}

function voiceActorRoute(va: VoiceActorEntry): string | null {
    if (!va.slug) return null
    return route('people.show', { person: va.slug })
}

function languageLabel(language: string): string {
    const map: Record<string, string> = {
        JAPANESE: 'JP',
        ENGLISH: 'EN',
    }
    return map[language] ?? language.slice(0, 2).toUpperCase()
}

function sortedVoiceActors(vas: VoiceActorEntry[]): VoiceActorEntry[] {
    const order: Record<string, number> = { JAPANESE: 0, ENGLISH: 1 }
    return [...vas].sort((a, b) => (order[a.language] ?? 99) - (order[b.language] ?? 99))
}

const characters = computed(() => props.anime.characters ?? [])
const mainCharacters = computed(() => characters.value.filter(c => c.role === 'MAIN'))
const supportingCharacters = computed(() => characters.value.filter(c => c.role !== 'MAIN'))
const displayCharacters = computed(() => [...mainCharacters.value, ...supportingCharacters.value])

const schedules = computed(() => props.anime.airing_schedules ?? [])
const relations = computed(() => (props.anime.relations ?? []).filter(r => r.related_anime))
const hasTrailer = computed(() => !!props.anime.trailer_url && !!embedUrl(props.anime.trailer_url!))
const hasSeasons = computed(() => props.seasons.length > 1)

function embedUrl(url: string): string | null {
    try {
        const parsed = new URL(url)
        if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
            const videoId = parsed.searchParams.get('v') || parsed.pathname.slice(1)
            return `https://www.youtube.com/embed/${videoId}`
        }
        if (parsed.hostname.includes('dailymotion.com')) {
            const videoId = parsed.pathname.split('/').pop()
            return `https://www.dailymotion.com/embed/video/${videoId}`
        }
        return null
    } catch {
        return null
    }
}

// Tabs — only show those with content
type TabKey = 'trailer' | 'seasons' | 'schedule' | 'characters'
const availableTabs = computed<{ key: TabKey; label: string }[]>(() => {
    const tabs: { key: TabKey; label: string }[] = []
    if (hasTrailer.value) tabs.push({ key: 'trailer', label: 'Trailer' })
    if (hasSeasons.value) tabs.push({ key: 'seasons', label: 'Seasons' })
    if (schedules.value.length) tabs.push({ key: 'schedule', label: 'Schedule' })
    if (characters.value.length) tabs.push({ key: 'characters', label: 'Characters' })
    return tabs
})

const activeTab = ref<TabKey | null>(null)

const currentTab = computed<TabKey | null>(() => {
    if (activeTab.value && availableTabs.value.some(t => t.key === activeTab.value)) {
        return activeTab.value
    }
    return availableTabs.value[0]?.key ?? null
})

function setTab(key: TabKey) {
    activeTab.value = key
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back()
    } else {
        router.visit(route('anime.index'))
    }
}

function displayScore(): string {
    if (props.anime.average_score == null) return '—'
    return props.anime.average_score.toFixed(1)
}
</script>

<template>
    <Head :title="displayTitle(anime)">
        <meta name="description" :content="og.description" />
        <link rel="canonical" :href="og.url" />
        <meta property="og:title" :content="og.title" />
        <meta property="og:description" :content="og.description" />
        <meta v-if="og.image" property="og:image" :content="og.image" />
        <meta property="og:url" :content="og.url" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="og.title" />
        <meta name="twitter:description" :content="og.description" />
        <meta v-if="og.image" name="twitter:image" :content="og.image" />
    </Head>

    <div class="-mx-4 -mt-6">
        <!-- Banner hero -->
        <div class="relative h-64 overflow-hidden bg-gray-900 md:h-80 lg:h-[340px]">
            <img
                v-if="anime.banner_image"
                :src="anime.banner_image"
                :alt="displayTitle(anime)"
                class="h-full w-full object-cover"
                loading="eager"
            />
            <div
                v-else
                class="h-full w-full"
                :style="anime.cover_image_color
                    ? `background: radial-gradient(circle at 30% 50%, ${anime.cover_image_color}33, transparent 60%), linear-gradient(135deg, ${anime.cover_image_color}55, #111827);`
                    : 'background: linear-gradient(135deg, #1f2937, #030712);'"
            />
            <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-gray-950" />

            <button
                type="button"
                class="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs text-gray-100 backdrop-blur-md transition hover:bg-black/70 md:left-6 md:top-6"
                @click="goBack"
            >
                <svg viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                    <path fill-rule="evenodd" d="M12.707 4.293a1 1 0 010 1.414L8.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Back
            </button>
        </div>

        <!-- Hero content -->
        <div class="container relative mx-auto -mt-40 px-4 md:-mt-44">
            <div class="flex flex-col items-start gap-5 md:flex-row md:items-end md:gap-8">
                <!-- Cover -->
                <div class="w-36 shrink-0 overflow-hidden rounded-xl bg-gray-800 shadow-2xl ring-1 ring-gray-800 md:w-48 lg:w-56">
                    <img
                        v-if="anime.cover_image_large || anime.cover_image_medium"
                        :src="anime.cover_image_large || anime.cover_image_medium!"
                        :alt="displayTitle(anime)"
                        class="w-full"
                        loading="eager"
                    />
                </div>

                <!-- Title block -->
                <div class="min-w-0 flex-1 pb-2">
                    <div class="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-300 drop-shadow">
                        {{ formatLabel(anime.format) }}
                        <span v-if="anime.season && anime.season_year"> · {{ seasonLabel(anime.season, anime.season_year) }}</span>
                        <span v-if="mainStudios.length"> · {{ mainStudios.map(s => s.name).join(' × ') }}</span>
                    </div>
                    <h1 class="text-3xl font-bold tracking-tight text-gray-100 drop-shadow-lg sm:text-4xl md:text-5xl">
                        {{ displayTitle(anime) }}
                    </h1>
                    <p
                        v-if="anime.title_english && anime.title_romaji !== anime.title_english"
                        class="mt-2 text-sm text-gray-300 drop-shadow"
                    >
                        {{ anime.title_romaji }}
                    </p>
                    <p v-if="anime.title_native" class="text-xs text-gray-400 drop-shadow">{{ anime.title_native }}</p>

                    <div v-if="anime.genres?.length" class="mt-4 flex flex-wrap gap-1.5">
                        <Link
                            v-for="g in anime.genres"
                            :key="g.id"
                            :href="route('anime.index', { 'filter[genre]': g.name })"
                            class="rounded-full border border-gray-700/80 bg-gray-900/60 px-3 py-1 text-xs text-gray-200 backdrop-blur-md transition hover:border-primary-400 hover:text-primary-300"
                        >
                            {{ g.name }}
                        </Link>
                    </div>
                </div>
            </div>

            <!-- Action bar -->
            <div class="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/70 px-4 py-3 backdrop-blur-sm md:px-5">
                <template v-if="isAuthenticated && list_entry">
                    <div class="min-w-[180px]">
                        <AddToListButton :anime="anime" :initial-entry="list_entry" />
                    </div>
                    <div class="hidden h-6 w-px bg-gray-800 sm:block" />
                    <div class="text-sm">
                        <span class="font-mono font-medium text-gray-100">{{ list_entry.progress }} / {{ anime.episodes ?? '?' }}</span>
                        <span class="ml-2 text-gray-500">episodes</span>
                    </div>
                    <template v-if="list_entry.display_score != null">
                        <div class="hidden h-6 w-px bg-gray-800 sm:block" />
                        <div class="text-sm">
                            <span class="font-mono text-gray-100">★ {{ list_entry.display_score }}</span>
                            <span class="ml-2 text-gray-500">your score</span>
                        </div>
                    </template>
                </template>
                <template v-else-if="isAuthenticated">
                    <div class="text-sm text-gray-400">Not in your list</div>
                    <div class="min-w-[180px]">
                        <AddToListButton :anime="anime" :initial-entry="null" />
                    </div>
                </template>
                <template v-else>
                    <div class="text-sm text-gray-400">
                        <Link :href="route('login')" class="text-primary-400 transition hover:text-primary-300">Sign in</Link>
                        to track this anime
                    </div>
                </template>

                <div class="flex-1" />

                <div class="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-gray-500">
                    <span class="hidden sm:inline">Status</span>
                    <span class="rounded-full bg-gray-800 px-2 py-0.5 text-gray-300">{{ statusLabel(anime.status) }}</span>
                </div>
            </div>
        </div>

        <!-- Main grid -->
        <div class="container mx-auto mt-10 px-4 pb-16">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <!-- Left column -->
                <div class="min-w-0 space-y-8">
                    <!-- Synopsis -->
                    <section v-if="anime.synopsis">
                        <div class="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-500">Synopsis</div>
                        <div class="prose prose-invert prose-p:text-gray-200 prose-p:leading-relaxed max-w-none text-[15px]">
                            <div v-html="anime.synopsis" />
                        </div>
                    </section>

                    <!-- Tabs -->
                    <section v-if="availableTabs.length">
                        <div class="flex items-center gap-1 overflow-x-auto border-b border-gray-800">
                            <button
                                v-for="t in availableTabs"
                                :key="t.key"
                                type="button"
                                class="-mb-px whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm transition"
                                :class="currentTab === t.key
                                    ? 'border-primary-400 font-medium text-primary-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'"
                                @click="setTab(t.key)"
                            >
                                {{ t.label }}
                            </button>
                        </div>

                        <div class="pt-5">
                            <!-- Trailer -->
                            <div v-if="currentTab === 'trailer' && anime.trailer_url && embedUrl(anime.trailer_url)">
                                <div class="aspect-video overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                                    <iframe
                                        :src="embedUrl(anime.trailer_url)!"
                                        class="h-full w-full"
                                        allowfullscreen
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            <!-- Seasons -->
                            <div v-else-if="currentTab === 'seasons'">
                                <div class="mb-4 flex items-baseline justify-between">
                                    <div>
                                        <div class="font-mono text-[11px] uppercase tracking-[0.08em] text-gray-500">Franchise timeline</div>
                                        <div class="mt-1 text-sm text-gray-400">{{ seasons.length }} entries</div>
                                    </div>
                                </div>
                                <div class="relative pl-7">
                                    <div class="absolute bottom-2 left-[11px] top-2 w-px bg-gray-800" />
                                    <div
                                        v-for="(s, i) in seasons"
                                        :key="s.id"
                                        class="relative pb-3 last:pb-0"
                                    >
                                        <div
                                            class="absolute -left-[22px] top-5 flex h-4 w-4 items-center justify-center rounded-full border-2"
                                            :class="s.is_current
                                                ? 'border-primary-400 bg-primary-400 shadow-[0_0_0_4px_rgba(129,140,248,0.15)]'
                                                : 'border-gray-700 bg-gray-900'"
                                        />
                                        <component
                                            :is="s.slug && !s.is_current ? 'Link' : 'div'"
                                            v-bind="s.slug && !s.is_current ? { href: route('anime.show', { anime: s.slug }) } : {}"
                                            class="flex items-center gap-4 rounded-xl border bg-gray-900/50 p-3 transition"
                                            :class="s.is_current
                                                ? 'border-primary-400/60'
                                                : 'border-gray-800 hover:border-gray-700'"
                                        >
                                            <div class="h-[78px] w-[56px] shrink-0 overflow-hidden rounded-md bg-gray-800">
                                                <img
                                                    v-if="s.cover_image_large || s.cover_image_medium"
                                                    :src="(s.cover_image_large || s.cover_image_medium) ?? undefined"
                                                    :alt="s.title_english || s.title_romaji"
                                                    class="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <div class="mb-1 flex flex-wrap items-center gap-2">
                                                    <span class="font-mono text-[10px] uppercase tracking-[0.08em] text-gray-500">
                                                        Season {{ i + 1 }}
                                                    </span>
                                                    <span
                                                        v-if="s.is_current"
                                                        class="rounded-full bg-primary-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-300"
                                                    >
                                                        Currently watching
                                                    </span>
                                                </div>
                                                <div class="truncate text-sm font-medium text-gray-100">
                                                    {{ s.title_english || s.title_romaji }}
                                                </div>
                                                <div class="mt-1 font-mono text-xs text-gray-500">
                                                    {{ formatLabel(s.format) }} · {{ s.episodes ?? '?' }} ep
                                                </div>
                                            </div>
                                            <ScoreBadge :score="s.average_score" size="sm" />
                                        </component>
                                    </div>
                                </div>
                            </div>

                            <!-- Schedule -->
                            <div v-else-if="currentTab === 'schedule'" class="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
                                <div
                                    v-for="(s, i) in schedules"
                                    :key="s.id"
                                    class="flex items-center gap-4 px-4 py-3"
                                    :class="i > 0 ? 'border-t border-gray-800' : ''"
                                >
                                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-800 font-mono text-xs font-semibold text-gray-300">
                                        {{ String(s.episode).padStart(2, '0') }}
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-gray-100">Episode {{ s.episode }}</div>
                                        <div class="mt-0.5 font-mono text-[11px] text-gray-500">{{ formatLocalDate(s.airs_at) }}</div>
                                    </div>
                                    <div class="font-mono text-xs font-medium text-primary-400">
                                        {{ formatCountdown(s.airs_at) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Characters -->
                            <div v-else-if="currentTab === 'characters'" class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div
                                    v-for="char in displayCharacters.slice(0, 20)"
                                    :key="char.id"
                                    class="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50"
                                >
                                    <div class="flex items-stretch justify-between gap-2">
                                        <div class="flex min-w-0 flex-1 items-center gap-2 p-2">
                                            <div class="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-800">
                                                <img
                                                    v-if="char.image_medium"
                                                    :src="char.image_medium"
                                                    :alt="char.name_full"
                                                    class="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div class="min-w-0">
                                                <p class="truncate text-sm font-medium text-gray-100">{{ char.name_full }}</p>
                                                <p v-if="char.role" class="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                                                    {{ char.role === 'MAIN' ? 'Main' : char.role === 'SUPPORTING' ? 'Supporting' : 'Background' }}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            v-if="char.voice_actors?.length"
                                            class="flex min-w-0 flex-1 flex-col justify-center gap-1 p-2"
                                        >
                                            <div
                                                v-for="va in sortedVoiceActors(char.voice_actors)"
                                                :key="`${va.id}-${va.language}`"
                                                class="flex items-center justify-end gap-2"
                                            >
                                                <span class="shrink-0 rounded bg-gray-800 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-gray-400">
                                                    {{ languageLabel(va.language) }}
                                                </span>
                                                <div class="min-w-0 text-right">
                                                    <component
                                                        :is="voiceActorPagesEnabled && voiceActorRoute(va) ? 'Link' : 'span'"
                                                        v-bind="voiceActorPagesEnabled && voiceActorRoute(va)
                                                            ? { href: voiceActorRoute(va) }
                                                            : {}"
                                                        class="block truncate text-sm"
                                                        :class="voiceActorPagesEnabled && voiceActorRoute(va)
                                                            ? 'text-primary-400 hover:text-primary-300 transition'
                                                            : 'text-gray-300'"
                                                    >
                                                        {{ va.name_full }}
                                                    </component>
                                                </div>
                                                <div class="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-800">
                                                    <img
                                                        v-if="va.image_medium"
                                                        :src="va.image_medium"
                                                        :alt="va.name_full"
                                                        class="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Right sidebar -->
                <aside class="space-y-4">
                    <!-- Info grid -->
                    <div class="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                        <div class="grid grid-cols-2 gap-x-4 gap-y-4">
                            <div>
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Score</div>
                                <div class="text-sm font-medium text-gray-100">★ {{ displayScore() }}</div>
                            </div>
                            <div v-if="anime.popularity">
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Popularity</div>
                                <div class="text-sm font-medium text-gray-100">#{{ anime.popularity.toLocaleString() }}</div>
                            </div>
                            <div>
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Format</div>
                                <div class="text-sm font-medium text-gray-100">{{ formatLabel(anime.format) }}</div>
                            </div>
                            <div>
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Episodes</div>
                                <div class="text-sm font-medium text-gray-100">{{ anime.episodes ?? '?' }}</div>
                            </div>
                            <div v-if="anime.duration">
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Duration</div>
                                <div class="text-sm font-medium text-gray-100">{{ anime.duration }} min</div>
                            </div>
                            <div v-if="anime.season && anime.season_year">
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Season</div>
                                <div class="text-sm font-medium text-gray-100">{{ seasonLabel(anime.season, anime.season_year) }}</div>
                            </div>
                            <div v-if="anime.aired_from" class="col-span-2">
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Aired</div>
                                <div class="text-sm font-medium text-gray-100">
                                    {{ formatDate(anime.aired_from) }}
                                    <span v-if="anime.aired_to"> – {{ formatDate(anime.aired_to) }}</span>
                                </div>
                            </div>
                            <div v-if="anime.source">
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Source</div>
                                <div class="text-sm font-medium text-gray-100">{{ sourceLabel(anime.source) }}</div>
                            </div>
                            <div>
                                <div class="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Status</div>
                                <div class="text-sm font-medium text-gray-100">{{ statusLabel(anime.status) }}</div>
                            </div>
                        </div>

                        <div v-if="mainStudios.length" class="mt-5 border-t border-gray-800 pt-4">
                            <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">
                                Studio{{ mainStudios.length > 1 ? 's' : '' }}
                            </div>
                            <div class="flex flex-wrap gap-1.5">
                                <component
                                    :is="studioPagesEnabled && studioRoute(s) ? 'Link' : 'span'"
                                    v-for="s in mainStudios"
                                    :key="s.id"
                                    v-bind="studioPagesEnabled && studioRoute(s) ? { href: studioRoute(s) } : {}"
                                    class="rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs font-medium transition"
                                    :class="studioPagesEnabled && studioRoute(s)
                                        ? 'text-gray-100 hover:border-primary-400 hover:text-primary-300'
                                        : 'text-gray-200'"
                                >
                                    {{ s.name }}
                                </component>
                            </div>
                        </div>

                        <div v-if="otherStudios.length" class="mt-4">
                            <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-gray-500">Producers</div>
                            <div class="flex flex-wrap gap-1.5">
                                <component
                                    :is="studioPagesEnabled && studioRoute(s) ? 'Link' : 'span'"
                                    v-for="s in otherStudios"
                                    :key="s.id"
                                    v-bind="studioPagesEnabled && studioRoute(s) ? { href: studioRoute(s) } : {}"
                                    class="rounded-full border border-gray-700 px-2.5 py-1 text-xs transition"
                                    :class="studioPagesEnabled && studioRoute(s)
                                        ? 'text-gray-300 hover:border-primary-400 hover:text-primary-300'
                                        : 'text-gray-300'"
                                >
                                    {{ s.name }}
                                </component>
                            </div>
                        </div>
                    </div>

                    <!-- External links -->
                    <div v-if="anime.external_ids?.length" class="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                        <div class="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-500">External links</div>
                        <div class="flex flex-wrap gap-1.5">
                            <a
                                v-for="link in anime.external_ids"
                                :key="link.id"
                                :href="link.url ?? '#'"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="rounded-full border border-gray-700 px-2.5 py-1 text-xs text-gray-300 transition hover:border-primary-400 hover:text-primary-300"
                            >
                                {{ link.platform }}
                            </a>
                        </div>
                    </div>

                    <!-- Related preview -->
                    <div v-if="relations.length" class="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                        <div class="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-500">Related</div>
                        <Link
                            v-for="rel in relations.slice(0, 4)"
                            :key="rel.id"
                            :href="rel.related_anime?.slug ? route('anime.show', { anime: rel.related_anime.slug }) : '#'"
                            class="group flex items-center gap-3 border-t border-gray-800 py-2.5 first:border-t-0"
                        >
                            <div class="h-14 w-10 shrink-0 overflow-hidden rounded-md bg-gray-800">
                                <img
                                    v-if="rel.related_anime?.cover_image_medium"
                                    :src="rel.related_anime.cover_image_medium"
                                    :alt="rel.related_anime?.title_english || rel.related_anime?.title_romaji"
                                    class="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="truncate text-sm font-medium text-gray-200 transition group-hover:text-primary-300">
                                    {{ rel.related_anime?.title_english || rel.related_anime?.title_romaji }}
                                </div>
                                <div class="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                                    {{ relationLabel(rel.relation_type) }}
                                </div>
                            </div>
                        </Link>
                    </div>
                </aside>
            </div>

            <!-- Recommendations row -->
            <div v-if="relations.length > 4" class="mt-14 border-t border-gray-800 pt-10">
                <div class="mb-5">
                    <div class="font-mono text-[11px] uppercase tracking-[0.1em] text-gray-500">If you like this, try</div>
                    <h2 class="mt-1 text-xl font-semibold text-gray-100">You might also enjoy</h2>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    <Link
                        v-for="rel in relations.slice(0, 6)"
                        :key="rel.id"
                        :href="rel.related_anime?.slug ? route('anime.show', { anime: rel.related_anime.slug }) : '#'"
                        class="group"
                    >
                        <div class="aspect-[3/4] overflow-hidden rounded-lg bg-gray-800 transition group-hover:ring-1 group-hover:ring-gray-600">
                            <img
                                v-if="rel.related_anime?.cover_image_medium"
                                :src="rel.related_anime.cover_image_medium"
                                :alt="rel.related_anime?.title_english || rel.related_anime?.title_romaji"
                                class="h-full w-full object-cover transition-transform group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                        <div class="mt-2 line-clamp-2 text-xs font-medium text-gray-200 transition group-hover:text-primary-300">
                            {{ rel.related_anime?.title_english || rel.related_anime?.title_romaji }}
                        </div>
                        <div class="mt-1 font-mono text-[10px] uppercase tracking-wider text-gray-500">
                            ★ {{ rel.related_anime?.average_score?.toFixed(1) ?? '—' }} · {{ relationLabel(rel.relation_type) }}
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>
</template>
