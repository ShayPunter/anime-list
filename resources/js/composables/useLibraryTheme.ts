import type { ListStatus } from '@/types'

export const STATUS_DOT_COLORS: Record<ListStatus, string> = {
    watching: '#4caf7c',
    completed: '#ff5a1f',
    plan_to_watch: '#8a8a80',
    on_hold: '#d4a82e',
    dropped: '#e56a52',
}

export function statusDotColor(status: ListStatus): string {
    return STATUS_DOT_COLORS[status] ?? '#8a8a80'
}
