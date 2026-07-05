import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
    globalIgnores([
        '.next/**',
        'out/**',
        'node_modules/**',
        'build/**',
        'coverage/**',
        'public/**',
        'pnpm-lock.yaml',
        '.env*',
        'next-env.d.ts',
    ]),

    ...nextVitals,
    ...nextTs,

    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        rules: {
            'linebreak-style': 'off',
            'no-tabs': 'off',
            'no-irregular-whitespace': 'warn',
            'prefer-const': 'error',
            'no-var': 'error',
            eqeqeq: ['error', 'always'],
            'no-console': ['warn', { allow: ['warn', 'error'] }],

            'react/display-name': 'off',
            'react/prop-types': 'off',
            'react/no-children-prop': 'warn',
            'react/self-closing-comp': 'warn',
            'react-hooks/exhaustive-deps': 'warn',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports' },
            ],
            '@typescript-eslint/consistent-indexed-object-style': 'off',
        },
    },

    eslintConfigPrettier,
])
