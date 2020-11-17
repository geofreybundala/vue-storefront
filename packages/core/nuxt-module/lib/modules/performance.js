const { merge } = require('lodash');

function pushScripts() {
  this.options.render = merge(this.options.render, {
    http2: {
      push: true,
      pushAssets: (request, response, publicPath, preloadFiles) => {
        return preloadFiles
          .filter(({ asType }) => asType === 'script')
          .map(({ file, asType }) => `<${publicPath}${file}>; rel=preload; as=${asType}`);
      }
    }
  });
}

function loadPurgeCss(moduleOptions) {
  const options = merge(moduleOptions, {
    paths: [
      '**/*.vue'
    ]
  });

  this.addModule([ 'nuxt-purgecss', options ]);
}

module.exports = function VueStorefrontPerformanceModule (options) {
  const { httpPush, purgeCSS } = options.performance;

  if (httpPush) {
    pushScripts.call(this);
  }

  if (purgeCSS && purgeCSS.enabled) {
    loadPurgeCss.call(this, purgeCSS);
  }
};
