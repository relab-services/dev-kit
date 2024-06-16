import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json';

import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import external from 'rollup-plugin-peer-deps-external'
import copy from 'rollup-plugin-copy'

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                format: 'cjs',
                file: 'lib/index.cjs.js',
            },
        ],
        external: [/node_modules/, 'http'],
        plugins: [
            del({ targets: 'lib/*' }),
            resolve(),
            commonjs(),
            external(),
            json(),
            typescript({ tsconfig: './tsconfig.json' }),
            terser({
                compress: {
                    directives: false,
                },
            }),
            copy({
                targets: [{ src: 'node_modules/@scalar/api-reference/dist/browser/standalone.js', dest: 'lib', rename: 'api-reference.js' }],
            })
        ],
    },
    {
        input: 'src/index.ts',
        output: [
            {
                format: 'es',
                file: 'lib/index.esm.js',
            },
        ],
        external: [/node_modules/],
        plugins: [
            resolve(),
            commonjs(),
            external(),
            json(),
            typescript({ tsconfig: './tsconfig.json' }),
            terser({
                compress: {
                    directives: false,
                },
            }),
        ],
    },
    {
        input: 'lib/types/index.d.ts',
        output: [
            {
                file: 'lib/index.d.ts',
                format: 'cjs',
                name: 'types',
            },
        ],
        plugins: [dts(), del({ targets: 'lib/types', hook: 'buildEnd' })],
    },
]
