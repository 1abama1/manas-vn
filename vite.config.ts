import { vitePluginPixivn } from "@drincs/pixi-vn/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from 'vite-plugin-compression';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        checker({
            typescript: true,
        }),
        tailwindcss(),
        VitePWA({
            // you can generate the icons using: https://favicon.io/favicon-converter/
            // and the maskable icon using: https://progressier.com/maskable-icons-editor
            includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
            manifest: {
                name: "Manas",
                short_name: "manas",
                description: "Visual Novel about Manas",
                theme_color: "#ffffff",
                start_url: "/",
                display: "fullscreen",
                orientation: "portrait",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                // Exclude large media from precaching to avoid "hanging" the app
                globPatterns: ['**/*.{js,css,html,ico,svg}'],
                maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2MB is safer for precache
            }
        }),
        ViteImageOptimizer({
            test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
            exclude: undefined,
            include: undefined,
            includePublic: true,
            logStats: true,
            ansiColors: true,
            svg: {
                multipass: true,
                plugins: [
                    {
                        name: 'preset-default',
                        params: {
                            overrides: {
                                cleanupNumericValues: false,
                                removeViewBox: false, // keep the viewBox attribute
                            },
                        },
                    },
                    'sortAttrs',
                    {
                        name: 'addAttributesToSVGElement',
                        params: {
                            attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                        },
                    },
                ],
            },
            png: {
                quality: 80,
            },
            jpeg: {
                quality: 80,
            },
            jpg: {
                quality: 80,
            },
            webp: {
                lossless: true,
            },
            avif: {
                lossless: true,
            },
        }),
        viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            deleteOriginFile: false,
            threshold: 10240,
        }),
        viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            deleteOriginFile: false,
            threshold: 10240,
        }),
        vitePluginPixivn(),
    ],
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __APP_NAME__: JSON.stringify(process.env.npm_package_name),
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "lib/@mui/joy": ["@mui/joy"],
                    "lib/react-markdown": ["react-markdown", "rehype-raw", "remark-gfm"],
                    "lib/pixi.js": ["pixi.js"],
                    "lib/@drincs/pixi-vn": ["@drincs/pixi-vn"],
                    "lib/spine": ["@drincs/pixi-vn-spine"],
                    "lib/motion": ["motion"],
                },
            },
        },
    },
});
