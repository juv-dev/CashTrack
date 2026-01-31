import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import RekaResolver from 'reka-ui/resolver'
import { resolve } from 'path'
import history from 'connect-history-api-fallback'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),  
    tailwindcss(), 
    Components({
      resolvers: [RekaResolver()],
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    middlewareMode: false,
    middleware: [
      history({
        verbose: true,
        rewrites: [
          { from: /^\/(?!.*\.).*$/, to: '/index.html' }
        ]
      })
    ]
  }
})
