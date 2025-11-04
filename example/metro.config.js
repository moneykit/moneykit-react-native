const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [path.resolve(__dirname, '..')],

  // npm v7+ will install ../node_modules/react and ../node_modules/react-native because of peerDependencies.
  // To prevent the incompatible react-native between ./node_modules/react-native and ../node_modules/react-native,
  // excludes the one from the parent folder when bundling.
  resolver: {
    blockList: [
      new RegExp(path.resolve(__dirname, '..', 'node_modules', 'react') + '/.*'),
      new RegExp(path.resolve(__dirname, '..', 'node_modules', 'react-native') + '/.*'),
    ],
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(defaultConfig, config);
