
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class MessageInput {
    content: string;
}

export class Message {
    content: string;
}

export abstract class IMutation {
    abstract createNewMessage(messageInput: MessageInput): Message | Promise<Message>;
}

export abstract class IQuery {
    abstract getMessages(): Message[] | Promise<Message[]>;
}

export abstract class ISubscription {
    abstract newMessage(): Message | Promise<Message>;
}

type Nullable<T> = T | null;
