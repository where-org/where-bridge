import path from 'node:path';

const init = async (name, c, w) => {

  // where
  const { init, ...common } = w.common;

  const log = init.log({ module: 'bridge-app', app: name }),
        where = { ...w, log, common };

  // config
  const config = c.app[name];

  // app
  const { module: appModule } = config.app;

  const appConfig = { ...config.app, ...await init.credential(config.app) },
        args = [appConfig, where];

  const appImport = await import(appModule).catch(async err => {

    ;;; where.log({ error: err.stack });

    return await import(path.resolve(process.cwd(), 'node_modules', appModule, 'index.js')).catch(err => {

      ;;; where.log({ error: err.stack });
      return false;

    });

  });

  return (!appImport) ? appImport : await appImport[(appImport.app) ? 'app' : 'default'](...args);

}

//wrapper
const wrapper = async (config, where) => {

  return await Object.entries(config.app).reduce(async (o, [k, v]) => {

    const app = await init(k, config, where);
    return (app) ? { ...await o, [k]: app } : await o;

  }, {});

}

export { wrapper as init };
