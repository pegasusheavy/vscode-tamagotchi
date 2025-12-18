import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/docs/**',
      '**/out/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    passWithNoTests: true,
  },
});

