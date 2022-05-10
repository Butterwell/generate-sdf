import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.js',
        format: 'es',
        name: 'huge-sdf',
        exports: 'named',
        sourcemap: true,
    },
    plugins: [
        resolve({
            mainFields: ['module'],
        }),
        typescript(),
    ]
}

