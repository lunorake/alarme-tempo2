const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");

let win = null;

function createWindow() {

    win = new BrowserWindow({

        width: 900,
        height: 900,

        minWidth: 500,
        minHeight: 600,

        backgroundColor: "#10151c",

        show: true,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }

    });

    win.loadFile("index.html");

    /*
     * Permite que o alerta fique acima
     * de outros programas do Windows.
     */

    win.setAlwaysOnTop(false);

    win.on("closed", () => {
        win = null;
    });
}


/*
 * INICIA O ALERTA DE SISTEMA
 */

ipcMain.on("alarm-start", () => {

    if (!win)
        return;

    /*
     * Mostra a janela mesmo se estiver
     * minimizada ou atrás de outro programa.
     */

    win.show();

    /*
     * Coloca a janela acima das outras
     * aplicações do Windows.
     */

    win.setAlwaysOnTop(
        true,
        "screen-saver"
    );

    /*
     * Faz ocupar a tela inteira.
     */

    win.setFullScreen(true);

    /*
     * Traz para frente.
     */

    win.focus();

});


/*
 * PARA O ALERTA
 */

ipcMain.on("alarm-stop", () => {

    if (!win)
        return;

    win.setFullScreen(false);

    win.setAlwaysOnTop(false);

    win.show();

});


/*
 * CRIA A APLICAÇÃO
 */

app.whenReady().then(() => {

    createWindow();

    app.on("activate", () => {

        if (
            BrowserWindow.getAllWindows()
                .length === 0
        ) {
            createWindow();
        }

    });

});


/*
 * FECHA O APLICATIVO NO WINDOWS
 */

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});
