import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from 'eslint-config-next';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        plugins: { js },
        extends: ['js/recommended'],
        rules: {}
    },
    ...nextPlugin,
    eslintPluginPrettier,
    tseslint.configs.recommended
]);
