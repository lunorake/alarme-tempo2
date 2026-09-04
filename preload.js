const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    "alarmSystem",
    {

        start: function () {

            ipcRenderer.send(
                "alarm-start"
            );

        },

        stop: function () {

            ipcRenderer.send(
                "alarm-stop"
            );

        }

    }
);
