import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'audio/**/*', 'video/**/*', 'lovable-uploads/**/*'],
      manifest: {
        name: 'Phoenix Journey - TBI Recovery',
        short_name: 'Phoenix',
        description: 'Hospital-grade brain injury rehabilitation platform with evidence-based cognitive training, therapeutic soundscapes, and personalized recovery guidance.',
        theme_color: '#f97316',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['health', 'medical', 'lifestyle'],
        screenshots: [
          {
            src: '/lovable-uploads/61737177-dd9d-47dd-a325-27269cef1702.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Phoenix Journey Dashboard'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for audio/video
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(mp3|mp4|wav|ogg)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'audio-video-cache-v2',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\/audio\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'local-audio-cache-v2',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
              }
            }
          },
          {
            urlPattern: /\/video\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-video-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
