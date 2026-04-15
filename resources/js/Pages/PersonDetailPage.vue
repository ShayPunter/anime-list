<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'
import PaginationBar from '@/Components/PaginationBar.vue'
import ScoreBadge from '@/Components/ScoreBadge.vue'
import type { PersonDetail, VoiceActorRole } from '@/types/anime'

defineOptions({ layout: AppLayout })

interface OgMeta {
    title: string
    description: string
    image: string | null
    url: string
}

interface RolesData {
    data: VoiceActorRole[]
    meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}

defineProps<{
    person: PersonDetail
    roles: RolesData
    og: OgMeta
}>()

function formatLabel(format: string | null): string {
    if (!format) return ''
    return format.replace(/_/g, ' ')
}

function animeUrl(anime: VoiceActorRole['anime']): string {
    if (!anime) return '#'
    if (anime.slug) return route('anime.show', { anime: anime.slug })
    return '#'
}

function formatBirthdate(date: string | null): string {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>

<template>
    <Head :title="person.name_full">
        <meta name="description" :content="og.description" />
        <link rel="canonical" :href="og.url" />
        <meta property="og:title" :content="og.title" />
        <meta property="og:description" :content="og.description" />
        <meta v-if="og.image" property="og:image" :content="og.image" />
        <meta property="og:url" :content="og.url" />
        <meta property="og:type" content="profile" />
    </Head>

    <div>
        <div class="mb-6 text-sm text-gray-500">
            <Link :href="route('people.index')" class="text-primary-400 hover:text-primary-300">Voice Actors</Link>
            <span class="mx-2 text-gray-600">/</span>
            <span>{{ person.name_full }}</span>
        </div>

        <div class="flex flex-col gap-6 md:flex-row">
            <!-- Portrait + metadata -->
            <div class="w-full shrink-0 md:w-56">
                <div class="overflow-hidden rounded-lg bg-gray-800">
                    <img
                        v-if="person.image_large || person.image_medium"
                        :src="person.image_large || person.image_medium!"
                        :alt="person.name_full"
                        class="w-full"
                        loading="lazy"
                    />
                    <div v-else class="flex aspect-[3/4] items-center justify-center text-gray-600">
                        <span class="text-5xl">?</span>
                    </div>
                </div>

                <div class="mt-4 rounded-lg border border-gray-800 p-3 space-y-2 text-sm">
                    <div v-if="person.gender" class="flex items-start justify-between gap-3">
                        <span class="text-gray-500 shrink-0">Gender</span>
                        <span class="text-gray-200 text-right">{{ person.gender }}</span>
                    </div>
                    <div v-if="person.birthdate" class="flex items-start justify-between gap-3">
                        <span class="text-gray-500 shrink-0">Born</span>
                        <span class="text-gray-200 text-right">{{ formatBirthdate(person.birthdate) }}</span>
                    </div>
                    <div class="flex items-start justify-between gap-3">
                        <span class="text-gray-500 shrink-0">Roles</span>
                        <span class="text-gray-200 text-right">{{ person.role_count.toLocaleString() }}</span>
                    </div>
                    <div v-if="person.site_url" class="pt-1">
                        <a
                            :href="person.site_url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-xs text-primary-400 hover:text-primary-300"
                        >
                            AniList &rarr;
                        </a>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <div class="min-w-0 flex-1 space-y-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-100 md:text-3xl">{{ person.name_full }}</h1>
                    <p v-if="person.name_native" class="mt-1 text-gray-400">{{ person.name_native }}</p>
                </div>

                <div v-if="roles.data.length">
                    <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                        Voice Acting Roles
                    </h2>
                    <div class="space-y-2">
                        <Link
                            v-for="(role, idx) in roles.data"
                            :key="`${role.anime?.id ?? 'x'}-${role.character?.id ?? idx}`"
                            :href="animeUrl(role.anime)"
                            class="group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/40 p-2 transition hover:border-primary-600 hover:bg-gray-900"
                        >
                            <!-- Anime cover -->
                            <div class="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-gray-800">
                                <img
                                    v-if="role.anime?.cover_image_medium"
                                    :src="role.anime.cover_image_medium"
                                    :alt="role.anime.title_romaji"
                                    class="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            <div class="min-w-0 flex-1">
                                <h3 class="truncate text-sm font-medium text-gray-100 group-hover:text-primary-400 transition">
                                    {{ role.anime?.title_english || role.anime?.title_romaji || 'Unknown anime' }}
                                </h3>
                                <div class="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                                    <span v-if="role.anime?.format">{{ formatLabel(role.anime.format) }}</span>
                                    <span v-if="role.anime?.season_year">&middot; {{ role.anime.season_year }}</span>
                                    <ScoreBadge v-if="role.anime" :score="role.anime.average_score" size="sm" />
                                </div>
                            </div>

                            <!-- Character -->
                            <div class="flex shrink-0 items-center gap-2 text-right">
                                <div class="min-w-0">
                                    <p class="truncate text-sm text-gray-200">
                                        {{ role.character?.name_full || '—' }}
                                    </p>
                                    <p v-if="role.character?.name_native" class="truncate text-xs text-gray-500">
                                        {{ role.character.name_native }}
                                    </p>
                                </div>
                                <div class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-800">
                                    <img
                                        v-if="role.character?.image_medium"
                                        :src="role.character.image_medium"
                                        :alt="role.character.name_full"
                                        class="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div class="mt-8">
                        <PaginationBar
                            :current-page="roles.meta.current_page"
                            :last-page="roles.meta.last_page"
                            :total="roles.meta.total"
                        />
                    </div>
                </div>
                <div v-else class="py-16 text-center">
                    <p class="text-gray-500">No roles recorded yet.</p>
                </div>
            </div>
        </div>
    </div>
</template>
