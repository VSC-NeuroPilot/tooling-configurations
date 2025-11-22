// @ts-check
import { context } from 'esbuild';
import { polyfillNode, PolyfillNodeOptions } from 'esbuild-plugin-polyfill-node';
import { esbuildProblemMatcherPlugin } from './plugins';

const minimumPolyfillPull: PolyfillNodeOptions = {
    polyfills: { // trying to make the build as small as possible
        child_process: false,
        module: false,
        os: false,
        path: false,
        punycode: false,
        stream: false,
        sys: false,
        v8: false,
        vm: false,
        zlib: false,
    },
    globals: false,
}

export async function desktop(prodFlag: boolean, watchFlag: boolean) {
    const ctx = await context({
        entryPoints: ['src/desktop/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: prodFlag,
        sourcemap: !prodFlag,
        sourcesContent: false,
        platform: 'node',
        outfile: 'out/desktop/extension.js',
        external: ['vscode'],
        logLevel: 'warning',
        tsconfig: './tsconfig.app.json',
        plugins: [
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
        ],
    });
    if (watchFlag) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

export async function desktopTest(_prodFlag: boolean, watchFlag: boolean) {
    const ctx = await context({
        entryPoints: ['src/test/suite/desktop/index.ts'],
        bundle: true,
        format: 'cjs',
        minify: false, // Don't minify tests for better debugging
        sourcemap: true, // Always generate sourcemaps for tests
        sourcesContent: true, // Include source content for better debugging
        platform: 'node',
        outfile: 'out/desktop/test.js',
        tsconfig: './test-tsconfigs/tsconfig.app.json',
        external: [
            'vscode',
            'mocha',
            '@vscode/test-electron',
        ],
        logLevel: 'warning',
        define: {
            // Define test environment variables
            'process.env.NODE_ENV': '"test"',
        },
        plugins: [
            esbuildProblemMatcherPlugin,
        ],
    });
    
    if (watchFlag) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

export async function web(prodFlag: boolean, watchFlag: boolean) {
    const ctx = await context({
        entryPoints: ['src/web/extension.ts'],
        bundle: true,
        format: 'cjs',
        minify: prodFlag,
        sourcemap: !prodFlag,
        sourcesContent: false,
        platform: 'browser',
        outfile: 'out/web/extension.js',
        external: ['vscode'],
        logLevel: 'warning',
        tsconfig: './tsconfig.web.json',
        plugins: [
            polyfillNode(minimumPolyfillPull),
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
        ],
    });
    if (watchFlag) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

export async function webTest(_prodFlag: boolean, watchFlag: boolean) {
    const ctx = await context({
        entryPoints: ['src/test/suite/web/index.ts'],
        bundle: true,
        format: 'cjs',
        minify: false, // Don't minify tests for better debugging
        sourcemap: true, // Always generate sourcemaps for tests
        sourcesContent: true, // Include source content for better debugging        
        platform: 'browser',
        outfile: 'out/web/test.js',
        tsconfig: './test-tsconfigs/tsconfig.web.json',
        external: [
            'vscode',
            'mocha',
            '@vscode/test-web',
        ],
        logLevel: 'warning',
        define: {
            // Define test environment variables
            'process.env.NODE_ENV': '"test"',
        },
        // Include the same browser polyfills as the web bundle
        plugins: [
            polyfillNode(minimumPolyfillPull),
            esbuildProblemMatcherPlugin,
        ],
    });
    
    if (watchFlag) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}

export async function webview(prodFlag: boolean, watchFlag: boolean) {
    const ctx = await context({
        entryPoints: ['webview/**/*.ts'],
        bundle: true,
        format: 'cjs',
        minify: prodFlag,
        sourcemap: !prodFlag,
        sourcesContent: false,
        platform: 'browser',
        outdir: 'out/webview/',
        outbase: 'webview/',
        external: ['vscode'],
        logLevel: 'warning',
        tsconfig: './tsconfig.webview.json',
        treeShaking: true,
        plugins: [
            polyfillNode(minimumPolyfillPull),
            /* add to the end of plugins array */
            esbuildProblemMatcherPlugin,
        ],
    });
    if (watchFlag) {
        await ctx.watch();
    } else {
        await ctx.rebuild();
        await ctx.dispose();
    }
}
