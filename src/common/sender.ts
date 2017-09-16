import { Observable, Subscription } from 'rxjs';
import { Message } from './message';

export abstract class Sender {
    private senders: Observable<Message>[] = [];
    private mergedObservable: Observable<Message> = null;
    private subscription: Subscription = new Subscription();
    constructor( protected readonly channel: string ) {
    }
    
    abstract send( message: Message );
    
    start() {
        this.stop();
        this.mergedObservable = Observable.merge( ...this.senders );
        this.subscription = this.mergedObservable.map( msg => {
            this.send( msg );
        } ).subscribe();
    }
    
    stop() {
        if( !this.subscription.closed ) {
            this.subscription.unsubscribe();
            this.subscription = new Subscription();
        }
    }
    
    addSender( type: string, sender: Observable<any> ) {
        this.senders.push( sender.map( ( payload ) => new Message( type, payload ) ) );
    }

    removeAllSenders() {
        this.senders = [];
    }
    
    sendMessage( type: string, payload: any ) {
        this.send( new Message( type, payload) );
    }
}
