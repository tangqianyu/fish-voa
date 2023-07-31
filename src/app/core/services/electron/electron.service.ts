import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer!: typeof ipcRenderer;
  webFrame!: typeof webFrame;
  childProcess!: typeof childProcess;
  fs!: typeof fs;

  constructor(private messageService: MessageService) {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (window as any).require('electron').ipcRenderer;
      this.webFrame = (window as any).require('electron').webFrame;

      this.fs = (window as any).require('fs');

      this.childProcess = (window as any).require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  getPostList(
    data: {
      category: string;
      keyword: string;
      orderType: string;
      pageNumber: number;
      pageSize: number;
    },
    callback: (post: any[]) => void
  ) {
    if (this.isElectron) {
      this.ipcRenderer.send('get-post-list', data);
      this.ipcRenderer.on('get-post-list-reply', (event, args) => {
        if (args.success) {
          callback(args.postList);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: args.error });
        }
      });
    }
  }

  getPostDetail(id: number, callback: (post: any[]) => void) {
    if (this.isElectron) {
      this.ipcRenderer.send('get-post-detail', { id });
      this.ipcRenderer.on('get-post-detail-reply', (event, args) => {
        if (args.success) {
          callback(args.post);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: args.error });
        }
      });
    }
  }

  getVideoList(
    data: {
      category: string;
      keyword: string;
      orderType: string;
      pageNumber: number;
      pageSize: number;
    },
    callback: (video: any[]) => void
  ) {
    if (this.isElectron) {
      this.ipcRenderer.send('get-video-list', data);
      this.ipcRenderer.on('get-video-list-reply', (event, args) => {
        if (args.success) {
          callback(args.videoList);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: args.error });
        }
      });
    }
  }

  getVideoDetail(id: number, callback: (video: any[]) => void) {
    if (this.isElectron) {
      this.ipcRenderer.send('get-video-detail', { id });
      this.ipcRenderer.on('get-video-detail-reply', (event, args) => {
        if (args.success) {
          callback(args.video);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: args.error });
        }
      });
    }
  }

  getFetchData(data: { type: string; category: string }, callback: (data: any) => void) {
    if (this.isElectron) {
      this.ipcRenderer.send('get-fetch-data', data);
      this.ipcRenderer.on('get-fetch-data-reply', (event, args) => {
        if (args.success) {
          callback(args.data);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: args.error });
        }
      });
    }
  }
}
