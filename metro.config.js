const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

// Solo los paquetes de Firebase se resuelven sin "exports"; el resto queda normal
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isFirebase =
    moduleName === 'firebase' ||
    moduleName.startsWith('firebase/') ||
    moduleName.startsWith('@firebase/');

  const resolve = defaultResolveRequest || context.resolveRequest;

  if (isFirebase) {
    return resolve(
      { ...context, unstable_enablePackageExports: false },
      moduleName,
      platform
    );
  }
  return resolve(context, moduleName, platform);
};

module.exports = config;