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
        input: {
            main: 'src/index.ts',
            'bottom-sheet': 'src/components/bottom-sheet/index.ts',
            native: 'src/components/native/index.ts',
        },
        external: ['react', 'react-native'],
        output: [
            {
                entryFileNames: '[name].esm.js',
                dir: 'lib',
                format: 'es',
                name: 'lib',
                preserveModules: false,
            },
            {
                entryFileNames: '[name].cjs.js',
                dir: 'lib',
                format: 'cjs',
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
    // {
    //     input: 'lib/types/index.d.ts',
    //     output: [
    //         {
    //             file: 'lib/index.d.ts',
    //             format: 'cjs',
    //             name: 'types'
    //         },
    //     ],
    //     plugins: [dts(), del({targets: 'lib/types', hook: 'buildEnd'})],
    // },
]
