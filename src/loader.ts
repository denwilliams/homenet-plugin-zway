import { plugin, service, Dict, IPluginLoader, ILogger, IConfig, ILockManager, ISensorManager, ILock, ISensor, ITriggerManager, IPresenceManager, IValuesManager, ISettable } from '@homenet/core';

import { ZwayController } from './controller';
import { ZwayLock } from './lock';
import { createLockFactory } from './factories';
// import { ZwaySensor } from './sensor';

@plugin()
export class ZwayPluginLoader implements IPluginLoader {
  private controllers : Dict<ZwayController>;

  constructor(
          @service('IConfig') private config: IConfig,
          @service('ILockManager') private locks: ILockManager,
          @service('ISensorManager') private sensors: ISensorManager,
          @service('ILogger') private logger: ILogger,
          @service('ITriggerManager') private triggers: ITriggerManager,
          @service('IPresenceManager') private presence: IPresenceManager,
          @service('IValuesManager') private values: IValuesManager) {

    this.init();
    locks.addSettableType('zway', createLockFactory(this.controllers, this.logger));
    // sensors.addType('zway', sensorFactory);
  }

  load() : void {
    this.logger.info('Starting zway controllers...');
    Object.keys(this.controllers).forEach(key => {
      this.controllers[key].start();
    });
  }

  private init() : void {
    this.logger.info('Starting zway plugin');

    const zwayConfig = (<any>this.config).zway || {};
    const controllersConfigs = zwayConfig.controllers || [];

    this.controllers = {};
    controllersConfigs.forEach(c => {
      this.controllers[c.id] = new ZwayController(c.id, c.host, c.user, c.password, c.port);
    });
  }

  private lockFactory(id : string, opts : any) : ISettable {
    this.logger.info('Adding Z-Way lock: ' + id);
    const controller : ZwayController = this.controllers[opts.controller];
    return new ZwayLock(id, controller, opts.deviceId);
  }
}
