# IpcWrapper
## Usage
### Main Process
```ts
import { MainListener, MainSender } from 'ipc-wrapper';
import { BrowserWindow, ipcMain } from 'electron';
import { Subscription, Observable } from 'rxjs';

export class TestClass {
    private listener: MainListener;
    private sender: MainSender;
    private subscription: Subscription;
    constructor( private win: Electron.BrowserWindow ) {
        this.listener = new MainListener( 'command' );
        this.listener.setListener( 'login', ( event, param ) => { console.log( 'login.') } );
        this.listener.setListener( 'logout', ( event, param ) => { console.log( 'logout.') } );
        this.listener.start();
        
        this.sender = new MainSender( this.win, 'response' );
        this.sender.start();
        this.sender.sendMessage( 'result', 'ok' );
    }
}
```
### Renderer Process
```ts
import { RendererListener, RendererSender } from 'ipc-wrapper';

export class ClientController {
    private listener: RendererListener;
    private sender: RendererSender;
    
    constructor() {
        this.listener = new RendererListener( 'response' );
        this.sender = new RendererSender( 'command' );
        
        this.listener.setListener( 'response', ( event, payload ) => {
            console.log( payload );
        } );
    }
    
    login( token: string ) {
        this.sender.sendMessage( 'login', token );
    }
    
    logout() {
        this.sender.sendMessage( 'logout' );
    }
    
    start() {
        this.listener.start();
        this.sender.start();
    }
    
    stop() {
        this.listener.stop();
        this.sender.stop();
    }
}
```


## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)