import type { ListStatus } from '@/types'

export const STATUS_DOT_CLASS: Record<ListStatus, string> = {
    watching: 'bg-blue-400',
    completed: 'bg-green-400',
    plan_to_watch: 'bg-gray-500',
    on_hold: 'bg-yellow-400',
    dropped: 'bg-red-400',
}

export function statusDotClass(status: ListStatus): string {
    return STATUS_DOT_CLASS[status] ?? 'bg-gray-500'
}
