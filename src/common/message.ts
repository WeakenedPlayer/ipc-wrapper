export class Message {
    constructor( public readonly type: string,
                 public readonly payload?: any ) {}
}

export class ReceivedMessage {
    constructor( public readonly from: any,
                 public readonly type: string,
                 public readonly payload?: any) {}
}
