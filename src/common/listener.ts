import { EventEmitter } from 'events';
import { Observable, Subscription } from 'rxjs';
import { Message } from './message';

export abstract class Listener {
    private listeners: { [name:string]: ( event: any, paylaod: any ) => void } = {};
    private ipcObservable: Observable<Message>;
    private subscription: Subscription = null;
    constructor( ipc: EventEmitter, private readonly channel: string ) {
        this.ipcObservable = Observable.create( ( observer ) => {
            let callback = ( ( event:any, arg: Message ) => {
                let listener = this.listeners[ arg.type ];
                
                if( listener ) {
                    listener( event, arg.payload );
                }
            } );

            // add listener
            ipc.addListener( this.channel, callback );

            // remove listener when unsubscribe
            return ( () => {
                ipc.removeListener( this.channel, callback );
            } );
        } );
    }
    
    start(){
        if( this.subscription === null || this.subscription.closed ) {
            this.subscription = this.ipcObservable.subscribe();     
        }
    }
    
    stop(){
        if( this.subscription !== null || !this.subscription.closed ) {
            this.subscription.unsubscribe();
        }
    }
    
    setListener( type: string, listener: ( event: any, paylaod: any ) => void ) {
        this.listeners[ type ] = listener;
    }
}

