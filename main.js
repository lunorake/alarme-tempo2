const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");

let win = null;

function createWindow() {

    win = new BrowserWindow({
        width: 700,
        height: 850,

        minWidth: 450,
        minHeight: 600,

        backgroundColor: "#10151c",

        show: false,

        autoHideMenuBar: true,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    });

    /*
     * Carrega o HTML.
     */
    win.loadFile(
        path.join(__dirname, "index.html")
    );

    /*
     * Só mostra a janela depois
     * que o HTML estiver carregado.
     */
    win.once("ready-to-show", () => {
        win.show();
    });

    /*
     * Caso ocorra algum erro ao carregar
     * a página, registra no console.
     */
    win.webContents.on(
        "did-fail-load",
        (event, errorCode, errorDescription) => {

            console.error(
                "Erro ao carregar:",
                errorCode,
                errorDescription
            );

        }
    );

    win.on("closed", () => {
        win = null;
    });
}


/*
========================================
 ALERTA — SEMPRE POR CIMA
========================================
*/

ipcMain.on("alarm-start", () => {

    if (!win)
        return;

    win.show();

    /*
     * Sempre por cima das outras janelas.
     */
    win.setAlwaysOnTop(
        true,
        "screen-saver"
    );

    /*
     * Coloca a janela em tela cheia.
     */
    win.setFullScreen(true);

    /*
     * Traz para frente.
     */
    win.focus();

});


/*
========================================
 PARAR ALERTA
========================================
*/

ipcMain.on("alarm-stop", () => {

    if (!win)
        return;

    win.setFullScreen(false);

    win.setAlwaysOnTop(false);

    win.show();

    win.focus();

});


/*
========================================
 INICIAR ELECTRON
========================================
*/

app.whenReady().then(() => {

    createWindow();

});


/*
========================================
 WINDOWS
========================================
*/

app.on("window-all-closed", () => {

    app.quit();

});
