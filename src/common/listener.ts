import { EventEmitter } from 'events';
import { Observable, Subscription } from 'rxjs';
import { Message, ReceivedMessage } from './message';

export abstract class Listener {
    private listeners: { [name:string]: ( event: any, paylaod: any ) => void } = {};
    private ipcObservable: Observable<ReceivedMessage>;
    private subscription: Subscription = null;
    
    get message$() { return this.ipcObservable; }
    
    constructor( ipc: EventEmitter, private readonly channel: string ) {
        this.ipcObservable = Observable.create( ( observer ) => {
            let listener = ( ( event:any, msg: Message ) => {
                observer.next( new ReceivedMessage( event, msg.type, msg.payload ) );
            } );

            // add listener
            ipc.addListener( this.channel, listener );

            // remove listener when unsubscribe
            return ( () => {
                ipc.removeListener( this.channel, listener );
            } );
        } ).publish().refCount();
    }
}

