import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        env: {
            DATABSE_URL: process.env.DATABASE_URL!,
            JWT_SECRET: process.env.JWT_SECRET!,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
        }
    }
})