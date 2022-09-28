import { Injectable } from '@nestjs/common';
import { IEvent } from '../../common/interface';
import { IEventListener } from '../../event-listener/interface';
import { IEventDispatcher } from '../interface';

interface ListenerMap {
  [event: string]: Array<IEventListener>;
}

@Injectable()
export class EventDispatcherService implements IEventDispatcher {
  private listeners: ListenerMap;

  constructor() {
    this.listeners = {};
  }

  public attach(listener: IEventListener, eventName: string): void {
    const { type: listenerType } = listener;

    if (this.listeners[eventName]?.find((el) => el.type === listenerType))
      throw new Error(
        `The ${listenerType} for ${eventName} is already attached`,
      );

    if (!this.listeners[eventName]) this.listeners[eventName] = [];
    this.listeners[eventName].push(listener);
  }

  public detach(listener: IEventListener, eventName: string): void {
    const { type: listenerType } = listener;
    const listenerIdx = this.listeners[eventName].findIndex(
      (el) => el.type === listenerType,
    );

    if (listenerIdx === -1)
      throw new Error(`The ${listenerType} for ${eventName} is not attached`);

    this.listeners[eventName].splice(listenerIdx, 1);
  }

  public notify<T>(event: IEvent<T>): void {
    const listeners = this.listeners[event.name];

    if (!listeners)
      throw new Error(`The listeners for ${event.name} aren't attached`);

    listeners.map((el) => el.update(event));
  }
}
