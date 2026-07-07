import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        manifest: false,
        emptyOutDir: false,
        outDir: 'dist',
        rollupOptions: {
            input: {
                global: resolve(__dirname, 'src/js/global.js'),

                home: resolve(__dirname, 'src/js/pages/home.js'),
                contact: resolve(__dirname, 'src/js/pages/contact.js'),
                // pricing: resolve(__dirname, 'src/js/pages/pricing.js'),
            },
            output: {
                entryFileNames: 'js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'css/[name][extname]';
                    }

                    return 'assets/[name][extname]';
                },
            },
        },
    },
});
