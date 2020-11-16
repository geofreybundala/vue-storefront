// TODO proper bundling, for now it's just to experiment with nuxt modules api
const fs = require('fs');
const path = require('path');
const log = require('./helpers/log');
const merge = require('./helpers/merge');
const resolveDependency = require('./helpers/resolveDependency');
const performanceModule = require('./modules/performance');
const storefrontUiModule = require('./modules/storefront-ui');
const rawSourcesModule = require('./modules/raw-sources-loader');

module.exports = function VueStorefrontNuxtModule (moduleOptions) {
  const defaultOptions = {
    coreDevelopment: false,
    performance : {
      httpPush: true
    },
    useRawSource: {
      dev: [],
      prod: []
    }
  };

  const options = merge(defaultOptions, moduleOptions);

  // Add meta data
  this.options.head.meta.push({
    name: 'generator',
    content: 'Vue Storefront 2'
  });

  log.info('Starting Vue Storefront Nuxt Module');
  
  // SSR plugin
  this.addPlugin(path.resolve(__dirname, 'plugins/ssr.js'));
  log.success('Installed Vue Storefront SSR plugin');

  // Logger plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugins/logger.js'),
    options: moduleOptions.logger || {}
  });
  log.success('Installed VSF Logger plugin');

  // Composition API plugin
  this.addModule('@nuxtjs/composition-api');
  log.success('Installed nuxt Composition API Module');

  // Performance module
  if (options.performance.httpPush) {
    performanceModule.call(this);
    log.success('Installed Performance Module');
  }

  // StorefrontUI module
  if (fs.existsSync(resolveDependency('@storefront-ui/vue'))) {
    storefrontUiModule.call(this, options);
    log.success('Installed StorefrontUI Module');
  }

  // Raw sources loader
  rawSourcesModule.call(this, options);
}

module.exports.meta = require('../package.json')
