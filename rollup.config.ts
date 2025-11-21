import type { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const config: RollupOptions[] = [
    {
        input: 'esbuild/index.ts',
        output: [
            {
                file: 'dist/esbuild/index.mjs',
                format: 'esm',
            }
        ],
        plugins: [
            typescript()
        ]
    }
]

export default config
