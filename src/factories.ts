import { ZwayMotionSensor, ZwayLuminiscenceSensor, ZwayHumiditySensor, ZwayTemperatureSensor } from './sensor';
import { Dict, ILogger, ILock, ISensor, ISettable } from '@homenet/core';
import { ZwayController } from './controller';
import { ZwayLock } from './lock';

export function createLockFactory(controllers: Dict<ZwayController>, logger: ILogger) {
  return function lockFactory(id : string, opts : any) : ISettable {
    logger.info('Adding Z-Way lock: ' + id);
    const controller : ZwayController = controllers[opts.controller];
    return new ZwayLock(id, controller, opts.deviceId);
  }
}

export function createSensorFactory(controllers: Dict<ZwayController>, logger: ILogger, type: 'motion' | 'temperature' | 'humidity' | 'luminiscence') {
  return function sensorFactory(id : string, opts : any) : ISensor {
    logger.info(`Adding Z-Way ${type} sensor: ${id}`);
    const controller : ZwayController = controllers[opts.controller];
    switch (type) {
      case 'motion':
        return new ZwayMotionSensor(id, controller, opts.deviceId);
      case 'temperature':
        return new ZwayTemperatureSensor(id, controller, opts.deviceId);
      case 'humidity':
        return new ZwayHumiditySensor(id, controller, opts.deviceId);
      case 'luminiscence':
        return new ZwayLuminiscenceSensor(id, controller, opts.deviceId);
      default:
        throw new Error(`Could not create ${type} sensor: ${id}`)
    }
  }
}
