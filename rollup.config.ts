import type { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const tsconfig = './tsconfig.json'

const config: RollupOptions[] = [
    {
        input: 'esbuild/index.ts',
        output: [
            {
                file: 'dist/esbuild/index.mjs',
                format: 'esm',
            },
            {
                file: 'dist/esbuild/index.cjs',
                format: 'cjs',
                exports: 'named',
            }
        ],
        plugins: [
            typescript({ tsconfig }),
            resolve(),
            commonjs()
        ],
        external: ['esbuild']
    },
    {
        input: 'esbuild/plugins.ts',
        output: [
            {
                file: 'dist/esbuild/plugins.mjs',
                format: 'esm',
            },
            {
                file: 'dist/esbuild/plugins.cjs',
                format: 'cjs',
                exports: 'named',
            }
        ],
        plugins: [
            typescript({ tsconfig }),
            resolve(),
            commonjs()
        ],
        external: ['typescript']
    },
    {
        input: 'eslint/index.ts',
        output: [
            {
                file: 'dist/eslint/index.mjs',
                format: 'esm'
            }
        ],
        plugins: [
            typescript({ tsconfig }),
            resolve()
        ],
        external: ['eslint']
    }
]

export default config
