const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    "alarmSystem",
    {
        start: function(mode) {
            ipcRenderer.send(
                "alarm-start",
                mode
            );
        },

        stop: function() {
            ipcRenderer.send(
                "alarm-stop"
            );
        }
    }
);
