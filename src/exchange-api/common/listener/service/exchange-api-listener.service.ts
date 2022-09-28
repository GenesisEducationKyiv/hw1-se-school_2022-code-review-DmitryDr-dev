import { Logger } from '@nestjs/common';
import { IEvent } from '../../../../event/common/interface';
import { IEventListener } from '../../../../event/event-listener/interface';

export class ExchangeApiListenerService implements IEventListener {
  private readonly logger = new Logger(ExchangeApiListenerService.name);

  public type: string;

  constructor(type: string) {
    this.type = type;
  }

  public update<T>(event: IEvent<T>) {
    this.logger.log(event);
  }
}
