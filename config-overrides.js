const path = require('path');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve('process/browser'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify')
  };
  return config;
};
