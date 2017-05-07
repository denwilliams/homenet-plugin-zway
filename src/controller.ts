/// <reference path="./node-zway.d.ts"/>

import { DeviceApi, IDevice } from 'node-zway';
const CLASS_LOCK = 98;

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

  onSensorEvent(deviceId: number, callback: DeviceEventCallback) : void {
    this._deviceApi.on(deviceId, '48', '*', callback);
  }

  onLockEvent(deviceId: number, callback: EventCallback<LockEvent>) : void {
    // console.log('lock callback', callback);
    // console.log('on', this._deviceApi.on.toString());
    this._deviceApi.on(deviceId, '98', '*', callback);
  }

  onAlarmEvent(deviceId: number, callback: EventCallback<AlarmEvent>) : void {
    // console.log('alarm callback', callback);
    // console.log('on', this._deviceApi.on.toString());
    this._deviceApi.on(deviceId, '113', '*', callback);
  }

  getDevice(deviceId: number) : IDevice {
    return this._deviceApi.getDevice(deviceId);
  }

  getLockDevice(deviceId: number) : IDevice {
    return this._deviceApi.getDevice(deviceId, CLASS_LOCK);
  }

  // getSensorDevice(deviceId: number) : IDevice {
  //   return this._deviceApi.getDevice(deviceId, CLASS_SENSOR);
  // }
}
