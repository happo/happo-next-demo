# happo-next-demo

This repository demonstrates how you can use [Happo
Examples](https://docs.happo.io/docs/examples) with
[Next.JS](https://nextjs.org/)

## Install Happo client

Unless you have already done it.
```sh
npm install --save-dev happo.io
```

## Configure `.happo.js`:

The main thing to take care of here is to tell Happo about the webpack
configuration used by Next.JS.

```js
const path = require('path');

const { RemoteBrowserTarget } = require('happo.io');

const { findPagesDir } = require('next/dist/lib/find-pages-dir');
const nextWebpackConfig = require('next/dist/build/webpack-config').default;
const nextConfig = require('./next.config');

const happoTmpDir = './happo-tmp';

module.exports = {
  targets: {
    chrome: new RemoteBrowserTarget('chrome', { viewport: '600x400' }),
  },

  setupScript: path.resolve(__dirname, 'happoSetup.js'),

  customizeWebpackConfig: async config => {
    // Grab required webpack settings from the Next.JS webpack config.
    const base = await nextWebpackConfig(__dirname, {
      config: {
        devIndicators: {},
        distDir: happoTmpDir,
        env: {},
        experimental: { plugins: [] },
        future: {},
        pageExtensions: [],
        sassOptions: {},
        ...nextConfig,
      },
      entrypoints: {},
      pagesDir: findPagesDir(process.cwd()),
      rewrites: [],
    });
    config.plugins = base.plugins;
    config.resolve = base.resolve;
    config.resolveLoader = base.resolveLoader;
    Object.keys(config.resolve.alias).forEach(key => {
      if (!config.resolve.alias[key]) {
        delete config.resolve.alias[key];
      }
    });
    config.module = base.module;
    return config;
  },

  // Happo is unable to resolve some imports if the tmpdir isn't located inside
  // the project structure. The default is an OS provided folder, `os.tmpdir()`.
  // You can add this folder to `.gitignore` as well.
  tmpdir: path.join(__dirname, happoTmpDir),
};

```

## Add a `setupScript` file

This step is only necessary if you are using
[`styled-jsx`](https://github.com/zeit/styled-jsx).

```js
// File: happoSetup.js

// Make cleanup a no-op, to avoid ummounting jsx styles
window.happoCleanup = () => null;
```


## Create a test file, e.g. `Button-happo.js`:

```tsx
import React from 'react';

export default () => <Button>Click me</Button>;
```

## Add a `happo` script to `package.json`:

```json
"scripts": {
  "happo": "happo"
},
```

## Run happo!

```bash
yarn happo run
```


