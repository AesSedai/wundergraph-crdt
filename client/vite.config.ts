import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    return {
        plugins: [react()],
        server: {
            port: parseInt(process.env.VITE_PORT),
            host: true,
            strictPort: true
        }
    }
})
