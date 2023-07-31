import { app, BrowserWindow, ipcMain, Menu, MenuItemConstructorOptions, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { sequelize } from './db';
import { findPostById, findPostsByCategory } from './post.';
import { findVideoById, findVideosByCategory } from './video';
import { fetchNewData } from './fetchData';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;
  const template: MenuItemConstructorOptions[] = [];

  // Create the browser window.
  win = new BrowserWindow({
    width: (size.width * 0.8) | 0,
    height: (size.height * 0.8) | 0,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });
  win.center();
  win.setMinimumSize(400, 400);

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  ipcMain.on('get-post-list', async (event, args) => {
    const { category, keyword, orderType, pageNumber, pageSize } = args;
    try {
      const postList = await findPostsByCategory(
        category,
        keyword,
        orderType,
        pageNumber,
        pageSize
      );
      event.reply('get-post-list-reply', { success: true, postList });
    } catch (error) {
      event.reply('get-post-list-reply', { success: false, error: error });
    }
  });

  ipcMain.on('get-post-detail', async (event, args) => {
    const { id } = args;
    try {
      const post = await findPostById(id);
      event.reply('get-post-detail-reply', { success: true, post });
    } catch (error) {
      event.reply('get-post-detail-reply', { success: false, error: error });
    }
  });

  ipcMain.on('get-video-list', async (event, args) => {
    const { category, keyword, orderType, pageNumber, pageSize } = args;
    try {
      const videoList = await findVideosByCategory(
        category,
        keyword,
        orderType,
        pageNumber,
        pageSize
      );
      event.reply('get-video-list-reply', { success: true, videoList });
    } catch (error) {
      event.reply('get-video-list-reply', { success: false, error: error });
    }
  });

  ipcMain.on('get-video-detail', async (event, args) => {
    const { id } = args;
    try {
      const video = await findVideoById(id);
      event.reply('get-video-detail-reply', { success: true, video });
    } catch (error) {
      event.reply('get-video-detail-reply', { success: false, error: error });
    }
  });

  ipcMain.on('get-fetch-data', async (event, args) => {
    const { type, category } = args;
    if (type === 'post') {
      try {
        const data = await fetchNewData(type, category);
        event.reply('get-fetch-data-reply', { success: true, data });
      } catch (error) {
        event.reply('get-fetch-data-reply', { success: false, error: error });
      }
    }
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    sequelize
      .sync()
      .then(() => {
        console.log('Database and tables created!');
      })
      .catch(err => {
        console.error('Error syncing the database:', err);
      });
    setTimeout(createWindow, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
