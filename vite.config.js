import { defineConfig } from 'vite';
import purgecssPlugin from '@fullhuman/postcss-purgecss';
import autoprefixer from 'autoprefixer';

const purgecss = purgecssPlugin.default || purgecssPlugin;

export default defineConfig(({ command }) => {
    const isProduction = command === 'build';

    return {
        base: './',
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
            },
            postcss: {
                plugins: [
                    autoprefixer(),
                    ...(isProduction
                        ? [
                              purgecss({
                                  content: ['./index.html', './java/**/*.js'],
                                  variables: false,
                                  keyframes: true,
                                  fontFace: true,
                                  safelist: {
                                      standard: [
                                          'visible',
                                          'active',
                                          'nav-open',
                                          'nav-scrolled',
                                          'skip-link',
                                      ],
                                      deep: [/visible$/, /active$/, /nav-open$/, /nav-scrolled$/],
                                  },
                                  defaultExtractor: (content) =>
                                      content.match(/[\w-/:]+(?<!:)/g) || [],
                              }),
                          ]
                        : []),
                ],
            },
        },
        build: {
            outDir: 'docs',
            assetsDir: 'assets',
            cssMinify: true,
            minify: 'esbuild',
            assetsInlineLimit: 0,
        },
    };
});
