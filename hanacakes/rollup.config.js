import path from 'path';
import packageImporter from 'node-sass-package-importer';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';

const { DEV_MODE } = process.env;

const config = {
  input: path.join(__dirname, 'ui/javascripts/index.js'),
  output: {
    file: path.join(__dirname, 'public/javascripts/bundle.js'),
    format: 'iife',
    sourcemap: DEV_MODE ? 'inline' : false
  },
  plugins: [
    resolve(),
    commonjs(),
    scss({
      output: path.join(__dirname, 'public/stylesheets/styles.css'),
      outputStyle: DEV_MODE ? 'nested' : 'compressed',
      sourceMapEmbed: DEV_MODE,
      importer: packageImporter()
    }),
    del({
      targets: [
        path.join(__dirname, 'public/images'),
        path.join(__dirname, 'public/fonts'),
        path.join(__dirname, 'public/javascripts'),
        path.join(__dirname, 'public/stylesheets')
      ]
    }),
    copy({
      targets: [
        {
          src: path.join(__dirname, 'ui/images/**/*'),
          dest: path.join(__dirname, 'public/images')
        },
        {
          src: path.join(__dirname, 'ui/fonts/**/*'),
          dest: path.join(__dirname, 'public/fonts')
        }
      ]
    })
  ]
};

if (!DEV_MODE) {
  config.plugins.push(
    babel({
      runtimeHelpers: true
    }),
    terser({
      compress: true
    })
  );
}

export default config;
