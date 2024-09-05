import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias:[
      {
        find:"@",
        replacement:"/src",
      }
    ]
  },
  server: {
    hmr: true,
    proxy: {
      "/api" : {
        target: "http://localhost:7090",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^api': '/api'},
      }
    },
  },
})
