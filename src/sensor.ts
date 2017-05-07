import { ISensor, IValueSensor, ISensorOpts, ITriggerManager, IPresenceManager, IValuesManager } from '@homenet/core';
import { EventEmitter } from 'events';
import { ZwayController, SensorEvent } from './controller';
import chalk = require('chalk');

export class ZwayMotionSensor extends EventEmitter implements ISensor {
  public opts: ISensorOpts;
  public isTrigger: boolean = false;
  public isToggle: boolean = true;
  public isValue: boolean = false;

  constructor(
          instanceId: string,
          private controller: ZwayController,
          private deviceId: number
          ) {
    super();
    this.isTrigger = false;
    this.isValue = false;
    this.isToggle = true;
  
    controller.onSensorBinaryEvent(deviceId, this.onSensorMotionEvent.bind(this));
  }

  get

  private onSensorMotionEvent(e: any) : void {
    if (e.event !== '1') {
      console.log('Expected motion event to have event name "1"');
      return;
    }
    this.emit('active', e.data.level);
  }
}

export abstract class ZwayValueSensor extends EventEmitter implements IValueSensor {
  public opts: ISensorOpts;
  public isTrigger: boolean = false;
  public isToggle: boolean = false;
  public isValue: boolean = true;
  protected inputKey;
  protected zwayType;
  private key: string;

  constructor(
          instanceId: string,
          private controller: ZwayController,
          private deviceId: number
          ) {
    super();
    this.isTrigger = false;
    this.isValue = true;
    this.isToggle = false;
  
    controller.onSensorMultiEvent(deviceId, this.onSensorValueEvent.bind(this));
  }

  get(key: string): number {
    if (key !== this.inputKey) return 0;

    const device = this.controller.getSensorDevice(this.deviceId);

    if (!this.key) {
      this.key = getKey(this.zwayType, device.SensorMultilevel.getItems());
    }
    if (!this.key) return 0;

    return device.SensorMultilevel.get(this.key).val;
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
          deviceId: number
          ) {
    super(instanceId, controller, deviceId);
    this.zwayType = 'Temperature';
    this.inputKey = 'temperature';
  }
}

export class ZwayHumiditySensor extends ZwayValueSensor {
  constructor(
          instanceId: string,
          controller: ZwayController,
          deviceId: number
          ) {
    super(instanceId, controller, deviceId);
    this.zwayType = 'Humidity';
    this.inputKey = 'humidity';
  }
}

export class ZwayLuminiscenceSensor extends ZwayValueSensor {
  constructor(
          instanceId: string,
          controller: ZwayController,
          deviceId: number
          ) {
    super(instanceId, controller, deviceId);
    this.zwayType = 'Luminiscence';
    this.inputKey = 'luminiscence';
  }
}

function getKey(type: string, items: Array<{ id:string, type:string, scale: string, value: number }>) : string {
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === type) return items[i].id;
  }
}
