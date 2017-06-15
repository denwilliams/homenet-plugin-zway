import { plugin, service, Dict, IPluginLoader, ILogger, IConfig, ILockManager, ISensorManager, ILock, ISensor, ITriggerManager, IPresenceManager, IValuesManager, ISettable } from '@homenet/core';

import { ZwayController } from './controller';
import { ZwayLock } from './lock';
import { createLockFactory, createSensorFactory } from './factories';

export function create(annotate): { ZwayPluginLoader: new(...args: any[]) => IPluginLoader } {
  @annotate.plugin()
  class ZwayPluginLoader implements IPluginLoader {
    private controllers : Dict<ZwayController>;

    constructor(
            @annotate.service('IConfig') private config: IConfig,
            @annotate.service('ILockManager') private locks: ILockManager,
            @annotate.service('ISensorManager') private sensors: ISensorManager,
            @annotate.service('ILogger') private logger: ILogger,
            @annotate.service('ITriggerManager') private triggers: ITriggerManager,
            @annotate.service('IPresenceManager') private presence: IPresenceManager,
            @annotate.service('IValuesManager') private values: IValuesManager) {

      this.init();
      locks.addSettableType('zway', createLockFactory(this.controllers, this.logger));
      sensors.addType('zway-motion', createSensorFactory(this.controllers, this.logger, 'motion'));
      sensors.addType('zway-temperature', createSensorFactory(this.controllers, this.logger, 'temperature'));
      sensors.addType('zway-humidity', createSensorFactory(this.controllers, this.logger, 'humidity'));
      sensors.addType('zway-luminescence', createSensorFactory(this.controllers, this.logger, 'luminescence'));
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

  return { ZwayPluginLoader };
}
