declare module ZWay {
  export class DeviceApi {
    constructor(host: string);
    poll(inverval: number) : void;
    on(device: string, className: string, event: string, callback: Function);
    getDevice(deviceId: number, classId?: number) : IDevice;
  }

  export interface IDevice {
    DoorLock?: IDoorLock;
  }

  export interface IDoorLock {
    lock() : void;
    unlock() : void;
    refresh() : void;
    isLocked() : boolean;
  }
}

declare module 'node-zway' {
  export = ZWay;
}
