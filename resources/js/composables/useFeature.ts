import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

export function useFeature(name: string) {
    const page = usePage<{ features: Record<string, boolean> }>()
    return computed(() => page.props.features?.[name] ?? false)
}
