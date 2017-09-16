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
	private someObservable: Observable<string>;
    private subscription: Subscription;
    constructor( private win: Electron.BrowserWindow ) {
    	this.someObservable = Observable.of( [ 'a', 'b', 'c' ] );
    
        this.listener = new MainListener( 'command' );
        this.listener.setListener( 'login', ( event, param ) => { console.log( 'login.') } );
        this.listener.setListener( 'logout', ( event, param ) => { console.log( 'logout.') } );
        this.listener.start();
        
        this.sender = new MainSender( this.win, 'response' );
        this.sender.sendMessage( 'result', 'ok' );
        this.sender.start();
    }
}
```
### Renderer Process

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)