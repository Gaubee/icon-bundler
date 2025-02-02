import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from '../package.json';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const pkg = fs.readJSONSync(path.resolve(__dirname, "../package.json"));

// const fs = require('fs-extra');
// const path = require('path');
// const icon-bundler = require('../lib/index.js');

it('example test case.', async () => {
  const dist = path.resolve(process.cwd(), 'examples', 'example', 'dist');
  const fileNames = await fs.readdir(dist);
  expect(fileNames).toEqual([
    'font-class.html',
    'index.html',
    'react',
    'reactNative',
    'icon-bundler.css',
    'icon-bundler.d.ts',
    'icon-bundler.eot',
    'icon-bundler.json',
    'icon-bundler.less',
    'icon-bundler.module.less',
    'icon-bundler.scss',
    'icon-bundler.styl',
    'icon-bundler.svg',
    'icon-bundler.symbol.svg',
    'icon-bundler.ttf',
    'icon-bundler.woff',
    'icon-bundler.woff2',
    'symbol.html'
  ]);
});

it('example simple test case.', async () => {
  const dist = path.resolve(process.cwd(), 'examples', 'example', 'example');
  const fileNames = await fs.readdir(dist);
  expect(fileNames).toEqual([
    'icon-bundler.css',
    'icon-bundler.eot',
    'icon-bundler.less',
    'icon-bundler.module.less',
    'icon-bundler.scss',
    'icon-bundler.styl',
    'icon-bundler.svg',
    'icon-bundler.symbol.svg',
    'icon-bundler.ttf',
    'icon-bundler.woff',
    'icon-bundler.woff2',
  ]);
})

it('templates templates test case.', async () => {
  const dist = path.resolve(process.cwd(), 'examples', 'templates', 'dist2');
  const fileNames = await fs.readdir(dist);
  expect(fileNames).toEqual([
    'font-class.html',
    'index.html',
    'react',
    'reactNative',
    'icon-bundler.css',
    'icon-bundler.eot',
    'icon-bundler.json',
    'icon-bundler.less',
    'icon-bundler.module.less',
    'icon-bundler.scss',
    'icon-bundler.styl',
    'icon-bundler.svg',
    'icon-bundler.symbol.svg',
    'icon-bundler.ttf',
    'icon-bundler.woff',
    'icon-bundler.woff2',
    'symbol.html'
  ]);
  const css = await fs.readFile(path.resolve(dist, 'icon-bundler.css'));
  expect(css.toString().indexOf('Hello CSS!') > -1).toBeTruthy();
})
