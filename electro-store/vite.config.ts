import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

// CORS Error Analysis and Solution

// Based on the error messages you're seeing, you're experiencing a CORS (Cross-Origin Resource Sharing) issue when your frontend application is trying to fetch data from your backend API. Let's break down the errors:

// 1. `home-page.tsx:36 Error fetching products: AxiosError`
// 2. `Failed to load resource: net::ERR_FAILED`
// 3. `Access to XMLHttpRequest at 'http://localhost:5000/api/products?featured=true' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: Redirect is not allowed for a preflight request.`

// The Problem

// Your frontend React application running on `http://localhost:5173` is trying to make API requests to your backend server running on `http://localhost:5000`, but the browser is blocking these requests due to the Same-Origin Policy. The specific error indicates that a preflight request (OPTIONS request) is being redirected, which is not allowed by CORS specifications.

// Solution

// The best way to fix this is to configure your backend server to properly handle CORS requests. However, since I don't have direct access to your backend code, I'll provide a solution using a proxy in your Vite configuration.

// Let's modify your `vite.config.ts` file to add a proxy that will forward requests to your backend server:

