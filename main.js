const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("path");

let win = null;


// ========================================
// CRIAR JANELA PRINCIPAL
// ========================================

function createWindow() {

    win = new BrowserWindow({

        width: 700,
        height: 850,

        minWidth: 450,
        minHeight: 600,

        backgroundColor: "#10151c",

        show: true,

        autoHideMenuBar: true,

        webPreferences: {

            preload: path.join(
                __dirname,
                "preload.js"
            ),

            contextIsolation: true,

            nodeIntegration: false,

            sandbox: false,

            // Evita que o Electron
            // reduza a execução do timer
            // quando a janela estiver em segundo plano.
            backgroundThrottling: false
        }
    });


    // ========================================
    // CARREGAR O INDEX.HTML
    // ========================================

    win.loadFile(
        path.join(
            __dirname,
            "index.html"
        )
    );


    // Garante que a janela apareça
    // depois que o HTML terminar de carregar.

    win.webContents.on(
        "did-finish-load",
        () => {

            win.show();

        }
    );


    // ========================================
    // TRATAMENTO DE ERRO AO CARREGAR
    // ========================================

    win.webContents.on(
        "did-fail-load",
        (
            event,
            errorCode,
            errorDescription
        ) => {

            console.error(
                "Erro ao carregar o aplicativo:",
                errorCode,
                errorDescription
            );

        }
    );


    // ========================================
    // QUANDO A JANELA FOR FECHADA
    // ========================================

    win.on(
        "closed",
        () => {

            win = null;

        }
    );
}


// ========================================
// INICIAR ALERTA
// ========================================

ipcMain.on(
    "alarm-start",
    (
        event,
        mode
    ) => {

        if (!win)
            return;


        // Mostra a janela

        win.show();

        win.focus();


        // Primeiro restaura
        // o estado normal da janela.

        win.setFullScreen(false);

        win.setAlwaysOnTop(false);


        // ====================================
        // ALERTA EM TELA CHEIA
        // ====================================

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


        // ====================================
        // ALERTA EM JANELA GRANDE
        // ====================================

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


        // ====================================
        // ALERTA EM JANELA PEQUENA
        // ====================================

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


// ========================================
// PARAR ALERTA
// ========================================

ipcMain.on(
    "alarm-stop",
    () => {

        if (!win)
            return;


        // Sai do modo tela cheia

        win.setFullScreen(false);


        // Remove "sempre no topo"

        win.setAlwaysOnTop(false);


        // Volta ao tamanho original

        win.setSize(
            700,
            850
        );


        // Centraliza novamente

        win.center();


        // Mostra a janela

        win.show();


        // Coloca o foco nela

        win.focus();

    }
);


// ========================================
// ELECTRON PRONTO
// ========================================

app.whenReady().then(
    () => {

        createWindow();

    }
);


// ========================================
// FECHAR APLICATIVO
// ========================================

app.on(
    "window-all-closed",
    () => {

        app.quit();

    }
);
