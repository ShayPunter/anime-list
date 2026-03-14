import { useMutation } from '@tanstack/vue-query'
import axios from 'axios'
import type { PlaylistResource, PlaylistPayload, PlaylistItemPayload, PlaylistItem } from '@/types'

export function usePlaylistMutations() {
    const storeMutation = useMutation({
        mutationFn: async (payload: PlaylistPayload) => {
            const { data } = await axios.post<{ playlist: PlaylistResource }>('/api/playlists', payload)
            return data.playlist
        },
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...patch }: { id: number } & Partial<PlaylistPayload>) => {
            const { data } = await axios.patch<{ playlist: PlaylistResource }>(`/api/playlists/${id}`, patch)
            return data.playlist
        },
    })

    const destroyMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/playlists/${id}`)
        },
    })

    const addItemMutation = useMutation({
        mutationFn: async ({ playlistId, ...payload }: { playlistId: number } & PlaylistItemPayload) => {
            const { data } = await axios.post<PlaylistItem>(`/api/playlists/${playlistId}/items`, payload)
            return data
        },
    })

    const updateItemMutation = useMutation({
        mutationFn: async ({ playlistId, itemId, ...patch }: { playlistId: number; itemId: number; note?: string | null; is_optional?: boolean }) => {
            const { data } = await axios.patch<PlaylistItem>(`/api/playlists/${playlistId}/items/${itemId}`, patch)
            return data
        },
    })

    const removeItemMutation = useMutation({
        mutationFn: async ({ playlistId, itemId }: { playlistId: number; itemId: number }) => {
            await axios.delete(`/api/playlists/${playlistId}/items/${itemId}`)
        },
    })

    const reorderMutation = useMutation({
        mutationFn: async ({ playlistId, itemIds }: { playlistId: number; itemIds: number[] }) => {
            await axios.patch(`/api/playlists/${playlistId}/reorder`, { item_ids: itemIds })
        },
    })

    return {
        storeMutation,
        updateMutation,
        destroyMutation,
        addItemMutation,
        updateItemMutation,
        removeItemMutation,
        reorderMutation,
    }
}
