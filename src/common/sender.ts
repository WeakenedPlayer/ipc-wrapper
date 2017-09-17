import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Message } from './message';

export abstract class Sender {
    private senders: Observable<Message>[] = [];
    private defaultSender: Subject<Message> = new Subject();
    private subjectOfMessageObservable: BehaviorSubject<Observable<Message>>;
    protected abstract send( channel: string, message: Message );

    // channel: IPCのチャネル名
    constructor( private readonly channel: string ) {
        this.subjectOfMessageObservable = new BehaviorSubject( this.toObservable() );
    }
    
    get message$(): Observable<Message> {
        return this.subjectOfMessageObservable
               .flatMap( observable => observable )
               .publish()
               .refCount();
    }

    private toObservable(): Observable<Message> {
        return Observable.merge( ...this.senders, this.defaultSender ).map( msg => this.send( this.channel, msg ) );
    }
    
    update() {
        this.subjectOfMessageObservable.next( this.toObservable() );
    }
    
    addSender( type: string, sender: Observable<any> ) {
        this.senders.push( sender.map( ( payload ) => new Message( type, payload ) ) );
    }

    removeAllSenders() {
        this.senders = [];
    }
    
    sendMessage( type: string, payload?: any ) {
        this.defaultSender.next( new Message( type, payload) );
    }
}
