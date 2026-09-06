import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: { tsconfigPaths: true },
    test: {
        // `globals` gives @testing-library/react its automatic per-test cleanup.
        globals: true,
        // Default to node; page/component tests opt into jsdom with a
        // `// @vitest-environment jsdom` docblock at the top of the file.
        environment: 'node',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}']
    }
});
