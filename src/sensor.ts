import { ISensor, IValueSensor, ISensorOpts, ITriggerManager, IPresenceManager, IValuesManager } from '@homenet/core';
import { EventEmitter } from 'events';
import { ZwayController, SensorEvent } from './controller';
import { IDevice } from 'node-zway';

export class ZwayMotionSensor extends EventEmitter implements ISensor {
  public isTrigger: boolean = false;
  public isToggle: boolean = true;
  public isValue: boolean = false;

  constructor(
          instanceId: string,
          private controller: ZwayController,
          public opts: { deviceId: number, zoneId: string }
          ) {
    super();
    this.isTrigger = false;
    this.isValue = false;
    this.isToggle = true;
  
    controller.onSensorBinaryEvent(opts.deviceId, this.onSensorMotionEvent.bind(this));
  }

  private onSensorMotionEvent(e: any) : void {
    if (e.event !== '1') {
      console.log('Expected motion event to have event name "1"');
      return;
    }
    this.emit('active', e.data.level);
  }
}

export abstract class ZwayValueSensor extends EventEmitter implements IValueSensor {
  public isTrigger: boolean = false;
  public isToggle: boolean = false;
  public isValue: boolean = true;
  protected inputKey;
  protected zwayType;
  private key: string;
  private deviceId: number;
  private device: IDevice;

  constructor(
          instanceId: string,
          private controller: ZwayController,
          public opts: { deviceId: number, zoneId: string }
          ) {
    super();
    this.isTrigger = false;
    this.isValue = true;
    this.isToggle = false;
    this.deviceId = opts.deviceId;
    this.device = this.controller.getSensorDevice(this.deviceId);
  
    controller.onSensorMultiEvent(opts.deviceId, this.onSensorValueEvent.bind(this));

    setInterval(() => {
      this.device.SensorMultilevel.refresh();
    }, 60000);
  }

  get(key: string): number {
    if (key !== this.inputKey) return 0;

    if (!this.key) {
      this.key = getKey(this.zwayType, this.device.SensorMultilevel.getItems());
    }
    if (!this.key) return 0;

    return this.device.SensorMultilevel.get(this.key).val;
  }

  set(key: string, value: string) {
    // not possible
  }

  private onSensorValueEvent(e: SensorEvent) : void {
    if (!this.key) {
      const device = this.controller.getSensorDevice(this.deviceId);
      this.key = getKey(this.zwayType, device.SensorMultilevel.getItems());
    }
    if (e.event !== this.key) return;

    // console.log('ZWAY SENSOR EVENT', event);
    this.emit('value', this.inputKey, e.data.val);
  }
}

export class ZwayTemperatureSensor extends ZwayValueSensor {
  constructor(
          instanceId: string,
          controller: ZwayController,
          opts: { deviceId: number, zoneId: string }
          ) {
    super(instanceId, controller, opts);
    this.zwayType = 'Temperature';
    this.inputKey = 'temperature';
  }
}

export class ZwayHumiditySensor extends ZwayValueSensor {
  constructor(
          instanceId: string,
          controller: ZwayController,
          opts: { deviceId: number, zoneId: string }
          ) {
    super(instanceId, controller, opts);
    this.zwayType = 'Humidity';
    this.inputKey = 'humidity';
  }
}

export class ZwayLuminiscenceSensor extends ZwayValueSensor {
  constructor(
          instanceId: string,
          controller: ZwayController,
          opts: { deviceId: number, zoneId: string }
          ) {
    super(instanceId, controller, opts);
    this.zwayType = 'Luminiscence';
    this.inputKey = 'luminiscence';
  }
}

function getKey(type: string, items: Array<{ id:string, type:string, scale: string, value: number }>) : string {
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === type) return items[i].id;
  }
}
