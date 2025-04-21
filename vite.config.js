import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import glsl from 'vite-plugin-glsl';
import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import packageJson from './package.json';

const externalModules = packageJson.inscriptions || {};

function downloadExternalModules() {
    return {
        name: 'cache-external-modules',
        async resolveId(source) {
            // Detect any imports that start with '/content/'
            if (source.startsWith('/content/')) {
                const fileName = source.replace('/content/', ''); // Extract the filename
                const resolvedPath = path.resolve(__dirname, `node_modules/cached_inscriptions/content/${fileName}`);
                return resolvedPath; // Dynamically resolve to the cached file
            }
            return null;
        },
        async load(id) {
            // Check if the file path is in the external_modules/content folder
            if (id.includes('external_modules/content/')) {
                const fileName = path.basename(id);
                const filePath = path.resolve(__dirname, `node_modules/cached_inscriptions/content/${fileName}`);

                // Check if the file exists locally
                try {
                    await fs.access(filePath);
                    return await fs.readFile(filePath, 'utf-8');
                } catch (err) {
                    // If the file doesn't exist locally, fetch it from the external URL and cache it
                    const fileUrl = `https://ordinals.com/content/${fileName}`;
                    const res = await fetch(fileUrl);
                    const content = await res.text();

                    // Cache the file locally for future use
                    await fs.mkdir(path.dirname(filePath), { recursive: true });
                    await fs.writeFile(filePath, content);
                    return content;
                }
            }
            return null;
        }
    };
}

export default defineConfig(({ command }) => {
    const isProduction = command === 'build';


    let aliases = {}

    Object.keys(externalModules).forEach(name => {
        aliases[name] = isProduction
            ? ('https://ordinals.com/content/' + externalModules[name])
            : path.resolve(__dirname, 'external_modules/content/' + externalModules[name])
    })


    let removeImportMap = command === 'build' ? {
        name: 'remove-importmap-plugin',
        transformIndexHtml(html) {
            return html.replace(/<script type="importmap">[\s\S]*?<\/script>/g, '');
        }
    } : null;

    let hdrFix = command === 'build' ? {
        name: 'hdr-fix-plugin',
        transform(code, id) {
            if (id.endsWith('.js') || id.endsWith('.jsx') || id.endsWith('.ts') || id.endsWith('.tsx')) {
                return {
                    code: code.replace(/\?\.\s*hdr/g, ''),
                    map: null
                };
            }
            return null;
        }
    } : null;


    // Plugin to replace identifiers with URLs in the final HTML file
    function postBuildReplacePlugin() {
        return {
            name: 'post-build-replace-plugin',
            async closeBundle() {
                const buildDir = path.resolve(__dirname, 'build');
                const htmlFile = path.join(buildDir, 'index.html');

                // Read the generated HTML file
                let htmlContent = await fs.readFile(htmlFile, 'utf-8');

                // Replace identifiers with their respective URLs carefully within import statements
                Object.keys(externalModules).forEach(identifier => {
                    const url = externalModules[identifier];
                    const regex = new RegExp(`(["'])(${identifier})(["'])`, 'g'); // Match imports like 'useGUI'
                    htmlContent = htmlContent.replace(regex, `$1${url}$3`); // Replace the identifier with the URL, preserving quotes
                });

                // Write the updated HTML content back to the file
                await fs.writeFile(htmlFile, htmlContent);
            }
        };
    }



    return {
        optimizeDeps: {
            exclude: ['useGUI'],
        },
        resolve: {
            alias: aliases,
        },
        plugins: [
            react(),
            downloadExternalModules(),
            viteSingleFile(),
            glsl({
                compress: true,
            }),
            removeImportMap,
            hdrFix,
            postBuildReplacePlugin()
        ],
        server: {
            logLevel: 'error', // Only show errors, no warnings
            port: 4000,
            proxy: {
                '/content': {
                    target: 'https://ordinals.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/content/, '/content'),
                    secure: false,
                },
            },
        },
        build: {
            outDir: 'build',
            sourcemap: false,
            rollupOptions: {
                external: Object.keys(externalModules).concat([
                    'shaderNoiseFunctions',
                    'bitmon',
                    'bitmapOCI',
                    'boxelGeometry',
                    'boxels-shader',
                    'GridFloor',
                    'useCollider',
                    'three',
                    'react',
                    'react-dom',
                    'react-dom/client',
                    'react/jsx-runtime',
                    '@use-gesture/react',
                    '@react-three/fiber',
                    '@react-three/drei',
                    '@react-three/postprocessing',
                    '@react-three/cannon',
                    '@react-three/a11y',
                    '@react-three/csg',
                    'three-custom-shader-material',
                    'leva',
                    'randomish',
                    'material-composer',
                    'material-composer-r3f',
                    'shader-composer',
                    'vfx-composer',
                    'vfx-composer-r3f',
                    '@react-spring/three',
                    '@react-spring/web',
                    'statery',
                    'maath',
                    'r3f-perf',
                    'suspend-react',
                    'miniplex',
                    'simplex-noise',
                    'alea',
                ]),
            },
        },
    }
});
