/// <reference path="./node-zway.d.ts"/>

import { DeviceApi, IDevice } from 'node-zway';
const CLASS_LOCK = 98;
const CLASS_SENSOR_BINARY = 48;
const CLASS_SENSOR_MULTI = 49;
const CLASS_ALARM = 113;
const CLASS_BATTERY = 128;

export interface DeviceEvent {
  deviceId: string;
}

export interface LockEvent {
  device: string // eg: '11'
  class: string // always '98'
  className: string // always 'DoorLock'
  event: string // eg 'mode', 'insideMode', 'outsideMode', 'lockMinutes', 'lockSeconds', 'condition'
  data: number // eg: 255 for locked, 0 for unlocked
}

export interface AlarmEvent {
  device: string // eg: '11'
  class: string // always '113'
  className: string // always 'Alarm'
  event: string // generally 'V1event'
  data: {
    alarmType: number // eg: 25 == 'unlock', 24 'lock'
    level: number // 1
  }
}


export interface SensorEvent {
  device: string // eg: '11'
  class: string // eg: '48', '49'
  className: string // eg: 'SensorBinary', 'SensorMultilevel'
  event: string // generally '1'
  data: {
    sensorTypeString: string // eg: General purpose
    level: number | boolean | string // eg: true
    val: number
    scale: number
    scaleString: string
    deviceScale: string
  }
}

export interface DeviceEventCallback extends EventCallback<DeviceEvent> {
}

export interface EventCallback<T> {
  (event: T): void;
}

export class ZwayController {
  private _deviceApi: DeviceApi;

  constructor(
      id: string,
      host: string = 'localhost',
      user: string = 'admin',
      password: string = 'password',
      port: number = 8083) {
    this._deviceApi = new DeviceApi({host, port, user, password});
    this._deviceApi.poll(5000);
  }

  start() {
    this._deviceApi.refresh();
  }

  onSensorBinaryEvent(deviceId: number, callback: DeviceEventCallback) : void {
    this._deviceApi.on(deviceId, String(CLASS_SENSOR_BINARY), '*', callback);
  }

  onSensorMultiEvent(deviceId: number, callback: DeviceEventCallback) : void {
    this._deviceApi.on(deviceId, String(CLASS_SENSOR_MULTI), '*', callback);
  }

  onLockEvent(deviceId: number, callback: EventCallback<LockEvent>) : void {
    // console.log('lock callback', callback);
    // console.log('on', this._deviceApi.on.toString());
    this._deviceApi.on(deviceId, String(CLASS_LOCK), '*', callback);
  }

  onAlarmEvent(deviceId: number, callback: EventCallback<AlarmEvent>) : void {
    // console.log('alarm callback', callback);
    // console.log('on', this._deviceApi.on.toString());
    this._deviceApi.on(deviceId, String(CLASS_ALARM), '*', callback);
  }

  getDevice(deviceId: number) : IDevice {
    return this._deviceApi.getDevice(deviceId);
  }

  getLockDevice(deviceId: number) : IDevice {
    return this._deviceApi.getDevice(deviceId, CLASS_LOCK);
  }

  getSensorDevice(deviceId: number) : IDevice {
    return this._deviceApi.getDevice(deviceId, [CLASS_SENSOR_BINARY, CLASS_SENSOR_MULTI, CLASS_BATTERY]);
  }
}
