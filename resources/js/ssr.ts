import { createSSRApp, h, type DefineComponent } from 'vue'
import { createInertiaApp, Link, Head } from '@inertiajs/vue3'
import createServer from '@inertiajs/vue3/server'
import { renderToString } from 'vue/server-renderer'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'
import { ZiggyVue } from 'ziggy-js'

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => title ? `${title} — AniTrack` : 'AniTrack',
        resolve: (name) => {
            const pages = import.meta.glob<DefineComponent>('./Pages/**/*.vue', { eager: true })
            return pages[`./Pages/${name}.vue`]
        },
        setup({ App, props, plugin }) {
            const app = createSSRApp({ render: () => h(App, props) })

            app.use(plugin)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ziggy = page.props.ziggy as any
            app.use(ZiggyVue, {
                ...ziggy,
                location: ziggy?.location ? new URL(ziggy.location) : undefined,
            } as any)
            app.use(createPinia())
            app.use(VueQueryPlugin)
            app.use(PrimeVue, {
                unstyled: false,
                theme: {
                    preset: Aura,
                    options: {
                        darkModeSelector: '.dark',
                    },
                },
            })
            app.use(ToastService)

            app.component('Link', Link)
            app.component('Head', Head)

            return app
        },
    }),
)
