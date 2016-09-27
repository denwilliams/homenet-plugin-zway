import { EventEmitter } from 'events';
import { ILock } from 'homenet-core';
import { ZwayController, DeviceEventCallback } from './controller';

const CLASS_LOCK = 98;

export class ZwayLock extends EventEmitter implements ILock {
  private _controller: ZwayController;
  private _device: ZWay.IDevice;

  constructor(id: string, controller: ZwayController, deviceId: number) {
    super();

    controller.onLockEvent(deviceId, this._onLockEvent.bind(this));
    controller.onAlarmEvent(deviceId, this._onAlarmEvent.bind(this));

    this._controller = controller;
    this._device = controller.getLockDevice(deviceId);
  }

  set(value: boolean) : void {
    if (value) {
      console.log('LOCK');
      this._device.DoorLock.lock();
    } else {
      console.log('UNLOCK');
      this._device.DoorLock.unlock();
    }
  }

  get() : boolean {
    return this._device.DoorLock.isLocked();
  }

  private _onLockEvent(e: any) { //DeviceEventCallback) {
    if (e.event === 'mode') {

    }
    // console.log('LOCK EVENT', e.event, e.data);
  }

  private _onAlarmEvent(event: DeviceEventCallback) {
    // refresh the lock state after an alarm event
    this._device.DoorLock.refresh()
    // TODO: only refresh after lock/unlock events
  }
}
