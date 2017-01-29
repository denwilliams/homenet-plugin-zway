# homenet-plugin-zway
Z-Way plugin for controlling Z-Wave devices through a Z-Way controller.

Note: currently only supports locks, and only tested on a Yale lock (other locks might work slightly differently).
Sensors and binary switches coming soon.

## Registering the Plugin

Use the `loadPlugin` method on the core runtime:

```js
const core = require('@homenet/core');
const zwayPlugin = require('@homenet/plugin-zway');
const runtime = core.init(RED, myConfig);
runtime.loadPlugin(zwayPlugin.ZwayPluginLoader);
runtime.start();
```

## Configuration

In the configuration file create a `zway.controllers` key and register each Z-Way controller:

```json
{
  "zway": {
    "controllers": [
      { "id": "main", "host": "192.168.0.123", "port": 8083, "user": "admin", "password": "mysecretpasswd" }
    ]
  }
}
```

## Classes

Currently only the lock class for Homenet is implemented.

To add an instance use the type `zway`.

For options specify the Z-Way `deviceId` (should be an integer), and the ID of the `controller` registered above.

```json
{
  "instances": [
    { "class": "lock", "id": "front-door", "type": "zway", "options": { "deviceId": 3, "controller": "main" } }
  ]
}
```

## Example Config

```json
{
  "instances": [
    { "class": "lock", "id": "front-door", "type": "zway", "options": { "deviceId": 3, "controller": "main" } }
  ],
  "zway": {
    "controllers": [
      { "id": "main", "host": "192.168.0.123", "port": 8083, "user": "admin", "password": "mysecretpasswd" }
    ]
  }
}
```
