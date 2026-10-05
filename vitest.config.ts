import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/utils/**", "src/hooks/**"],
      exclude: [
        "src/**/*.test.ts",
        "src/hooks/redux.ts",
        "src/hooks/useWindowSize.ts",
      ],
    },
  },
});
