# IpcWrapper
## Usage
(Usage in other projects)
### Main Process
```ts
import { MainListener, MainSender } from 'ipc-wrapper';
import { ScreenBot, ScreenBotOption, JpegOutputOption } from '../bot';
import { BrowserWindow, ipcMain } from 'electron';
import { Subscription, Observable } from 'rxjs';

export class BotController {
    private bot: ScreenBot = new ScreenBot();
    private listener: MainListener;
    private sender: MainSender;

    private subscription: Subscription = new Subscription();
    private mergedObservables: Observable<any>;

    private initListener() {
        this.listener = new MainListener( 'command' );
        this.mergedObservables = Observable.merge( 
                this.listener.extract<string>( 'login' ).map( token => this.bot.login( token ) ),
                this.listener.extract<void>( 'logout' ).map( () => this.bot.logout() ),
                this.listener.extract<string>( 'start' ).map( channelId => this.bot.startPostingTo( channelId ) ),
                this.listener.extract<void>( 'stop' ).map( () => this.bot.stopPostiong() ),
                this.listener.extract<ScreenBotOption>( 'config' ).map( option => this.bot.configure( option ) )
        );
    }
    
    private initSender() {
        this.sender = new MainSender( this.win.webContents, 'client' );
        this.sender.addSender( 'app', this.bot.app$ );
        this.sender.addSender( 'channel', this.bot.channel$ );
        this.sender.addSender( 'guild', this.bot.guild$ );
        this.sender.addSender( 'state', this.bot.state$ );
        this.sender.update();
    }
    
    constructor( private win: Electron.BrowserWindow ) {
        this.initListener();
        this.initSender();
    }
    
    init() {
        this.subscription.add( this.mergedObservables.subscribe() );
        this.subscription.add( this.sender.message$.subscribe() ); 
    }
    
    destroy() {
        this.subscription.unsubscribe();
    }
}


```
### Renderer Process
```ts
import { Channel, Guild, ClientState, OAuth2App, ScreenBotOption, JpegOutputOption } from '../../@common';
import { Observable, Subscription } from 'rxjs'; 
import { RendererListener, RendererSender } from 'ipc-wrapper';

export class DiscordClient {
    // ipc wrapper
    private listener: RendererListener;
    private sender: RendererSender;

    // observables
    private appObservable: Observable<OAuth2App>;
    private channelObservable: Observable<Channel>;
    private stateObservable: Observable<ClientState>;
    private guildObservable: Observable<Guild>;

    private subscription: Subscription = new Subscription();

    // getter
    get app$() { return this.appObservable }
    get channel$() { return this.channelObservable }
    get guild$() { return this.guildObservable }
    get state$() { return this.stateObservable }

    constructor() {
        this.listener = new RendererListener( 'client' );
        this.sender = new RendererSender( 'command' );
    }
    
    login( token: string ) {
        this.sender.sendMessage( 'login', token );
    }
    
    logout() {
        this.sender.sendMessage( 'logout' );
    }
    
    start() {
        this.sender.sendMessage( 'start', 'channel id here' );
    }
    
    stop() {
        this.sender.sendMessage( 'stop' );
    }
    
    configure() {
        this.sender.sendMessage( 'config', { filter: '<SourceDirectory>/*.png', workDir: '<WorkingDirectory>' } );
    }
    
    init() {
        this.appObservable = this.listener.extract<OAuth2App>( 'app' ).publish().refCount();
        this.channelObservable = this.listener.extract<Channel>( 'channel' ).publish().refCount();
        this.guildObservable = this.listener.extract<Guild>( 'guild' ).publish().refCount();
        this.stateObservable = this.listener.extract<ClientState>( 'state' ).publish().refCount();
        this.subscription.add( this.sender.message$.subscribe() );
    }

    destroy() {
        this.subscription.unsubscribe();
    }
}
```


## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)