import { BrowserWindow, ipcMain, webContents } from 'electron';
import { Message, ReceivedMessage } from '../common/message';
import { Sender } from '../common/sender';

export class MainSender extends Sender {
    fromWindow( win: Electron.BrowserWindow, channel: string ) { 
        return new MainSender( win.webContents, channel );
    }
    
    fromMessageEvent( messageEvent: ReceivedMessage, channel: string ) {
        return new MainSender( messageEvent.from.sender, channel );
    }
    
    constructor( private sender: Electron.WebContents, channel: string ) {
        super( channel );
    }
    
    protected send( channel: string, msg: Message ) {
        this.sender.send( channel, msg );
    }
}
