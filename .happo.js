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
