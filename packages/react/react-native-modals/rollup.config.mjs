import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import {dts} from 'rollup-plugin-dts'
import external from 'rollup-plugin-peer-deps-external'
import preserveDirectives from 'rollup-preserve-directives'

export default [
    {
        input: 'src/index.ts',
        external: ['react', 'react-native'],
        output: [
            {
                entryFileNames: 'index.js',
                dir: 'lib',
                format: 'esm',
                name: 'lib',
                preserveModules: false,
            },
        ],
        plugins: [
            del({targets: 'lib/*'}),
            external(),
            resolve(),
            commonjs(),
            typescript({tsconfig: './tsconfig.json'}),
            preserveDirectives(),
            // terser({
            //     compress: {
            //     },
            // }),
        ],
    },
    {
        input: 'lib/types/index.d.ts',
        output: [
            {
                file: 'lib/index.d.ts',
                format: 'cjs',
                name: 'types'
            },
        ],
        plugins: [dts(), del({targets: 'lib/types', hook: 'buildEnd'})],
    },
]
