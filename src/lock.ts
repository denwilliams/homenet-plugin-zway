import { EventEmitter } from 'events';
import { ILock } from 'homenet-core';
import { ZwayController, DeviceEventCallback } from './controller';

const CLASS_LOCK = 98;

export class ZwayLock extends EventEmitter implements ILock {
  private _controller: ZwayController;
  private _device: ZWay.IDevice;

  constructor(id: string, controller: ZwayController, deviceId: number) {
    super();
    this._controller = controller;
    controller.onLockEvent(deviceId, this._onLockEvent.bind(this));
    this._device = controller.getLockDevice(deviceId);
  }

  set(value: boolean) : void {
    if (value) this._device.DoorLock.lock();
    else this._device.DoorLock.unlock();
  }

  get() : boolean {
    return this._device.DoorLock.isLocked();
  }

  private _onLockEvent(event: DeviceEventCallback) {

  }
}
