/* eslint-disable no-undef */
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cleaner from 'rollup-plugin-cleaner';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/index.ts',
  output: [
    {
      file: './dist/bundle.cjs.js',
      format: 'cjs',
    },
    {
      file: './dist/bundle.esm.js',
      format: 'esm',
    },
  ],
  plugins: [
    cleaner({
      targets: ['./dist'],
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig-build.json',
    }),
    terser(),
  ],
};
