import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';

// Copy manifest.json (and any static assets) into the build output.
// Kept inline rather than adding @crxjs/vite-plugin for MVP simplicity.
function copyStaticAssets() {
    return {
        name: 'copy-static-assets',
        closeBundle() {
            const out = resolve(__dirname, 'dist');
            if (!existsSync(out)) mkdirSync(out, { recursive: true });
            copyFileSync(resolve(__dirname, 'public/manifest.json'), resolve(out, 'manifest.json'));
        },
    };
}

export default defineConfig({
    plugins: [vue(), copyStaticAssets()],
    resolve: {
        alias: { '@': resolve(__dirname, 'src') },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup/index.html'),
                background: resolve(__dirname, 'src/background/service-worker.ts'),
            },
            output: {
                entryFileNames: (chunk) =>
                    chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },
});
