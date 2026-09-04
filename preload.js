const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    "alarmSystem",
    {

        start: () => {
            ipcRenderer.send("alarm-start");
        },

        stop: () => {
            ipcRenderer.send("alarm-stop");
        }

    }
);
