const path = require('path');

const { RemoteBrowserTarget } = require('happo.io');

const nextWebpackConfig = require('next/dist/build/webpack-config').default;
const nextConfig = require('./next.config');

const happoTmpDir = './happo-tmp';

module.exports = {
  targets: {
    chrome: new RemoteBrowserTarget('chrome', { viewport: '600x400' }),
  },

  customizeWebpackConfig: async config => {
    const base = await nextWebpackConfig(__dirname, {
      config: {
        devIndicators: {},
        distDir: happoTmpDir,
        experimental: { plugins: [] },
        future: {},
        env: {},
        ...nextConfig,
      },
      entrypoints: {},
    });
    config.plugins = base.plugins;
    config.resolve = base.resolve;
    config.resolveLoader = base.resolveLoader;
    Object.keys(config.resolve.alias).forEach((key) => {
      if (!config.resolve.alias[key]) {
        delete config.resolve.alias[key];
      }
    });
    config.module = base.module;
    return config;
  },

  // Happo is unable to resolve some imports if the tmpdir isn't located inside
  // the project structure. The default is an OS provided folder, `os.tmpdir()`.
  tmpdir: path.join(__dirname, happoTmpDir),
};
