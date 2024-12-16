import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      // "/prpc": {
      //   target: "http://66.220.6.113:33001",
      // },
      // "/agents": {
      //   target: "http://66.220.6.113:33010",
      // },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
 
})
