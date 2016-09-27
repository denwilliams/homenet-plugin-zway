import { plugin, service, Dict, IPluginLoader, ILogger, IConfig, ILockManager, ISensorManager, ILock, ISensor, ITriggerManager, IPresenceManager, IValuesManager } from 'homenet-core';

import { ZwayController } from './controller';
import { ZwayLock } from './lock';
import { createLockFactory } from './factories';
// import { ZwaySensor } from './sensor';

@plugin()
export class ZwayPluginLoader implements IPluginLoader {
  private _logger : ILogger;
  private _config : IConfig;
  private _locks : ILockManager;
  private _sensors : ISensorManager;
  private _controllers : Dict<ZwayController>;
  private _triggers: ITriggerManager;
  private _presence: IPresenceManager;
  private _values: IValuesManager;

  constructor(
          @service('IConfig') config: IConfig,
          @service('ILockManager') locks: ILockManager,
          @service('ISensorManager') sensors: ISensorManager,
          @service('ILogger') logger: ILogger,
          @service('ITriggerManager') triggers: ITriggerManager,
          @service('IPresenceManager') presence: IPresenceManager,
          @service('IValuesManager') values: IValuesManager) {

    this._locks = locks;
    this._sensors = sensors;
    this._triggers = triggers;
    this._presence = presence;
    this._values = values;
    this._logger = logger;
    this._config = config;

    this._init();

    locks.addType('zway', createLockFactory());
    // sensors.addType('zway', sensorFactory);
  }

  load() : void {
    this._logger.info('Starting zway controllers...');
    Object.keys(this._controllers).forEach(key => {
      this._controllers[key].start();
    });
  }

  _init() : void {
    this._logger.info('Starting zway plugin');

    const zwayConfig = (<any>this._config).zway || {};
    const controllersConfigs = zwayConfig.controllers || [];

    this._controllers = {};
    controllersConfigs.forEach(c => {
      this._controllers[c.id] = new ZwayController(c.id, c.host, c.user, c.password, c.port);
    });
  }

  _lockFactory(id : string, opts : any) : ILock {
    this._logger.info('Adding Z-Way lock: ' + id);
    const controller : ZwayController = this._controllers[opts.controller];
    return new ZwayLock(id, controller, opts.deviceId);
  }

  // _sensorFactory(id : string, opts : any) : ISensor {
  //   this._logger.info('Adding Z-Way sensor: ' + id);
  //   const controller : ZwayController = this._controllers[opts.controller];
  //   return new ZwaySensor(id, controller, opts, this._triggers, this._presence, this._values);
  // }
}
