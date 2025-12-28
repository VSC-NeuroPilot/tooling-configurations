import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

const tsconfig = './tsconfig.json'

const config = [
    {
        input: 'esbuild/index.ts',
        output: [
            {
                file: 'dist/esbuild/index.mjs',
                format: 'esm',
                sourcemap: true,
            },
            {
                file: 'dist/esbuild/index.cjs',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            }
        ],
        plugins: [
            typescript({ 
                tsconfig,
                declaration: true,
                declarationDir: './dist/esbuild/types',
                rootDir: './esbuild'
            }),
            commonjs()
        ]
    },
    {
        input: 'esbuild/plugins.ts',
        output: [
            {
                file: 'dist/esbuild/plugins.mjs',
                format: 'esm',
                sourcemap: true,
            },
            {
                file: 'dist/esbuild/plugins.cjs',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            }
        ],
        plugins: [
            typescript({ 
                tsconfig,
                declaration: true,
                declarationDir: './dist/esbuild/types',
                rootDir: './esbuild'
            }),
            commonjs()
        ]
    },
    {
        input: 'eslint/index.mts',
        output: [
            {
                file: 'dist/eslint/index.mjs',
                format: 'esm',
                sourcemap: true,
            },
            {
                file: 'dist/eslint/index.cjs',
                format: 'cjs',
                sourcemap: true,
            }
        ],
        plugins: [
            typescript({ 
                tsconfig,
                declaration: true,
                declarationDir: './dist/eslint/types',
                rootDir: './eslint'
            }),
            commonjs()
        ]
    }
]

export default config
