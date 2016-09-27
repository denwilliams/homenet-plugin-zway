import { Dict, ILogger, ILock, ISensor } from 'homenet-core';
import { ZwayController } from './controller';
import { ZwayLock } from './lock';

export function createLockFactory(controllers: Dict<ZwayController>, logger: ILogger) {
  return function lockFactory(id : string, opts : any) : ILock {
    logger.info('Adding Z-Way lock: ' + id);
    const controller : ZwayController = controllers[opts.controller];
    return new ZwayLock(id, controller, opts.deviceId);
  }
}

// export function createSensorFactory() {
//   return function _sensorFactory(id : string, opts : any) : ISensor {
//     this._logger.info('Adding Z-Way sensor: ' + id);
//     const controller : ZwayController = this._controllers[opts.controller];
//     return new ZwaySensor(id, controller, opts, this._triggers, this._presence, this._values);
//   }
// }
