import path from 'node:path';

import { common, cq, da, define } from '@where-org/where-common';

const { status } = define,
      file = { read: common.file.read };

const { filter } = da;

import { client, server, socket } from '@where-org/where-client';
import { init } from './bridge/index.js';

// mode
const mode = process.env.npm_config_mode || process.env.NODE_ENV || 'development',
      development = (mode === 'development') ? true : false;

/* log */
const log = common.init.log('bridge');

/* loadConfig */
const loadConfig = async (dir) => {
  return await common.config.load(dir, mode, 'bridge', true);
};

/* mergeSpec */
const mergeSpec = async (appConfig, specConfig) => {

  const resolveImportPathAppConfig = Object.entries(appConfig).reduce((o, [k, v]) => (
    { ...o, [k]: { ...v, importPath: v.importPath.indexOf('#module') === 0 ? import.meta.resolve(v.importPath) : v.importPath } }
  ), {});

  return await common.config.mergeSpec(resolveImportPathAppConfig, specConfig);

};

/* createBridge */
const createBridge = async (c) => {

  // config
  //const c = await common.config.load(dir, mode, 'bridge', true);

  // env
  const { name, version } = await common.file.read.json(path.resolve(import.meta.dirname, '../package.json'));

  const env = Object.entries({ name, version, mode }).reduce((o, [k, v]) => {

    const key = common.util.casing.camelToSnake(k).toUpperCase();
    return { ...o, [`BRIDGE_${key}`]: v };

  }, {});

  // where object
  const where = {
    log,

    app: {
      env, define: { status }, cq, da: { filter }, common: { ...common, file },
      client, server, socket,
    },
  };

  // where-bridge apps
  const apps = await init(c, where.app);

  // bridge
  const bridge = {

    listen: async () => {
      ;;; where.log({ message: 'Hello!', mode });

      await Promise.all(Object.entries(apps).map(async ([k, v]) => {
        if ('listen' in v) {
          await v.listen();
        }
      }));
    },

    end: async (code) => {

      await Promise.all(Object.entries(apps).map(async ([k, v]) => {
        if ('end' in v) {
          await v.end();
        }
      }));

      process.exit(code);

    },

  };

  Object.entries({ SIGINT: 2, SIGTERM: 15 }).forEach(([k, v]) => {
    process.on(k, async () => await bridge.end(v));
  });

  process.on('exit', async (code) => {
    ;;; where.log('See you!');
  });

  return bridge;

};

export { createBridge, loadConfig, mergeSpec, log, };
