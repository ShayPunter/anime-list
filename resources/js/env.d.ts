/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<object, object, unknown>
    export default component
}

// Ziggy route helper — globally available via ZiggyVue plugin
declare function route(name: string, params?: Record<string, unknown> | unknown, absolute?: boolean): string

declare module 'ziggy-js' {
    export function ZiggyVue(app: import('vue').App): void
}
