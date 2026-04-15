<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from '@/Layouts/AppLayout.vue'
import AnimeCard from '@/Components/AnimeCard.vue'
import PaginationBar from '@/Components/PaginationBar.vue'
import type { AnimeCard as AnimeCardType, StudioDetail } from '@/types/anime'
import type { PaginatedResponse } from '@/types/api'

defineOptions({ layout: AppLayout })

interface OgMeta {
    title: string
    description: string
    url: string
}

type Kind = 'studio' | 'producer'

const props = defineProps<{
    studio: StudioDetail
    anime: PaginatedResponse<AnimeCardType>
    og: OgMeta
    kind: Kind
}>()

const labels = computed(() => props.kind === 'producer'
    ? {
          breadcrumbText: 'Producers',
          breadcrumbRoute: 'producers.index',
          kindLabel: 'Producer',
          emptyMessage: 'No anime found for this producer.',
      }
    : {
          breadcrumbText: 'Studios',
          breadcrumbRoute: 'studios.index',
          kindLabel: 'Animation studio',
          emptyMessage: 'No anime found for this studio.',
      })
</script>

<template>
    <Head :title="studio.name">
        <meta name="description" :content="og.description" />
        <link rel="canonical" :href="og.url" />
        <meta property="og:title" :content="og.title" />
        <meta property="og:description" :content="og.description" />
        <meta property="og:url" :content="og.url" />
        <meta property="og:type" content="website" />
    </Head>

    <div>
        <div class="mb-6">
            <div class="text-sm text-gray-500">
                <Link :href="route(labels.breadcrumbRoute)" class="text-primary-400 hover:text-primary-300">
                    {{ labels.breadcrumbText }}
                </Link>
                <span class="mx-2 text-gray-600">/</span>
                <span>{{ studio.name }}</span>
            </div>
            <h1 class="mt-2 text-2xl font-bold text-gray-100 md:text-3xl">{{ studio.name }}</h1>
            <p class="mt-1 text-sm text-gray-400">
                {{ labels.kindLabel }} &middot; {{ studio.anime_count.toLocaleString() }} anime
            </p>
            <a
                v-if="studio.website_url"
                :href="studio.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-block text-sm text-primary-400 hover:text-primary-300"
            >
                Official website &rarr;
            </a>
        </div>

        <div v-if="anime.data.length">
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <AnimeCard
                    v-for="item in anime.data"
                    :key="item.id ?? item.anilist_id"
                    :anime="item"
                    view-mode="grid"
                />
            </div>

            <div class="mt-8">
                <PaginationBar
                    :current-page="anime.meta.current_page"
                    :last-page="anime.meta.last_page"
                    :total="anime.meta.total"
                />
            </div>
        </div>
        <div v-else class="py-16 text-center">
            <p class="text-gray-500">{{ labels.emptyMessage }}</p>
        </div>
    </div>
</template>
