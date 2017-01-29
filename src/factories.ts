import { Dict, ILogger, ILock, ISensor, ISettable } from 'homenet-core';
import { ZwayController } from './controller';
import { ZwayLock } from './lock';

export function createLockFactory(controllers: Dict<ZwayController>, logger: ILogger) {
  return function lockFactory(id : string, opts : any) : ISettable {
    logger.info('Adding Z-Way lock: ' + id);
    const controller : ZwayController = controllers[opts.controller];
    return new ZwayLock(id, controller, opts.deviceId);
  }
}
