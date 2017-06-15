declare module 'homenet-plugin-zway' {
  import { IPluginLoader } from '@homenet/core';
  export function create(annotate: any): { ZwayPluginLoader: new (...args: any[]) => IPluginLoader }
}
