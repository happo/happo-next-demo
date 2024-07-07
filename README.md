
> [!WARNING]
> This repository hasn't been updated in a while. Look into docs.happo.io for more up-to-date documentation. 


# happo-next-demo

This repository demonstrates how you can use [Happo
Examples](https://docs.happo.io/docs/examples) with
[Next.JS](https://nextjs.org/)

## Install Happo client

Unless you have already done it.
```sh
npm install --save-dev happo.io
```

You might need to install babel-loader as well, if that's not already part of
the dependency tree:

```sh
npm install --save-dev babel-loader
```

## Configure `.happo.js`:

The two main things we need to take care of:
- Make Happo use the same webpack config as Next.js
- Inject the custom webpack instance used by Next.js to Happo

```js
const path = require('path');

const { RemoteBrowserTarget } = require('happo.io');

const { findPagesDir } = require('next/dist/lib/find-pages-dir');
const nextWebpackConfig = require('next/dist/build/webpack-config').default;
const loadNextConfig = require('next/dist/next-server/server/config').default;

const happoTmpDir = './happo-tmp';
const webpack = require('next/dist/compiled/webpack/webpack');
webpack.init(true);

module.exports = {
  targets: {
    chrome: new RemoteBrowserTarget('chrome', { viewport: '600x400' }),
  },

  setupScript: path.resolve(__dirname, 'happoSetup.js'),

  customizeWebpackConfig: async config => {
    const nextConfig = await loadNextConfig('production', __dirname, null);

    const base = await nextWebpackConfig(__dirname, {
      config: nextConfig,
      entrypoints: {},
      pagesDir: findPagesDir(process.cwd()),
      rewrites: { beforeFiles: [], afterFiles: [], fallback:[] },
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

  webpack: webpack.webpack,

  // Happo is unable to resolve some imports if the tmpdir isn't located inside
  // the project structure. The default is an OS provided folder, `os.tmpdir()`.
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
npm run happo run
```


