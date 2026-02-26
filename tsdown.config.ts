import { defineConfig, UserConfig } from 'tsdown';

const config: UserConfig | UserConfig[] = defineConfig([
    {
        entry: './eslint/index.mts',
        outDir: './dist/eslint',
        format: ['esm', 'cjs'],
        attw: true,
        dts: true,
        exports: true
    },
    {
        entry: './esbuild/index.ts',
        outDir: './dist/esbuild',
        format: ['esm', 'cjs'],
        attw: true,
        dts: true,
        exports: true
    },
    {
        entry: './esbuild/plugins.ts',
        outDir: './dist/esbuild',
        format: ['esm', 'cjs'],
        attw: true,
        dts: true,
        exports: true
    }
])

export default config
