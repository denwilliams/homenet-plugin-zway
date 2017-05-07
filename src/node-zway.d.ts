declare module ZWay {
  export class DeviceApi {
    constructor(host: string);
    constructor(opts: {host: string, port: number, user: string, password: string});
    refresh() : void;
    poll(inverval: number) : void;
    on(device: number, className: string, event: string, callback: Function);
    onAny(Function);
    getDevice(deviceId: number, classId?: number) : IDevice;
    getDevice(deviceId: number, classIds: [number]) : IDevice;
  }

  export interface IDevice {
    DoorLock?: IDoorLock
    SensorBinary?: any
    SensorMultilevel?: any
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
