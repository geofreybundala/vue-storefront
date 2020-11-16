const { merge } = require('lodash');

module.exports = function VueStorefrontPerformanceModule () {
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
};
