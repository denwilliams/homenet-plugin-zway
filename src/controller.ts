/// <reference path="./node-zway.d.ts"/>

import { DeviceApi, IDevice } from 'node-zway';
const CLASS_LOCK = 98;

export interface DeviceEvent {
  deviceId: string;
}

export interface DeviceEventCallback {
  (event: DeviceEvent): void;
}


export class ZwayController {
  private _deviceApi: DeviceApi;

  constructor(id: string, host: string = 'localhost', port: number = 1234) {
    this._deviceApi = new DeviceApi(host);
    this._deviceApi.poll(5000);
  }

  onSensorEvent(deviceId: number, callback: DeviceEventCallback) : void {
    this._deviceApi.on(String(deviceId), '48', '*', callback);
  }

  onLockEvent(deviceId: number, callback: DeviceEventCallback) : void {
    console.log('callback', callback);
    console.log('on', this._deviceApi.on.toString());
    this._deviceApi.on(String(deviceId), '98', '*', callback);
  }

  getDevice(deviceId: number) : IDevice {
    return this._deviceApi.getDevice(deviceId);
  }

  getLockDevice(deviceId: number) : IDevice {
    return this._deviceApi.getDevice(deviceId, CLASS_LOCK);
  }

  // getSensorDevice(deviceId: number) : IDevice {
  //   return this._deviceApi.getDevice(deviceId, CLASS_LOCK);
  // }
}
