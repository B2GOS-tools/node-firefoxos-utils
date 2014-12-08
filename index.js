    ADB = require('adb').DebugBridge;

var FFOS_Cli = function FFOS_Cli() {

  var config;
  var adb = new ADB();

  var configure = function configure(json) {
    config = json;
  };

  // Push a file with local preferences to the right place in the device
  var pushPrefs = function pushPrefs(callback) {
    console.log("INVOKE PUSHPREFS")
    adb.traceDevice(function onDevices(devices) {
      // Work with the first device we found, if any
      if (!devices || devices.length == 0) {
        callback('No devices found');
        return;
      }
      var device = devices[0];

      device.shellCmd('echo', ['-n /data/b2g/mozilla/*.default/prefs.js'], function onCmd(data){
        pushFile("prefs.js", data, function onPushed(err, success) {
          // Know bug in adb library it returns error 15 despite of uploading the file
          if (err && err != 15) {
            callback(err);
            return;
          }
          console.log("CALLBACK:::")
          callback(null, "OK");
        });
      });
    });
  };

  // Pull a remote file from the phone to a local location
  var pullPrefs = function pullPrefs(callback) {
    adb.traceDevice(function onDevices(devices) {
      // Work with the first device we found, if any
      if (!devices || devices.length == 0) {
        callback('No devices found');
        return;
      }
      var device = devices[0];

      device.shellCmd('echo', ['-n /data/b2g/mozilla/*.default/prefs.js'], function onCmd(data){
       pullFile(data, "prefs.js", callback);
      });
    });
  };

  // Pull a file from the device to a local location 
  var pullFile = function pullFile(remote, local, callback) {
    adb.traceDevice(function onDevices(devices) {
      // Work with the first device we found, if any
      if (!devices || devices.length == 0) {
        callback('No devices found');
        return;
      }
      var device = devices[0];

      device.getSyncService(function onSyncService(sync) {
        sync.pullFile(remote, local, function onRead(data){
          callback(null, data);
          return;
        });
      });
    });
  };

  // Push a local file to a remote location on the phone
  var pushFile = function pushFile(local, remote, callback) {
    adb.traceDevice(function onDevices(devices) {
      // Work with the first device we found, if any
      if (!devices || devices.length == 0) {
        callback('No devices found');
        return;
      }
      var device = devices[0];

      device.getSyncService(function onSyncService(sync) {
        sync.pushFile(local, remote, callback);
      });
    });
  };

  // Resets the B2G process as the name says
  var resetB2G = function resetB2G(callback) {
    adb.traceDevice(function onDevices(devices) {
      // Work with the first device we found, if any
      if (!devices || devices.length == 0) {
        callback('No devices found');
        return;
      }
      var device = devices[0];

      device.shellCmd('stop', ['b2g'], function onCmd(data) {
        device.shellCmd('start', ['b2g'], function onCmd(data) {
          if (callback) {
            callback();
          }
        });
      });
    });
  };

  // Stops the B2G process as the name says
  var stopB2G = function stopB2G(callback) {
    adb.traceDevice(function onDevices(devices) {
      // Work with the first device we found, if any
      if (!devices || devices.length == 0) {
        callback('No devices found');
        return;
      }
      var device = devices[0];
      device.shellCmd('stop', ['b2g'], function onCmd(data) {
        if (callback) {
          callback();
          return;
        }
      });
    });
  };

  // Starts the B2G process as the name says
  var startB2G = function startB2G(callback) {
    adb.traceDevice(function onDevices(devices) {
      // Work with the first device we found, if any
      if (!devices || devices.length == 0) {
        callback('No devices found');
        return;
      }
      var device = devices[0];
      device.shellCmd('start', ['b2g'], function onCmd(data) {
        if (callback) {
          callback();
        }
      });
    });
  };

  return {
    'config': config,
    'pullPrefs': pullPrefs,
    'pushPrefs': pushPrefs,
    'startB2G': startB2G,
    'stopB2G': stopB2G,
    'resetB2G': resetB2G
  };

}();

module.exports = FFOS_Cli;
