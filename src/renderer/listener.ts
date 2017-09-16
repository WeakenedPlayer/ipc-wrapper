import { ipcRenderer } from 'electron';
import { Listener } from '../common/Listener';

export class RendererListener extends Listener {
    constructor( channel: string ) {
        super( ipcRenderer, channel );
    }
}
