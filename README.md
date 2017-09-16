# IpcWrapper
## Usage

```ts
import { MainListener, MainSender } from 'ipc-wrapper';
import { ScreenBot } from './bot';
import { BrowserWindow, ipcMain } from 'electron';
import { Subscription } from 'rxjs';

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
        this.sender.addSender( 'result', this.bot.app$ );
        this.sender.start();
    }
}
```

## Licence

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)