import { IEvent } from '../../common/interface';
import { IEventListener } from '../../event-listener/interface';

export interface IEventDispatcher {
  attach(listener: IEventListener, eventName: string): void;
  detach(listener: IEventListener, eventName: string): void;
  notify<T>(event: IEvent<T>): void;
}
