import { BrowserWindow, ipcMain } from 'electron';
import { Message } from '../common/message';
import { Sender } from '../common/sender';

export class MainSender extends Sender {
    constructor( private win: Electron.BrowserWindow, channel: string ) {
        super(channel );
    }
    
    protected send( msg: Message ) {
        this.win.webContents.send( this.channel, msg );
    }
}

