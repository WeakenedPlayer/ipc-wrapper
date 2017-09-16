import { ipcMain } from 'electron';
import { Listener } from '../common/Listener';

export class MainListener extends Listener {
    constructor( channel: string ) {
        super( ipcMain, channel );
    }
}
