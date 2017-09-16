import { ipcRenderer } from 'electron';
import { Message } from '../common/message';
import { Sender } from '../common/sender';

export class RendererSender extends Sender {
    constructor( channel: string ) {
        super( channel );
    }

    protected send( channel: string, message: Message ) {
        ipcRenderer.send( channel, message );
    }
}

