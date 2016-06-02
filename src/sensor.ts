import { TriggerSensor, ITriggerManager, IPresenceManager, IValuesManager } from 'homenet-core';
import { ZwayController } from './controller';

export class ZwaySensor extends TriggerSensor {
  constructor(
          instanceId: string,
          controller: ZwayController,
          opts: { deviceId: number, timeout?: number, zone?: string },
          triggers: ITriggerManager,
          presence: IPresenceManager,
          values: IValuesManager) {
    super(instanceId, opts, triggers, presence, values);
    controller.onSensorEvent(opts.deviceId, this._onSensorEvent.bind(this));
  }

  _onSensorEvent(event: any) : void {
    var deviceId = event.deviceId;
    console.log('ZWAY SENSOR EVENT FOR ' + deviceId);
    this.trigger();
  }
}
