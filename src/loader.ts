import { plugin, service, IPluginLoader, ILogger, IConfig, ILockManager, ILock, ISensor, ITriggerManager, IPresenceManager, IValuesManager } from 'homenet-core';

import { ZwayController } from './controller';
import { ZwayLock } from './lock';
import { ZwaySensor } from './sensor';

@plugin()
export class ZwayPluginLoader implements IPluginLoader {

  private _logger : ILogger;
  private _config : IConfig;
  private _locks : ILockManager;
  private _controllers : any;
  private _triggers: ITriggerManager;
  private _presence: IPresenceManager;
  private _values: IValuesManager;

  constructor(
          @service('IConfig') config: IConfig,
          @service('ILockManager') locks: ILockManager,
          @service('ILogger') logger: ILogger,
          @service('ITriggerManager') triggers: ITriggerManager,
          @service('IPresenceManager') presence: IPresenceManager,
          @service('IValuesManager') values: IValuesManager) {

    this._locks = locks;
    this._triggers = triggers;
    this._presence = presence;
    this._values = values;
    this._logger = logger;
    this._config = config;

    this._controllers = {};

    this._init();

    const lockFactory = this._lockFactory.bind(this);
    locks.addType('zway', lockFactory);
  }

  load() : void {
    this._logger.info('Loading zway stuff');
  }

  _init() : void {
    this._logger.info('Starting zway');

    const zwayConfig = (<any>this._config).zway || {};
    const controllersConfigs = zwayConfig.controllers || [];

    controllersConfigs.forEach(c => {
      this._controllers[c.id] = new ZwayController(c.id, c.host, c.port);
    });
  }

  _lockFactory(id : string, opts : any) : ILock {
    this._logger.info('Adding Z-Way lock: ' + id);
    const controller : ZwayController = this._controllers[opts.controller];
    return new ZwayLock(id, controller, opts.deviceId);
  }

  _sensorFactory(id : string, opts : any) : ISensor {
    this._logger.info('Adding Z-Way sensor: ' + id);
    const controller : ZwayController = this._controllers[opts.controller];
    return new ZwaySensor(id, controller, opts, this._triggers, this._presence, this._values);
  }
}
