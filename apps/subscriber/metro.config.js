const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo so Metro picks up changes in packages/*
config.watchFolders = [workspaceRoot];

// Resolve packages from the workspace root's node_modules first
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Follow symlinks created by npm workspaces
config.resolver.unstable_enableSymlinks = true;

// Do NOT enable unstable_enablePackageExports — it causes Metro to resolve
// `react` via the exports field differently for different callers, producing
// two React module IDs with separate dispatcher instances. Each @arys-rx/*
// package already has a "main" field so exports resolution isn't needed.

// Pin all react/react-native imports to a single root copy so Metro never
// produces two instances (which would make useState throw on a null dispatcher).
config.resolver.extraNodeModules = {
  react: path.resolve(workspaceRoot, 'node_modules/react'),
  'react-dom': path.resolve(workspaceRoot, 'node_modules/react-dom'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
};

module.exports = withNativeWind(config, { input: './global.css' });
