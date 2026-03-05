import { ref, onMounted, onUnmounted } from 'vue'

// Module-level singleton so all components share one timer
let refCount = 0
let intervalId: ReturnType<typeof setInterval> | null = null
const now = ref(Date.now())

export function useCountdown() {
    onMounted(() => {
        refCount++
        if (refCount === 1) {
            now.value = Date.now()
            intervalId = setInterval(() => {
                now.value = Date.now()
            }, 60_000)
        }
    })

    onUnmounted(() => {
        refCount--
        if (refCount === 0 && intervalId !== null) {
            clearInterval(intervalId)
            intervalId = null
        }
    })

    function formatCountdown(airsAt: string): string {
        const target = new Date(airsAt).getTime()
        if (Number.isNaN(target)) return '--'
        const seconds = Math.floor((target - now.value) / 1000)
        if (seconds <= 0) return 'Aired'
        const d = Math.floor(seconds / 86400)
        const h = Math.floor((seconds % 86400) / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        if (d > 0) return `${d}d ${h}h`
        if (h > 0) return `${h}h ${m}m`
        return `${m}m`
    }

    function formatLocalTime(iso: string, timezone?: string): string {
        try {
            return new Date(iso).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: timezone,
                hour12: true,
            })
        } catch {
            return new Date(iso).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
        }
    }

    function formatLocalDate(iso: string, timezone?: string): string {
        try {
            return new Date(iso).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                timeZone: timezone,
            })
        } catch {
            return new Date(iso).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            })
        }
    }

    return { now, formatCountdown, formatLocalTime, formatLocalDate }
}
