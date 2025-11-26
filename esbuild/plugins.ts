import ts from 'typescript';
import type { Plugin } from 'esbuild';

export const esbuildProblemMatcherPlugin: Plugin = {
    name: 'esbuild-problem-matcher',

    setup(build) {
        build.onStart(() => {
            console.log('[watch] build started');
        });
        build.onEnd(result => {
            result.warnings.forEach(({ text, location, notes }) => {
                console.error(`!! [WARNING] ${text}`);
                if (!location) return;
                console.error(`    ${location.file}:${location.line}:${location.column}`);
                notes.forEach(({ text, location }) => {
                    console.error(`Note: ${text} (${location?.file}:${location?.line}:${location?.column})`)
                })
            })
            result.errors.forEach(({ text, location, notes }) => {
                console.error(`✘ [ERROR] ${text}`);
                if (location == null) return;
                console.error(`    ${location.file}:${location.line}:${location.column}`);
                notes.forEach(({ text, location }) => {
                    console.error(`Note: ${text} (${location?.file}:${location?.line}:${location?.column})`)
                })
            });
            console.log('[watch] build finished');
        });
    },
};

export const esbuildTypeScriptPlugin: Plugin = {
    name: 'esbuild-typescript-plugin',

    setup(build) {
        let watchProgram: ts.WatchOfConfigFile<ts.SemanticDiagnosticsBuilderProgram> | null = null;

        // report diagnostics to stderr
        function reportDiagnostic(d: ts.Diagnostic) {
            const text = ts.flattenDiagnosticMessageText(d.messageText, '\n');
            if (d.file && typeof d.start === 'number') {
                const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
                console.error(`${d.file.fileName} (${line + 1},${character + 1}): ${text}`);
            } else {
                console.error(text);
            }
        }

        // report watch status messages to stderr (keeps output simple)
        function reportWatchStatusChanged(d: ts.Diagnostic) {
            const text = ts.flattenDiagnosticMessageText(d.messageText, '\n');
            console.error(text);
        }

        // start the watch immediately during setup
        try {
            const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
            if (!configPath) {
                console.error('Could not find tsconfig.json');
                return;
            }

            const host = ts.createWatchCompilerHost(
                configPath,
                { noEmit: true }, // esbuild handles output
                ts.sys,
                ts.createSemanticDiagnosticsBuilderProgram,
                reportDiagnostic,
                reportWatchStatusChanged,
            );

            watchProgram = ts.createWatchProgram(host);
            console.error('[typescript] watch started');
        } catch (erm) {
            console.error('[typescript] failed to start watch:', erm);
        }

        // ensure watch is closed when esbuild disposes the context
        if (typeof build.onDispose === 'function') {
            build.onDispose(() => {
                if (watchProgram && typeof watchProgram.close === 'function') {
                    try {
                        watchProgram.close();
                    } catch (erm) {
                        console.error(erm);
                    }
                }
                console.error('[typescript] watch stopped');
            });
        }
    },
};
