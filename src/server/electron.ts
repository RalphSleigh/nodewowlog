import "source-map-support/register";
import "reflect-metadata";

import {app, BrowserWindow, dialog} from "electron";
import {AppServer} from "./lib/web/server";
import {Container} from "typedi";

import {args} from "./electron/args";
import {parseLogFile} from "./lib/parseLogFile";

const server = Container.get(AppServer)

server.listen("localhost", 0).then(appServer => {

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
    const port = appServer.address()?.port

    async function createWindow() {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
            }
        })

        win.setMenuBarVisibility(false)

        await win.loadURL(`http://localhost:${port}/`)

        if(!app.isPackaged) win.webContents.openDevTools()

        let logFile;
        if (args.log) {
            logFile = args.log
        } else {
            const result = await dialog.showOpenDialog(win, {
                title: 'Choose Log File',
                properties: ['openFile']
            })
            logFile = result.filePaths[0]
        }

        console.log(`Reading ${logFile}`);
        parseLogFile(logFile)

    }

    app.whenReady().then(createWindow)

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
});