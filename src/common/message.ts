export class Message {
    constructor( public readonly type: string,
                 public readonly payload?: any ) {}
}

export class MessageEvent {
    constructor( public readonly event: any, public readonly message: Message ) {}
}