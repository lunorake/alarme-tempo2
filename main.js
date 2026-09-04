const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");

let win = null;


/*
========================================
 CRIAR JANELA
========================================
*/

function createWindow() {

    win = new BrowserWindow({

        width: 700,
        height: 850,

        minWidth: 450,
        minHeight: 600,

        backgroundColor: "#10151c",

        /*
         * MOSTRA IMEDIATAMENTE
         * para reduzir a sensação de demora.
         */
        show: true,

        autoHideMenuBar: true,

        webPreferences: {

            preload:
                path.join(
                    __dirname,
                    "preload.js"
                ),

            contextIsolation: true,

            nodeIntegration: false,

            sandbox: false

        }

    });


    /*
     * Carrega o aplicativo.
     */

    win.loadFile(
        path.join(
            __dirname,
            "index.html"
        )
    );


    /*
     * Quando carregar, garante
     * que a janela esteja disponível.
     */

    win.webContents.on(
        "did-finish-load",
        () => {

            win.show();

        }
    );


    /*
     * Erros de carregamento.
     */

    win.webContents.on(
        "did-fail-load",
        (
            event,
            errorCode,
            errorDescription
        ) => {

            console.error(
                "Erro:",
                errorCode,
                errorDescription
            );

        }
    );


    win.on(
        "closed",
        () => {

            win = null;

        }
    );

}


/*
========================================
 ALERTA
========================================

 mode:

 fullscreen
 window
 small
*/

ipcMain.on(
    "alarm-start",
    (
        event,
        mode
    ) => {

        if (!win)
            return;


        /*
         * Primeiro mostra.
         */

        win.show();

        win.focus();


        /*
         * Tira configurações anteriores.
         */

        win.setFullScreen(false);

        win.setAlwaysOnTop(false);


        /*
         =================================
         TELA CHEIA
         =================================
        */

        if (
            mode === "fullscreen"
        ) {

            win.setFullScreen(true);

            win.setAlwaysOnTop(
                true,
                "screen-saver"
            );

            win.focus();

            return;

        }


        /*
         =================================
         JANELA GRANDE
         =================================
        */

        if (
            mode === "window"
        ) {

            win.setSize(
                1000,
                700
            );

            win.center();

            win.setAlwaysOnTop(
                true
            );

            win.focus();

            return;

        }


        /*
         =================================
         JANELA PEQUENA
         =================================
        */

        if (
            mode === "small"
        ) {

            win.setSize(
                600,
                400
            );

            win.center();

            win.setAlwaysOnTop(
                true
            );

            win.focus();

            return;

        }

    }
);


/*
========================================
 PARAR ALERTA
========================================
*/

ipcMain.on(
    "alarm-stop",
    () => {

        if (!win)
            return;


        win.setFullScreen(false);

        win.setAlwaysOnTop(false);


        /*
         * Volta ao tamanho normal.
         */

        win.setSize(
            700,
            850
        );

        win.center();

        win.show();

        win.focus();

    }
);


/*
========================================
 INICIAR ELECTRON
========================================
*/

app.whenReady().then(
    () => {

        createWindow();

    }
);


/*
========================================
 FECHAR WINDOWS
========================================
*/

app.on(
    "window-all-closed",
    () => {

        app.quit();

    }
);
