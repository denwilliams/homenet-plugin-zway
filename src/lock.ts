import { EventEmitter } from 'events';
import { ISettable } from '@homenet/core';
import { ZwayController, DeviceEvent, AlarmEvent, LockEvent } from './controller';

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
  }

  get() : boolean {
    return this.device.DoorLock.isLocked();
  }

  private onLockEvent(e: LockEvent) { //DeviceEventCallback) {
    if (e.event === 'mode') {
      this.emit('update', e.data === 0 ? false : true);
    }
    // console.log('LOCK EVENT', e.event, e.data);
  }

  private onAlarmEvent(event: AlarmEvent) {
    // NOTE: these strings are correct for Yale lock. Other locks may be different / set may be incomplete.
    this.emit('alert', { message: alarmEventAsString(event.data) });

    // refresh the lock state after an alarm event
    this.device.DoorLock.refresh()
    // TODO: only refresh after lock/unlock events
  }
}

function alarmEventAsString(eventData: { alarmType: number, level: number }) {
  let major;
  let minor;

  switch (eventData.alarmType) {
    case 9:
      major = 'Deadbolt';
      minor = 'jammed';
      break;
    case 18:
      major = 'Locked with code';
      minor = 'by user ' + (eventData.level + 1);
      break;
    case 19:
      major = 'Unlocked with code';
      minor = 'by user ' + (eventData.level + 1);
      break;
    case 21:
      major = 'Manually locked';
      switch (eventData.level) {
        case 1:
          minor = 'by thumb turn or key';
          break;
        case 2:
          minor = 'by outside pad';
          break;
        default:
          minor = 'by ' + eventData.level;
          break;
      }
      break;
    case 22:
      major = 'Manually unlocked';
      switch (eventData.level) {
        case 1:
          minor = 'by thumb turn or key';
          break;
        default:
          minor = 'by ' + eventData.level;
          break;
      }
      break;
    case 24:
      major = 'Locked via software';
      switch (eventData.level) {
        case 1:
          minor = 'by RF module';
          break;
        default:
          minor = 'by ' + eventData.level;
          break;
      }
      break;
    case 25:
      major = 'Unlocked via software';
      switch (eventData.level) {
        case 1:
          minor = 'by RF module';
          break;
        default:
          minor = 'by ' + eventData.level;
          break;
      }
      break;
    case 25:
      major = 'Lock automatically';
      switch (eventData.level) {
        case 1:
          minor = 'locked';
          break;
        default:
          minor = eventData.level;
          break;
      }
      break;
    case 33:
      major = 'Deleted user';
      minor = eventData.level;
      break;
    case 112:
      major = 'Added or updated user';
      minor = eventData.level;
      break;
    case 113:
      major = 'Duplicate code for user';
      minor = eventData.level;
      break;
    case 130:
      major = 'RF module power';
      minor = 'cycled';
      break;
    case 161:
      major = 'Tamper alarm -';
      switch (eventData.level) {
        case 1:
          minor = 'keypad attempts exceed code entry limit';
          break;
        case 2:
          minor = 'front escutcheon removed from main';
          break;
        default:
          minor = eventData.level;
          break;
      }
      break;
    case 167:
      major = 'Low';
      minor = 'battery';
      break;
    case 168:
      major = 'Critical';
      minor = 'battery';
      break;
    case 169:
      major = 'Insufficient';
      minor = 'battery';
      break;
    default:
      major = eventData.alarmType + ' :';
      minor = eventData.level;
  }

  return `${major} ${minor}`;
}
