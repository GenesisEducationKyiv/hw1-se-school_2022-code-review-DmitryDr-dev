import { IEvent } from '../../common/interface';

export interface IEventListener {
  type: string;

  update<T>(event: IEvent<T>): void;
}
