const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Avoid Watchman "watch-project" stalls in environments where Watchman
// is unavailable or unresponsive.
config.resolver.useWatchman = false;
config.watchFolders = [];

module.exports = config;
