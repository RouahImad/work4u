import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    root: "client",
    server: {
        open: true,
    },
    build: {
        outDir: "../dist", // Output build files to work4u_FE/dist/ (outside client/)
    },
});
