import { EventEmitter } from 'events';
import { ISettable } from '@homenet/core';
import { ZwayController, DeviceEventCallback } from './controller';

const CLASS_LOCK = 98;

export class ZwayLock extends EventEmitter implements ISettable {
  private device: ZWay.IDevice;

  constructor(id: string, private controller: ZwayController, deviceId: number) {
    super();

    controller.onLockEvent(deviceId, this.onLockEvent.bind(this));
    controller.onAlarmEvent(deviceId, this.onAlarmEvent.bind(this));

    this.controller = controller;
    this.device = controller.getLockDevice(deviceId);
  }

  set(value: boolean) : void {
    if (value) {
      this.device.DoorLock.lock();
    } else {
      this.device.DoorLock.unlock();
    }
    // TODO: this should be emitted via onLockEvent below
    this.emit('update', value);
  }

  get() : boolean {
    return this.device.DoorLock.isLocked();
  }

  private onLockEvent(e: any) { //DeviceEventCallback) {
    if (e.event === 'mode') {

    }
    // console.log('LOCK EVENT', e.event, e.data);
  }

  private onAlarmEvent(event: DeviceEventCallback) {
    // refresh the lock state after an alarm event
    this.device.DoorLock.refresh()
    // TODO: only refresh after lock/unlock events
  }
}
